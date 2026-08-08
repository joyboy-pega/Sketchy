import type { FastifyBaseLogger } from 'fastify';
import type { GameNamespace, GameSocket } from './types.js';

export function registerLobbyHandlers(
  _io: GameNamespace,
  _socket: GameSocket,
  _logger: FastifyBaseLogger,
): void {
  // Generic lobby handlers
}
