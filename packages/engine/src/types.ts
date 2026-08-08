/**
 * Generic GameState definition for monorepo game framework.
 */

export type Phase = 'lobby' | 'playing' | 'game_over';

export interface AvatarConfig {
  head?: string;
  face?: string;
  accessory?: string;
  inkColor?: string;
}

export interface Player {
  id: string;
  name: string;
  avatar?: AvatarConfig;
  seat: number;
  connected: boolean;
  isReady: boolean;
  score: number;
  hasLeft: boolean;
  data: Record<string, unknown>;
}

/** Alias for backward compatibility */
export type GamePlayer = Player;

export interface GameSettings {
  minPlayers: number;
  maxPlayers: number;
  turnDurationSec: number | null;
  customSettings: Record<string, unknown>;
}

export interface GameState {
  code: string | null;
  mode: 'pass_play' | 'online_private' | 'online_public';
  phase: Phase;
  round: number;
  settings: GameSettings;
  players: Player[];
  hostId: string;
  currentTurnPlayerId: string | null;
  winnerPlayerId: string | null;
  scoreboard: Record<string, number>;
  gamesPlayedInRoom: number;
  phaseEndsAt: number | null;
  seed: string;
  createdAt: number;
  customState: Record<string, unknown>;
}

