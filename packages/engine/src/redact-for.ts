import type { GameState, Player } from './types.js';

export interface RedactedGameState extends Omit<GameState, 'seed'> {
  seed: string;
}

export function redactFor(state: GameState, _viewerId: string | 'spectator'): RedactedGameState {
  return {
    ...state,
    seed: '',
  };
}

