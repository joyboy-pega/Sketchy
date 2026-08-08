import type { FiveAliveCard } from './types.js';

export function createFiveAliveDeck(): FiveAliveCard[] {
  const cards: FiveAliveCard[] = [];
  let cardId = 1;

  // Add Number cards (0 to 7) - 6 copies of each
  for (let val = 0; val <= 7; val++) {
    for (let i = 0; i < 6; i++) {
      cards.push({
        id: `card-${cardId++}`,
        type: 'number',
        value: val,
        label: `${val}`,
      });
    }
  }

  // Add Special Action Cards
  // Set 21 (4 copies)
  for (let i = 0; i < 4; i++) {
    cards.push({
      id: `card-${cardId++}`,
      type: 'set_21',
      label: '= 21',
    });
  }

  // 5 Alive - Reset total to 0 (4 copies)
  for (let i = 0; i < 4; i++) {
    cards.push({
      id: `card-${cardId++}`,
      type: 'five_alive',
      label: '5 ALIVE (Reset 0)',
    });
  }

  // Skip turn (4 copies)
  for (let i = 0; i < 4; i++) {
    cards.push({
      id: `card-${cardId++}`,
      type: 'skip',
      label: 'SKIP',
    });
  }

  // Reverse direction (4 copies)
  for (let i = 0; i < 4; i++) {
    cards.push({
      id: `card-${cardId++}`,
      type: 'reverse',
      label: 'REVERSE',
    });
  }

  // Pass (4 copies)
  for (let i = 0; i < 4; i++) {
    cards.push({
      id: `card-${cardId++}`,
      type: 'pass',
      label: 'PASS',
    });
  }

  // Bomb (4 copies)
  for (let i = 0; i < 4; i++) {
    cards.push({
      id: `card-${cardId++}`,
      type: 'bomb',
      label: 'BOMB',
    });
  }

  return cards;
}

/** Simple pseudo-random shuffle helper */
export function shuffleDeck<T>(array: T[], seed = 'seed'): T[] {
  const deck = [...array];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  for (let i = deck.length - 1; i > 0; i--) {
    hash = (hash * 9301 + 49297) % 233280;
    const j = Math.floor((Math.abs(hash) / 233280) * (i + 1));
    const temp = deck[i]!;
    deck[i] = deck[j]!;
    deck[j] = temp;
  }
  return deck;
}
