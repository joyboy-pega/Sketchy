import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, createApiClient } from './client.js';

const validPlayer = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  displayName: 'Sam',
  isGuest: true,
  createdAt: Date.now(),
};

function jsonResponse(
  body: unknown,
  init: { status?: number; headers?: Record<string, string> } = {},
): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  });
}

describe('createApiClient', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('guestAuth POSTs to /auth/guest', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ token: 'jwt', player: validPlayer }));
    const client = createApiClient({ baseUrl: 'http://localhost:4000/v1' });

    const result = await client.guestAuth({ displayName: 'Sam' });

    expect(result.token).toBe('jwt');
    expect(result.player.id).toBe(validPlayer.id);
  });

  it('createRoom POSTs to /rooms', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ code: 'ABCJK', joinUrl: 'https://sketchy.example/r/ABCJK' }),
    );
    const client = createApiClient({ baseUrl: 'http://localhost:4000/v1' });

    const result = await client.createRoom({ settings: { maxPlayers: 10 } });

    expect(result).toEqual({ code: 'ABCJK', joinUrl: 'https://sketchy.example/r/ABCJK' });
  });

  it('resolveRoom builds /rooms/:code path', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        code: 'ABCJK',
        phase: 'lobby',
        playerCount: 3,
        maxPlayers: 12,
        canJoin: true,
        canRejoin: false,
        hostName: 'Priya',
      }),
    );
    const client = createApiClient({ baseUrl: 'http://localhost:4000/v1' });

    const result = await client.resolveRoom('ABCJK');

    expect(result.canJoin).toBe(true);
    expect(result.hostName).toBe('Priya');
  });
});
