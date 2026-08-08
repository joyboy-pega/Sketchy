import type { GameAction } from './actions.js';
import type { GameEffect } from './effects.js';
import type { GameState, Player } from './types.js';

export type EngineErrorCode =
  | 'validation'
  | 'room_full'
  | 'name_taken_in_room'
  | 'not_host'
  | 'not_your_turn'
  | 'wrong_phase';

export interface ApplyResult {
  state: GameState;
  effects: GameEffect[];
  error?: EngineErrorCode;
}

function ok(state: GameState, effects: GameEffect[] = []): ApplyResult {
  return { state, effects };
}

function reject(state: GameState, error: EngineErrorCode): ApplyResult {
  return { state, effects: [], error };
}

export function applyAction(state: GameState, action: GameAction): ApplyResult {
  switch (action.type) {
    case 'join': {
      if (state.phase !== 'lobby') return reject(state, 'wrong_phase');
      if (state.players.length >= state.settings.maxPlayers) return reject(state, 'room_full');
      if (state.players.some((p) => p.name.toLowerCase() === action.player.name.toLowerCase())) {
        return reject(state, 'name_taken_in_room');
      }

      const newPlayer: Player = {
        id: action.player.id,
        name: action.player.name,
        avatar: action.player.avatar,
        seat: state.players.length,
        connected: true,
        isReady: false,
        score: 0,
        hasLeft: false,
        data: {},
      };

      const players = [...state.players, newPlayer];
      const hostId = state.hostId || newPlayer.id;

      return ok({ ...state, players, hostId });
    }

    case 'leave': {
      const playerIndex = state.players.findIndex((p) => p.id === action.playerId);
      if (playerIndex === -1) return reject(state, 'validation');

      if (state.phase === 'lobby') {
        const players = state.players
          .filter((p) => p.id !== action.playerId)
          .map((p, idx) => ({ ...p, seat: idx }));
        const hostId =
          state.hostId === action.playerId ? (players[0]?.id ?? '') : state.hostId;
        return ok({ ...state, players, hostId });
      }

      const players = state.players.map((p) =>
        p.id === action.playerId ? { ...p, connected: false, hasLeft: true } : p,
      );
      return ok({ ...state, players });
    }

    case 'setReady': {
      if (state.phase !== 'lobby') return reject(state, 'wrong_phase');
      const players = state.players.map((p) =>
        p.id === action.playerId ? { ...p, isReady: action.ready } : p,
      );
      return ok({ ...state, players });
    }

    case 'updateSettings': {
      if (action.playerId !== state.hostId) return reject(state, 'not_host');
      if (state.phase !== 'lobby') return reject(state, 'wrong_phase');
      return ok({
        ...state,
        settings: { ...state.settings, ...action.patch },
      });
    }

    case 'kick': {
      if (action.playerId !== state.hostId) return reject(state, 'not_host');
      if (state.phase !== 'lobby') return reject(state, 'wrong_phase');
      if (action.targetId === state.hostId) return reject(state, 'validation');

      const players = state.players
        .filter((p) => p.id !== action.targetId)
        .map((p, idx) => ({ ...p, seat: idx }));
      return ok({ ...state, players });
    }

    case 'start': {
      if (action.playerId !== state.hostId) return reject(state, 'not_host');
      if (state.phase !== 'lobby') return reject(state, 'wrong_phase');
      if (state.players.length < state.settings.minPlayers) return reject(state, 'validation');

      const firstTurnPlayerId = state.players[0]?.id ?? null;
      const turnDuration = state.settings.turnDurationSec;
      const phaseEndsAt = turnDuration ? action.at + turnDuration * 1000 : null;

      const effects: GameEffect[] = phaseEndsAt
        ? [{ type: 'startTimer', endsAt: phaseEndsAt }]
        : [];

      return ok(
        {
          ...state,
          phase: 'playing',
          round: 1,
          currentTurnPlayerId: firstTurnPlayerId,
          phaseEndsAt,
          customState: action.customPayload ? { ...action.customPayload } : state.customState,
        },
        effects,
      );
    }

    case 'gameAction': {
      if (state.phase !== 'playing') return reject(state, 'wrong_phase');
      return ok({
        ...state,
        customState: {
          ...state.customState,
          lastAction: {
            actorId: action.playerId,
            name: action.actionName,
            payload: action.payload,
            at: action.at,
          },
        },
      });
    }

    case 'nextTurn': {
      if (state.phase !== 'playing') return reject(state, 'wrong_phase');
      const currentIdx = state.players.findIndex((p) => p.id === state.currentTurnPlayerId);
      const nextIdx = (currentIdx + 1) % state.players.length;
      const nextTurnPlayerId = state.players[nextIdx]?.id ?? null;

      return ok({
        ...state,
        currentTurnPlayerId: nextTurnPlayerId,
      });
    }

    case 'endGame': {
      if (action.playerId !== state.hostId) return reject(state, 'not_host');
      if (state.phase !== 'playing') return reject(state, 'wrong_phase');

      const winnerId = action.winnerPlayerId ?? null;
      const scoreboard = { ...state.scoreboard };
      if (winnerId) {
        scoreboard[winnerId] = (scoreboard[winnerId] ?? 0) + 1;
      }

      return ok(
        {
          ...state,
          phase: 'game_over',
          winnerPlayerId: winnerId,
          scoreboard,
          phaseEndsAt: null,
        },
        [{ type: 'clearTimer' }, { type: 'persistGame' }],
      );
    }

    case 'resetToLobby': {
      if (action.playerId !== state.hostId) return reject(state, 'not_host');
      if (state.phase !== 'game_over') return reject(state, 'wrong_phase');

      const activePlayers = state.players
        .filter((p) => !p.hasLeft)
        .map((p, idx) => ({ ...p, seat: idx, isReady: false }));

      return ok(
        {
          ...state,
          phase: 'lobby',
          round: 0,
          players: activePlayers,
          currentTurnPlayerId: null,
          winnerPlayerId: null,
          phaseEndsAt: null,
          gamesPlayedInRoom: state.gamesPlayedInRoom + 1,
        },
        [{ type: 'clearTimer' }],
      );
    }

    case 'presence': {
      const player = state.players.find((p) => p.id === action.playerId);
      if (!player) return reject(state, 'validation');
      const players = state.players.map((p) =>
        p.id === action.playerId ? { ...p, connected: action.connected } : p,
      );
      return ok({ ...state, players });
    }

    case 'migrateHost': {
      const target = state.players.find((p) => p.id === action.newHostId);
      if (!target) return reject(state, 'validation');
      return ok({ ...state, hostId: action.newHostId });
    }

    case 'timeout': {
      if (action.phase !== state.phase) return reject(state, 'wrong_phase');
      return ok(state);
    }

    default:
      return reject(state, 'validation');
  }
}
