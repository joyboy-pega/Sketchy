export type CardType =
  | 'number'
  | 'set_21'
  | 'five_alive'
  | 'skip'
  | 'reverse'
  | 'bomb'
  | 'pass';

export interface FiveAliveCard {
  id: string;
  type: CardType;
  value?: number; // 0 to 7 for number cards
  label: string;
}

export interface FiveAlivePlayer {
  id: string;
  name: string;
  lives: number; // Starts at 5, eliminated when 0
  hand: FiveAliveCard[];
  isEliminated: boolean;
}

export type PlayDirection = 'cw' | 'ccw';

export interface FiveAliveGameState {
  runningTotal: number;
  direction: PlayDirection;
  currentTurnPlayerId: string | null;
  drawDeck: FiveAliveCard[];
  discardPile: FiveAliveCard[];
  players: FiveAlivePlayer[];
  winnerId: string | null;
  round: number;
  lastPlayedCard: FiveAliveCard | null;
  message: string | null;
}
