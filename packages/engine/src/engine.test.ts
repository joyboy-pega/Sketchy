import { describe, expect, it } from 'vitest';
import { applyAction } from './apply-action.js';
import { createGame, defaultSettings } from './create-game.js';
import { redactFor } from './redact-for.js';

describe('Generic Game Engine', () => {
  it('creates initial lobby state', () => {
    const game = createGame(defaultSettings(), [
      { id: 'p1', name: 'Alice', seat: 0, connected: true, isReady: false, score: 0, hasLeft: false, data: {} },
    ]);

    expect(game.phase).toBe('lobby');
    expect(game.hostId).toBe('p1');
    expect(game.players.length).toBe(1);
  });

  it('allows players to join and toggle ready', () => {
    let game = createGame(defaultSettings(), [
      { id: 'p1', name: 'Alice', seat: 0, connected: true, isReady: false, score: 0, hasLeft: false, data: {} },
    ]);

    const joinRes = applyAction(game, {
      type: 'join',
      at: 1000,
      playerId: 'p2',
      player: { id: 'p2', name: 'Bob' },
    });

    expect(joinRes.error).toBeUndefined();
    game = joinRes.state;
    expect(game.players.length).toBe(2);

    const readyRes = applyAction(game, {
      type: 'setReady',
      at: 2000,
      playerId: 'p2',
      ready: true,
    });

    expect(readyRes.error).toBeUndefined();
    expect(readyRes.state.players[1]?.isReady).toBe(true);
  });

  it('starts game and handles turns', () => {
    let game = createGame(defaultSettings(), [
      { id: 'p1', name: 'Alice', seat: 0, connected: true, isReady: true, score: 0, hasLeft: false, data: {} },
      { id: 'p2', name: 'Bob', seat: 1, connected: true, isReady: true, score: 0, hasLeft: false, data: {} },
    ]);

    const startRes = applyAction(game, {
      type: 'start',
      at: 1000,
      playerId: 'p1',
    });

    expect(startRes.error).toBeUndefined();
    game = startRes.state;
    expect(game.phase).toBe('playing');
    expect(game.currentTurnPlayerId).toBe('p1');

    const nextTurnRes = applyAction(game, {
      type: 'nextTurn',
      at: 2000,
      playerId: 'p1',
    });

    expect(nextTurnRes.error).toBeUndefined();
    expect(nextTurnRes.state.currentTurnPlayerId).toBe('p2');
  });

  it('handles game over and reset to lobby', () => {
    let game = createGame(defaultSettings(), [
      { id: 'p1', name: 'Alice', seat: 0, connected: true, isReady: true, score: 0, hasLeft: false, data: {} },
      { id: 'p2', name: 'Bob', seat: 1, connected: true, isReady: true, score: 0, hasLeft: false, data: {} },
    ]);

    game = applyAction(game, { type: 'start', at: 1000, playerId: 'p1' }).state;

    const endRes = applyAction(game, {
      type: 'endGame',
      at: 2000,
      playerId: 'p1',
      winnerPlayerId: 'p1',
    });

    expect(endRes.error).toBeUndefined();
    game = endRes.state;
    expect(game.phase).toBe('game_over');
    expect(game.scoreboard['p1']).toBe(1);

    const resetRes = applyAction(game, {
      type: 'resetToLobby',
      at: 3000,
      playerId: 'p1',
    });

    expect(resetRes.error).toBeUndefined();
    expect(resetRes.state.phase).toBe('lobby');
  });

  it('redacts sensitive seed for client view', () => {
    const game = createGame(defaultSettings(), [], 'secret-rng-seed');
    const redacted = redactFor(game, 'spectator');

    expect(redacted.seed).toBe('');
  });
});
