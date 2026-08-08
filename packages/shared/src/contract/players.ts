import { z } from 'zod';
import type { AvatarConfig, GameState } from '@sketchy/engine/types';

export const avatarConfigSchema = z.object({
  head: z.string().max(40).optional(),
  face: z.string().max(40).optional(),
  accessory: z.string().max(40).optional(),
  inkColor: z.string().max(40).optional(),
});

export type AvatarConfigContract = z.infer<typeof avatarConfigSchema>;

export function assertAvatarConfigMatchesEngine(config: AvatarConfigContract): AvatarConfig {
  return config satisfies AvatarConfig;
}

export const playerSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  avatar: avatarConfigSchema.optional(),
  isGuest: z.boolean(),
  createdAt: z.number(),
});

export type Player = z.infer<typeof playerSchema>;

export const guestAuthRequestSchema = z.object({
  displayName: z.string().trim().min(2).max(20),
});

export type GuestAuthRequest = z.infer<typeof guestAuthRequestSchema>;

export const guestAuthResponseSchema = z.object({
  token: z.string(),
  player: playerSchema,
});

export type GuestAuthResponse = z.infer<typeof guestAuthResponseSchema>;

export const patchMeRequestSchema = z.object({
  displayName: z.string().trim().min(2).max(20).optional(),
  avatar: avatarConfigSchema.optional(),
});

export type PatchMeRequest = z.infer<typeof patchMeRequestSchema>;

export const meResponseSchema = z.object({
  player: playerSchema,
});

export type MeResponse = z.infer<typeof meResponseSchema>;

export const gameModeSchema = z.enum([
  'pass_play',
  'online_private',
  'online_public',
]) satisfies z.ZodType<GameState['mode']>;
