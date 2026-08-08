# 5 Alive — Engine Design

Design reference for implementing 5 Alive as a digital game engine (single-player vs AI, local multiplayer, or online). Pairs with `RULES.md`.

---

## 1. Core Data Model

```
Card
  id: string
  type: "number" | "wild"
  value: number            // 0-7, only for number cards
  wildKind: WildKind        // only for wild cards, see enum below
  facing: "up" | "down"     // for A-L-I-V-E cards only

WildKind (enum)
  BOMB
  HAND_IN_REDEAL
  SET_TO_0
  SET_TO_10
  SET_TO_21
  DRAW_1
  DRAW_2
  REVERSE
  SKIP
  PASS_ME_BY

Player
  id: string
  name: string
  hand: Card[]
  aliveCards: Card[5]       // fixed 5 slots, each "up" or "down"
  lives: number              // derived = count of "up" aliveCards
  isEliminated: boolean
  teamId?: string            // used only in team variant

GameState
  players: Player[]
  deck: Card[]                // draw pile, face-down
  discardPile: Card[]
  runningTotal: number        // 0-21
  currentPlayerIndex: number
  direction: 1 | -1           // for Reverse
  turnOrder: string[]         // player ids, respects direction
  variant: "standard" | "suddenDeath" | "team"
  status: "setup" | "inProgress" | "roundEnd" | "gameOver"
  winnerId?: string | null    // player id or team id
  pendingEffect?: PendingEffect | null   // e.g. awaiting Bomb target/escape
  log: GameEvent[]
```

---

## 2. Setup Phase

```
function setupGame(players, variant):
    deck = buildDeck()          # 72 number cards + wild cards per RULES.md §1
    shuffle(deck)
    for player in players:
        player.hand = draw(deck, HAND_SIZE)      # default 7
        player.aliveCards = buildAliveSet(variant)
        # standard: 5 cards, suddenDeath: 1 card, team: 5 shared per team
    runningTotal = 0
    currentPlayerIndex = 0
    status = "inProgress"
```

Notes:
- `buildAliveSet` should return distinct card objects per player (or shared per team, see §6).
- Reshuffle `discardPile` into `deck` if the deck empties mid-game.

---

## 3. Turn Loop

```
function playTurn(playerId, cardId, target?):
    player = getPlayer(playerId)
    assert player.id == turnOrder[currentPlayerIndex]
    card = removeFromHand(player, cardId)

    if card.type == "number":
        resolveNumberCard(card)
    else:
        resolveWildCard(card, player, target)

    checkHandEmpty(player)      # triggers "empty hand" rule if applicable
    checkDeckRefill()
    advanceTurn()
```

### 3.1 Number Card Resolution

```
function resolveNumberCard(card):
    newTotal = runningTotal + card.value
    if newTotal > 21:
        bust(currentPlayer)
    else:
        runningTotal = newTotal
        discardPile.push(card)
```

### 3.2 Bust Resolution

```
function bust(player):
    flipOneAliveCard(player)         # topmost "up" -> "down"
    runningTotal = 0
    discardPile = []                  # or fold into deck, per house rule
    emit(GameEvent.BUST, player.id)
    checkElimination(player)
```

### 3.3 Elimination Check

```
function checkElimination(player):
    if all(c.facing == "down" for c in player.aliveCards):
        player.isEliminated = true
        removeFromTurnOrder(player.id)
        checkWinCondition()
```

### 3.4 Win Condition

```
function checkWinCondition():
    active = players not eliminated (or teams, in team variant)
    if len(active) == 1:
        status = "gameOver"
        winnerId = active[0].id
    elif deck is empty and no valid moves remain:
        winnerId = mostAliveCardsRemaining(active)  # tiebreak: lowest hand value
        status = "gameOver"
```

---

## 4. Wild Card Effects

Each wild card is a discrete effect function. Keep them pure and independently testable.

```
function resolveWildCard(card, player, target):
    switch card.wildKind:
        case BOMB:
            applyBomb(target ?? allOtherPlayers())
        case HAND_IN_REDEAL:
            handInAndRedeal()
        case SET_TO_0:
            runningTotal = 0
        case SET_TO_10:
            runningTotal = 10
        case SET_TO_21:
            runningTotal = 21
        case DRAW_1:
            drawCards(target, 1)
        case DRAW_2:
            drawCards(target, 2)
        case REVERSE:
            direction *= -1
        case SKIP:
            skipNextPlayer()
        case PASS_ME_BY:
            grantExtraTurn(player)
    discardPile.push(card)
```

### 4.1 Bomb — escape-card check

```
function applyBomb(targets):
    for t in targets:
        if hasEscapeCard(t, value=0):          # per RULES.md, "0" cards can block Bomb
            promptEscapeUse(t)                  # let player choose to discard a 0 to block
        else:
            flipOneAliveCard(t)
            checkElimination(t)
```

Use `pendingEffect` on `GameState` to model the async "does the target want to use an escape card?" decision — this is the one place the engine needs a mid-effect player prompt.

---

## 5. Empty-Hand Rule

```
function checkHandEmpty(player):
    if player.hand.length == 0:
        if variant == "team":
            opposingTeam = getOpposingTeam(player.teamId)
            flipOneAliveCard(opposingTeam)        # only ONE life lost, shared pool
        else:
            for other in activePlayers() where other.id != player.id:
                flipOneAliveCard(other)
        # redeal or end round per house rule
```

---

## 6. Team Variant Notes

- Alive cards are pooled: model as `Team.aliveCards[5]` instead of per-player.
- Seat order must alternate teams — validate at setup, don't just trust input.
- `checkElimination` operates on the team object, not individual players.
- Turn order still cycles per player; only life totals are shared.

---

## 7. Sudden Death Variant Notes

- `buildAliveSet` returns a length-1 array.
- One bust or one unblocked Bomb hit → immediate elimination.
- Everything else (turn loop, wild cards) is unchanged — this variant only changes life count.

---

## 8. Suggested Module Layout

```
/engine
  deck.js            # buildDeck, shuffle, draw, reshuffleDiscard
  state.js           # GameState shape, setupGame
  turn.js            # playTurn, advanceTurn, skip/reverse handling
  wildcards.js       # one function per WildKind
  win.js             # checkElimination, checkWinCondition, tiebreak logic
  variants.js         # standard / suddenDeath / team differences
  events.js          # GameEvent log + emit() for UI hooks
```

## 9. UI / Client Hooks

Emit a `GameEvent` for every state change so a UI layer can animate without re-deriving logic:

```
GameEvent types:
  CARD_PLAYED, BUST, ALIVE_CARD_FLIPPED, PLAYER_ELIMINATED,
  WILD_EFFECT, TURN_SKIPPED, DIRECTION_REVERSED,
  HAND_EMPTIED, ROUND_RESET, GAME_OVER
```

Keep all randomness (shuffling, draws) inside the engine and seed-able, so games can be replayed/tested deterministically.
