import type { FastifyBaseLogger } from 'fastify';
import type { GameNamespace, GameSocket } from './types.js';

export function registerPresenceHandlers(
  _io: GameNamespace,
  _socket: GameSocket,
  _logger: FastifyBaseLogger,
): void {
  // Presence handlers
}
