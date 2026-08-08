import type { GameSettings, GameState, Player } from './types.js';
import { DEFAULT_MAX_PLAYERS, DEFAULT_TURN_DURATION_SEC, MIN_PLAYERS } from './constants.js';

export function defaultSettings(): GameSettings {
  return {
    minPlayers: MIN_PLAYERS,
    maxPlayers: DEFAULT_MAX_PLAYERS,
    turnDurationSec: DEFAULT_TURN_DURATION_SEC,
    customSettings: {},
  };
}

export function createGame(
  settings: GameSettings = defaultSettings(),
  players: Player[] = [],
  seed = 'default-seed',
  now = 0,
): GameState {
  const lobbyPlayers = players.map((p, seat) => ({
    ...p,
    seat,
    score: p.score ?? 0,
    isReady: p.isReady ?? false,
    connected: p.connected ?? true,
    hasLeft: false,
    data: p.data ?? {},
  }));

  return {
    code: null,
    mode: 'pass_play',
    phase: 'lobby',
    round: 0,
    settings,
    players: lobbyPlayers,
    hostId: lobbyPlayers[0]?.id ?? '',
    currentTurnPlayerId: null,
    winnerPlayerId: null,
    scoreboard: {},
    gamesPlayedInRoom: 0,
    phaseEndsAt: null,
    seed,
    createdAt: now,
    customState: {},
  };
}

