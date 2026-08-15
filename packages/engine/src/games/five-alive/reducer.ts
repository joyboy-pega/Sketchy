import { createFiveAliveDeck, shuffleDeck } from './deck.js';
import type {
  FiveAliveCard,
  FiveAliveGameState,
  FiveAlivePlayer,
  PlayDirection,
} from './types.js';

export function startFiveAliveGame(
  playerInputs: { id: string; name: string }[],
  seed = 'five-alive-seed',
): FiveAliveGameState {
  const fullDeck = shuffleDeck(createFiveAliveDeck(), seed);
  let deckIndex = 0;

  const players: FiveAlivePlayer[] = playerInputs.map((p) => {
    const hand = fullDeck.slice(deckIndex, deckIndex + 10);
    deckIndex += 10;
    return {
      id: p.id,
      name: p.name,
      lives: 5,
      hand,
      isEliminated: false,
    };
  });

  const remainingDeck = fullDeck.slice(deckIndex);

  return {
    runningTotal: 0,
    direction: 'cw',
    currentTurnPlayerId: players[0]?.id ?? null,
    drawDeck: remainingDeck,
    discardPile: [],
    players,
    winnerId: null,
    round: 1,
    lastPlayedCard: null,
    message: 'Game started! Keep running total <= 21.',
  };
}

export function startNewRound(state: FiveAliveGameState, seed = 'round-seed'): FiveAliveGameState {
  const activePlayers = state.players.filter((p) => !p.isEliminated);
  if (activePlayers.length <= 1) {
    const winner = activePlayers[0];
    return {
      ...state,
      winnerId: winner ? winner.id : null,
      message: winner ? `${winner.name} won the game!` : 'Game over!',
    };
  }

  const fullDeck = shuffleDeck(createFiveAliveDeck(), `${seed}:${state.round}`);
  let deckIndex = 0;

  const players = state.players.map((p) => {
    if (p.isEliminated) return p;
    const hand = fullDeck.slice(deckIndex, deckIndex + 10);
    deckIndex += 10;
    return {
      ...p,
      hand,
    };
  });

  const remainingDeck = fullDeck.slice(deckIndex);

  return {
    ...state,
    runningTotal: 0,
    round: state.round + 1,
    drawDeck: remainingDeck,
    discardPile: [],
    players,
    lastPlayedCard: null,
    message: `Round ${state.round + 1} started!`,
  };
}

function getNextTurnPlayerId(
  players: FiveAlivePlayer[],
  currentId: string,
  direction: PlayDirection,
  skipCount = 1,
): string {
  const active = players.filter((p) => !p.isEliminated);
  if (active.length === 0) return currentId;

  const currentIdx = active.findIndex((p) => p.id === currentId);
  const step = direction === 'cw' ? 1 : -1;
  const nextIdx = (currentIdx + step * skipCount + active.length * 100) % active.length;
  return active[nextIdx]!.id;
}

export function playCard(
  state: FiveAliveGameState,
  playerId: string,
  cardId: string,
): FiveAliveGameState {
  if (state.winnerId) return state; // Game over
  if (state.currentTurnPlayerId !== playerId) return state; // Not your turn

  const player = state.players.find((p) => p.id === playerId);
  if (!player || player.isEliminated) return state;

  const card = player.hand.find((c) => c.id === cardId);
  if (!card) return state;

  // 1. Remove card from player hand
  const newHand = player.hand.filter((c) => c.id !== cardId);
  let runningTotal = state.runningTotal;
  let direction = state.direction;
  let skipNext = false;
  let message = `${player.name} played ${card.label}.`;

  // 2. Evaluate card effect
  switch (card.type) {
    case 'number':
      runningTotal += card.value ?? 0;
      break;
    case 'set_21':
      runningTotal = 21;
      break;
    case 'five_alive':
      runningTotal = 0;
      message = `${player.name} played 5 HEARTS! Total reset to 0.`;
      break;
    case 'pass':
      // Total does not change
      break;
    case 'skip':
      skipNext = true;
      message = `${player.name} played SKIP!`;
      break;
    case 'reverse':
      direction = direction === 'cw' ? 'ccw' : 'cw';
      message = `${player.name} reversed play direction!`;
      break;
    case 'bomb':
      runningTotal = Math.max(0, runningTotal - 5);
      break;
  }

  const updatedPlayers = state.players.map((p) =>
    p.id === playerId ? { ...p, hand: newHand } : p,
  );

  // 3. Check for Over 21 Heart Loss
  if (runningTotal > 21) {
    message = `${player.name} went over 21 (${runningTotal}) and lost 1 heart!`;
    const penalizedPlayers = updatedPlayers.map((p) => {
      if (p.id === playerId) {
        const newLives = p.lives - 1;
        return { ...p, lives: newLives, isEliminated: newLives <= 0 };
      }
      return p;
    });

    const activeRemaining = penalizedPlayers.filter((p) => !p.isEliminated);
    if (activeRemaining.length <= 1) {
      const winner = activeRemaining[0];
      return {
        ...state,
        runningTotal: 0,
        players: penalizedPlayers,
        winnerId: winner ? winner.id : null,
        message: winner ? `${winner.name} won 5 Hearts!` : 'Game Over!',
      };
    }

    return startNewRound({
      ...state,
      players: penalizedPlayers,
      message,
    });
  }

  // 4. Check for Hand Cleared (Player emptied hand -> Round Win)
  if (newHand.length === 0) {
    message = `${player.name} emptied their hand! All other players lose 1 heart.`;
    const penalizedPlayers = updatedPlayers.map((p) => {
      if (p.id !== playerId && !p.isEliminated) {
        const newLives = p.lives - 1;
        return { ...p, lives: newLives, isEliminated: newLives <= 0 };
      }
      return p;
    });

    const activeRemaining = penalizedPlayers.filter((p) => !p.isEliminated);
    if (activeRemaining.length <= 1) {
      const winner = activeRemaining[0];
      return {
        ...state,
        runningTotal: 0,
        players: penalizedPlayers,
        winnerId: winner ? winner.id : null,
        message: winner ? `${winner.name} won 5 Hearts!` : 'Game Over!',
      };
    }

    return startNewRound({
      ...state,
      players: penalizedPlayers,
      message,
    });
  }

  // 5. Advance Turn
  const nextPlayerId = getNextTurnPlayerId(
    updatedPlayers,
    playerId,
    direction,
    skipNext ? 2 : 1,
  );

  return {
    ...state,
    runningTotal,
    direction,
    currentTurnPlayerId: nextPlayerId,
    discardPile: [card, ...state.discardPile],
    players: updatedPlayers,
    lastPlayedCard: card,
    message,
  };
}
