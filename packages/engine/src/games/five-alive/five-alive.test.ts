import { describe, expect, it } from 'vitest';
import { playCard, startFiveAliveGame } from './reducer.js';
import type { FiveAliveCard } from './types.js';

const dummyCard: FiveAliveCard = { id: 'c-dummy', type: 'number', value: 1, label: '1' };

describe('5 Alive Card Game Engine', () => {
  it('starts a 5 Alive game with 5 lives per player', () => {
    const game = startFiveAliveGame([
      { id: 'p1', name: 'Alice' },
      { id: 'p2', name: 'Bob' },
    ]);

    expect(game.players.length).toBe(2);
    expect(game.players[0]?.lives).toBe(5);
    expect(game.players[1]?.lives).toBe(5);
    expect(game.runningTotal).toBe(0);
    expect(game.currentTurnPlayerId).toBe('p1');
    expect(game.players[0]?.hand.length).toBe(10);
  });

  it('updates running total when playing number cards', () => {
    let game = startFiveAliveGame([
      { id: 'p1', name: 'Alice' },
      { id: 'p2', name: 'Bob' },
    ]);

    const numCard = game.players[0]?.hand.find((c) => c.type === 'number');
    expect(numCard).toBeDefined();

    game = playCard(game, 'p1', numCard!.id);

    expect(game.runningTotal).toBe(numCard!.value);
    expect(game.currentTurnPlayerId).toBe('p2');
  });

  it('handles 5 ALIVE reset card', () => {
    let game = startFiveAliveGame([
      { id: 'p1', name: 'Alice' },
      { id: 'p2', name: 'Bob' },
    ]);

    game.runningTotal = 18;
    const fiveAliveCard: FiveAliveCard = { id: 'c-5a', type: 'five_alive', label: '5 ALIVE' };
    game.players[0]!.hand = [fiveAliveCard, dummyCard];

    game = playCard(game, 'p1', 'c-5a');

    expect(game.runningTotal).toBe(0);
  });

  it('handles SET 21 card', () => {
    let game = startFiveAliveGame([
      { id: 'p1', name: 'Alice' },
      { id: 'p2', name: 'Bob' },
    ]);

    const set21Card: FiveAliveCard = { id: 'c-21', type: 'set_21', label: '= 21' };
    game.players[0]!.hand = [set21Card, dummyCard];

    game = playCard(game, 'p1', 'c-21');

    expect(game.runningTotal).toBe(21);
  });

  it('deducts life when player exceeds 21', () => {
    let game = startFiveAliveGame([
      { id: 'p1', name: 'Alice' },
      { id: 'p2', name: 'Bob' },
    ]);

    game.runningTotal = 20;
    const num7: FiveAliveCard = { id: 'c-7', type: 'number', value: 7, label: '7' };
    game.players[0]!.hand = [num7, dummyCard];

    game = playCard(game, 'p1', 'c-7');

    // Alice went to 27 (>21), lost 1 life (lives 5 -> 4), new round started with running total 0
    expect(game.players[0]?.lives).toBe(4);
    expect(game.runningTotal).toBe(0);
  });

  it('resets round and penalizes other players when a player empties their hand', () => {
    let game = startFiveAliveGame([
      { id: 'p1', name: 'Alice' },
      { id: 'p2', name: 'Bob' },
    ]);

    const lastCard: FiveAliveCard = { id: 'c-last', type: 'number', value: 2, label: '2' };
    game.players[0]!.hand = [lastCard];

    game = playCard(game, 'p1', 'c-last');

    // Alice emptied hand -> round won! Bob loses 1 life (5 -> 4).
    expect(game.players[1]?.lives).toBe(4);
    expect(game.runningTotal).toBe(0);
  });
});
