import { create } from 'zustand';
import type { RedactedGameState } from '@sketchy/engine/redact-for';

export interface RoomState {
  snapshot: RedactedGameState | null;
  status: 'idle' | 'connecting' | 'connected' | 'error';
  setSnapshot: (snapshot: RedactedGameState) => void;
  setStatus: (status: 'idle' | 'connecting' | 'connected' | 'error') => void;
  reset: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  snapshot: null,
  status: 'idle',
  setSnapshot: (snapshot) => set({ snapshot }),
  setStatus: (status) => set({ status }),
  reset: () => set({ snapshot: null, status: 'idle' }),
}));
