import type { Server, Socket, Namespace } from 'socket.io';
import type { RoomSnapshotPayload } from '@sketchy/shared/contract/socket';

export interface SocketData {
  playerId: string;
  roomCode?: string;
}

export interface ClientToServerEvents {
  'room:join': (payload: { code: string }) => void;
  'room:leave': () => void;
}

export interface ServerToClientEvents {
  'room:snapshot': (payload: RoomSnapshotPayload) => void;
}

export type InterServerEvents = Record<string, never>;

export type GameServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type GameNamespace = Namespace<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type GameSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
