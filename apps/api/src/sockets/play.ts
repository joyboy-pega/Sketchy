import type { FastifyBaseLogger } from 'fastify';
import type { GameNamespace, GameSocket } from './types.js';

export function registerPlayHandlers(
  _io: GameNamespace,
  _socket: GameSocket,
  _logger: FastifyBaseLogger,
): void {
  // Generic socket handlers
}
