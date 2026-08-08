export interface GameDescriptor {
  id: string;
  name: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
}

export const GAME_REGISTRY: Record<string, GameDescriptor> = {
  'five-alive': {
    id: 'five-alive',
    name: '5 Alive',
    description: 'Fast-paced card game! Keep the running total under 21 or lose a life.',
    minPlayers: 2,
    maxPlayers: 6,
  },
};
