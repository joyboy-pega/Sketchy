import type { FastifyInstance } from 'fastify';
import { Server } from 'socket.io';
import { registerLobbyHandlers } from './lobby.js';
import { registerPlayHandlers } from './play.js';
import { registerPresenceHandlers } from './presence.js';
import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from './types.js';

export async function registerSockets(fastify: FastifyInstance): Promise<void> {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
    fastify.server,
    {
      path: '/socket.io',
      cors: { origin: '*' },
    },
  );

  const gameNs = io.of('/game');

  gameNs.on('connection', (socket) => {
    registerLobbyHandlers(gameNs, socket, fastify.log);
    registerPlayHandlers(gameNs, socket, fastify.log);
    registerPresenceHandlers(gameNs, socket, fastify.log);
  });
}
