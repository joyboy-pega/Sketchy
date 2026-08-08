import type { AvatarConfig, GameSettings, Phase } from './types.js';

interface ActionBase {
  at: number;
}

interface PlayerActionBase extends ActionBase {
  playerId: string;
}

export interface JoinAction extends PlayerActionBase {
  type: 'join';
  player: { id: string; name: string; avatar?: AvatarConfig };
}

export interface LeaveAction extends PlayerActionBase {
  type: 'leave';
}

export interface SetReadyAction extends PlayerActionBase {
  type: 'setReady';
  ready: boolean;
}

export interface UpdateSettingsAction extends PlayerActionBase {
  type: 'updateSettings';
  patch: Partial<GameSettings>;
}

export interface KickAction extends PlayerActionBase {
  type: 'kick';
  targetId: string;
}

export interface StartAction extends PlayerActionBase {
  type: 'start';
  customPayload?: Record<string, unknown>;
}

export interface PerformGameAction extends PlayerActionBase {
  type: 'gameAction';
  actionName: string;
  payload?: Record<string, unknown>;
}

export interface NextTurnAction extends PlayerActionBase {
  type: 'nextTurn';
}

export interface EndGameAction extends PlayerActionBase {
  type: 'endGame';
  winnerPlayerId?: string;
}

export interface ResetToLobbyAction extends PlayerActionBase {
  type: 'resetToLobby';
}

export interface TimeoutAction extends ActionBase {
  type: 'timeout';
  phase: Phase;
}

export interface PresenceAction extends ActionBase {
  type: 'presence';
  playerId: string;
  connected: boolean;
}

export interface MigrateHostAction extends ActionBase {
  type: 'migrateHost';
  newHostId: string;
}

export type GameAction =
  | JoinAction
  | LeaveAction
  | SetReadyAction
  | UpdateSettingsAction
  | KickAction
  | StartAction
  | PerformGameAction
  | NextTurnAction
  | EndGameAction
  | ResetToLobbyAction
  | TimeoutAction
  | PresenceAction
  | MigrateHostAction;

