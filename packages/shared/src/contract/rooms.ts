import { z } from 'zod';
import type { GameSettings, Phase } from '@sketchy/engine/types';
import { ROOM_CODE_ALPHABET, ROOM_CODE_LENGTH } from '../room-code.js';

const ROOM_CODE_PATTERN = new RegExp(`^[${ROOM_CODE_ALPHABET}]{${ROOM_CODE_LENGTH}}$`);

export const roomCodeSchema = z
  .string()
  .regex(ROOM_CODE_PATTERN, 'Room code must be 5 characters from the room-code alphabet.');

export type RoomCode = z.infer<typeof roomCodeSchema>;

export const gameSettingsPatchSchema = z
  .object({
    minPlayers: z.number().int().optional(),
    maxPlayers: z.number().int().optional(),
    turnDurationSec: z.number().nullable().optional(),
    customSettings: z.record(z.string(), z.unknown()).optional(),
  })
  .strict() satisfies z.ZodType<Partial<GameSettings>>;

export type GameSettingsPatch = z.infer<typeof gameSettingsPatchSchema>;

export const roomVisibilitySchema = z.enum(['private', 'public']);

export type RoomVisibility = z.infer<typeof roomVisibilitySchema>;

export const createRoomRequestSchema = z.object({
  settings: gameSettingsPatchSchema.optional(),
  visibility: roomVisibilitySchema.optional(),
});

export type CreateRoomRequest = z.infer<typeof createRoomRequestSchema>;

export const createRoomResponseSchema = z.object({
  code: roomCodeSchema,
  joinUrl: z.string(),
});

export type CreateRoomResponse = z.infer<typeof createRoomResponseSchema>;

export const phaseSchema = z.enum([
  'lobby',
  'playing',
  'game_over',
]) satisfies z.ZodType<Phase>;

export const roomResolutionSchema = z.object({
  code: roomCodeSchema,
  phase: phaseSchema,
  playerCount: z.number().int(),
  maxPlayers: z.number().int(),
  canJoin: z.boolean(),
  canRejoin: z.boolean(),
  hostName: z.string(),
});

export type RoomResolution = z.infer<typeof roomResolutionSchema>;

export const voiceTokenResponseSchema = z.object({
  token: z.string(),
  url: z.string(),
});

export type VoiceTokenResponse = z.infer<typeof voiceTokenResponseSchema>;
