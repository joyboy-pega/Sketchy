import { z } from 'zod';
import type { RedactedGameState } from '@sketchy/engine/redact-for';
import { gameSettingsPatchSchema, roomCodeSchema } from './rooms.js';

export const CLIENT_EVENTS = {
  roomJoin: 'room:join',
  roomLeave: 'room:leave',
  roomSync: 'room:sync',
  lobbyReady: 'lobby:ready',
  lobbySettings: 'lobby:settings',
  lobbyKick: 'lobby:kick',
  gameStart: 'game:start',
  gameAction: 'game:action',
  gameRematch: 'game:rematch',
  chatSend: 'chat:send',
  timePing: 'time:ping',
  hostTransfer: 'host:transfer',
} as const;

export const SERVER_EVENTS = {
  roomSnapshot: 'room:snapshot',
  roomEvent: 'room:event',
  chatMessage: 'chat:message',
  sessionSuperseded: 'session:superseded',
} as const;

const emptyPayloadSchema = z.object({}).strict();

export const roomJoinPayloadSchema = z.object({ code: roomCodeSchema }).strict();
export type RoomJoinPayload = z.infer<typeof roomJoinPayloadSchema>;

export const roomLeavePayloadSchema = emptyPayloadSchema;
export type RoomLeavePayload = z.infer<typeof roomLeavePayloadSchema>;

export const roomSyncPayloadSchema = z.object({ lastVer: z.number().int().min(0) }).strict();
export type RoomSyncPayload = z.infer<typeof roomSyncPayloadSchema>;

export const lobbyReadyPayloadSchema = z.object({ ready: z.boolean() }).strict();
export type LobbyReadyPayload = z.infer<typeof lobbyReadyPayloadSchema>;

export const lobbySettingsPayloadSchema = gameSettingsPatchSchema;

export const lobbyKickPayloadSchema = z.object({ targetId: z.string() }).strict();

export const gameStartPayloadSchema = z.object({ customPayload: z.record(z.string(), z.unknown()).optional() }).strict();

export const gameActionPayloadSchema = z.object({
  actionName: z.string(),
  payload: z.record(z.string(), z.unknown()).optional(),
}).strict();

export const chatSendPayloadSchema = z.object({ text: z.string().trim().min(1).max(200) }).strict();

export interface RoomSnapshotPayload {
  ver: number;
  state: RedactedGameState;
}
