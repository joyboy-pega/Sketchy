import { describe, expect, it } from 'vitest';
import {
  createRoomRequestSchema,
  createRoomResponseSchema,
  gameSettingsPatchSchema,
  phaseSchema,
  roomCodeSchema,
  roomResolutionSchema,
  voiceTokenResponseSchema,
} from './rooms.js';

const VALID_CODE = 'AB2CD';

describe('roomCodeSchema', () => {
  it('accepts a well-formed 5-char code', () => {
    expect(roomCodeSchema.parse(VALID_CODE)).toBe(VALID_CODE);
  });

  it('rejects a code that is too short', () => {
    expect(() => roomCodeSchema.parse('AB2C')).toThrow();
  });
});

describe('gameSettingsPatchSchema', () => {
  it('accepts an empty patch', () => {
    expect(gameSettingsPatchSchema.parse({})).toEqual({});
  });

  it('accepts valid maxPlayers patch', () => {
    expect(gameSettingsPatchSchema.parse({ maxPlayers: 12 })).toEqual({ maxPlayers: 12 });
  });
});

describe('createRoomRequestSchema', () => {
  it('accepts an empty body', () => {
    expect(createRoomRequestSchema.parse({})).toEqual({});
  });
});

describe('phaseSchema', () => {
  it.each(['lobby', 'playing', 'game_over'])('accepts %s', (phase) => {
    expect(phaseSchema.parse(phase)).toBe(phase);
  });
});

describe('roomResolutionSchema', () => {
  it('round-trips a valid room resolution', () => {
    const body = {
      code: VALID_CODE,
      phase: 'lobby' as const,
      playerCount: 3,
      maxPlayers: 12,
      canJoin: true,
      canRejoin: false,
      hostName: 'Sam',
    };
    expect(roomResolutionSchema.parse(body)).toEqual(body);
  });
});
