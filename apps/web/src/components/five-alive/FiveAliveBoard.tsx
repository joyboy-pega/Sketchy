'use client';

import React, { useState } from 'react';
import type { FiveAliveCard, FiveAliveGameState, FiveAlivePlayer } from '@sketchy/engine';
import { playCard, startFiveAliveGame } from '@sketchy/engine';
import { PopButton } from '@/components/pop/pop-button';
import { PopCard } from '@/components/pop/pop-card';
import { PopDialog } from '@/components/pop/pop-dialog';
import {
  playCardPlaySound,
  playClickSound,
  playLifeLossSound,
  playRoundWinSound,
} from '@/lib/sound-fx';

export function FiveAliveBoard() {
  const [gameState, setGameState] = useState<FiveAliveGameState>(() =>
    startFiveAliveGame([
      { id: 'p1', name: 'You (Player 1)' },
      { id: 'p2', name: 'Bot Bob' },
      { id: 'p3', name: 'Bot Charlie' },
    ]),
  );

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);

  const userPlayer = gameState.players[0]!;

  const handlePlayCard = (cardId: string) => {
    if (!gameState.currentTurnPlayerId) return;

    playCardPlaySound();

    const nextState = playCard(
      gameState,
      gameState.currentTurnPlayerId,
      cardId,
    );

    if (nextState.winnerId) {
      playRoundWinSound();
    } else if (nextState.message?.includes('lost 1 heart') || nextState.message?.includes('lost a life')) {
      playLifeLossSound();
    }

    setGameState(nextState);
    setSelectedCardId(null);

    if (!nextState.winnerId && nextState.currentTurnPlayerId !== 'p1') {
      setTimeout(() => {
        simulateBotTurn(nextState);
      }, 1000);
    }
  };

  const simulateBotTurn = (state: FiveAliveGameState) => {
    const activeBotId = state.currentTurnPlayerId;
    if (!activeBotId || activeBotId === 'p1' || state.winnerId) return;

    const bot = state.players.find((p: FiveAlivePlayer) => p.id === activeBotId);
    if (!bot || bot.hand.length === 0) return;

    let cardToPlay = bot.hand.find(
      (c: FiveAliveCard) =>
        c.type === 'five_alive' ||
        c.type === 'skip' ||
        c.type === 'reverse' ||
        c.type === 'pass' ||
        (c.type === 'number' && state.runningTotal + (c.value ?? 0) <= 21),
    );

    if (!cardToPlay) {
      cardToPlay = bot.hand[0]!;
    }

    playCardPlaySound();
    const afterBotState = playCard(state, activeBotId, cardToPlay.id);

    if (afterBotState.winnerId) {
      playRoundWinSound();
    } else if (afterBotState.message?.includes('lost 1 heart') || afterBotState.message?.includes('lost a life')) {
      playLifeLossSound();
    }

    setGameState(afterBotState);

    if (
      !afterBotState.winnerId &&
      afterBotState.currentTurnPlayerId &&
      afterBotState.currentTurnPlayerId !== 'p1'
    ) {
      setTimeout(() => {
        simulateBotTurn(afterBotState);
      }, 1200);
    }
  };

  const handleRestart = () => {
    playClickSound();
    const freshGame = startFiveAliveGame([
      { id: 'p1', name: 'You (Player 1)' },
      { id: 'p2', name: 'Bot Bob' },
      { id: 'p3', name: 'Bot Charlie' },
    ]);
    setGameState(freshGame);
    setSelectedCardId(null);
  };

  const getCardStyle = (type: string, value?: number) => {
    switch (type) {
      case 'five_alive':
        return 'bg-highlight text-ink border-3 border-ink shadow-hard font-display';
      case 'set_21':
        return 'bg-undercover text-paper-2 border-3 border-ink shadow-hard font-display';
      case 'skip':
      case 'reverse':
      case 'pass':
        return 'bg-civilian text-paper-2 border-3 border-ink shadow-hard font-display';
      case 'bomb':
        return 'bg-mrwhite text-paper-2 border-3 border-ink shadow-hard font-display';
      default:
        if ((value ?? 0) >= 5) {
          return 'bg-phase-reveal text-ink border-3 border-ink shadow-hard font-display';
        }
        return 'bg-paper-2 text-ink border-3 border-ink shadow-hard font-display';
    }
  };

  const CARD_TILTS = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2', 'rotate-0'];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-paper text-ink space-y-6">
      {/* Header bar */}
      <PopCard className="flex items-center justify-between p-4 -rotate-1 bg-paper-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-block rounded-lg border-3 border-ink bg-highlight px-2 py-0.5 font-display text-xs uppercase tracking-wide text-ink shadow-hard-sm">
              ❤️ 5 HEARTS GAME
            </span>
            <h1 className="font-display text-3xl uppercase tracking-wide text-ink sm:text-4xl">
              5 HEARTS
            </h1>
          </div>
          <p className="font-ui text-xs font-bold text-graphite mt-1">
            Keep running total ≤ 21 or lose a heart! Last player with hearts wins.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="font-ui text-xs font-bold uppercase tracking-[0.14em] px-3 py-1.5 bg-phase-vote border-3 border-ink rounded-lg shadow-hard-sm text-ink hidden sm:inline-block">
            Round {gameState.round}
          </span>
          <PopButton
            variant="secondary"
            size="md"
            onClick={() => {
              playClickSound();
              setIsRulesOpen(true);
            }}
          >
            Rules
          </PopButton>
          <PopButton variant="primary" size="md" onClick={handleRestart}>
            New Game
          </PopButton>
        </div>
      </PopCard>

      {/* Rules Dialog Modal */}
      <PopDialog
        open={isRulesOpen}
        onOpenChange={setIsRulesOpen}
        title="5 HEARTS RULES"
        description="How to play 5 Hearts card game:"
        closeLabel="Close Rules"
      >
        <div className="space-y-4 font-ui text-sm text-ink max-h-[60vh] overflow-y-auto pr-1">
          <div className="p-3 bg-phase-discuss border-3 border-ink rounded-xl shadow-hard-sm">
            <h3 className="font-display text-base uppercase text-ink">🎯 Objective</h3>
            <p className="mt-1 text-xs font-semibold text-graphite">
              Every player starts with **5 Hearts (❤️❤️❤️❤️❤️)**. Keep the running total at or below **21**. If your card pushes the total over 21, you lose 1 heart (💔). Eliminate all opponents to win!
            </p>
          </div>

          <div className="p-3 bg-phase-vote border-3 border-ink rounded-xl shadow-hard-sm">
            <h3 className="font-display text-base uppercase text-ink">🃏 Playing Cards</h3>
            <ul className="mt-1 space-y-1 text-xs font-semibold text-graphite list-disc list-inside">
              <li>**Number Cards (0–7)**: Add their face value to the running total.</li>
              <li>**Emptying Your Hand**: Play all cards in your hand to win the round! All other active players lose 1 heart (💔), and a new round begins.</li>
            </ul>
          </div>

          <div className="p-3 bg-phase-reveal border-3 border-ink rounded-xl shadow-hard-sm space-y-2">
            <h3 className="font-display text-base uppercase text-ink">⚡ Action Cards</h3>
            <div className="grid grid-cols-1 gap-1.5 text-xs font-semibold">
              <div className="flex items-center justify-between bg-paper-2 border-2 border-ink p-1.5 rounded-lg">
                <span className="font-display text-highlight font-black">★ 5 HEARTS</span>
                <span>Resets running total to 0</span>
              </div>
              <div className="flex items-center justify-between bg-paper-2 border-2 border-ink p-1.5 rounded-lg">
                <span className="font-display text-undercover font-black">★ = 21</span>
                <span>Sets running total to 21</span>
              </div>
              <div className="flex items-center justify-between bg-paper-2 border-2 border-ink p-1.5 rounded-lg">
                <span className="font-display text-civilian font-black">★ SKIP</span>
                <span>Skips next player turn</span>
              </div>
              <div className="flex items-center justify-between bg-paper-2 border-2 border-ink p-1.5 rounded-lg">
                <span className="font-display text-civilian font-black">★ REVERSE</span>
                <span>Flips direction of play</span>
              </div>
              <div className="flex items-center justify-between bg-paper-2 border-2 border-ink p-1.5 rounded-lg">
                <span className="font-display text-civilian font-black">★ PASS</span>
                <span>Passes turn without adding</span>
              </div>
              <div className="flex items-center justify-between bg-paper-2 border-2 border-ink p-1.5 rounded-lg">
                <span className="font-display text-mrwhite font-black">★ BOMB</span>
                <span>Reduces running total by 5</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <PopButton
            variant="primary"
            size="md"
            onClick={() => {
              playClickSound();
              setIsRulesOpen(false);
            }}
          >
            Got It!
          </PopButton>
        </div>
      </PopDialog>

      {/* Players Roster */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {gameState.players.map((p: FiveAlivePlayer, index: number) => {
          const isTurn = p.id === gameState.currentTurnPlayerId;
          const tilt = CARD_TILTS[index % CARD_TILTS.length];

          return (
            <div
              key={p.id}
              className={`p-3.5 rounded-xl border-3 border-ink transition-all duration-200 ${tilt} ${
                isTurn
                  ? 'bg-highlight shadow-hard scale-[1.02] z-10'
                  : 'bg-paper-2 shadow-hard-sm'
              } ${p.isEliminated ? 'opacity-40 grayscale' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-ui font-bold text-base text-ink truncate">
                  {p.name}
                </span>
                {isTurn && (
                  <span className="font-ui text-[11px] font-extrabold uppercase tracking-[0.08em] bg-ink text-highlight px-2 py-0.5 rounded-lg border-2 border-ink shadow-hard-sm">
                    TURN
                  </span>
                )}
              </div>
              <div className="mt-2.5 p-2 bg-paper rounded-lg border-2 border-ink shadow-hard-sm">
                <div className="flex items-center justify-between text-xs font-ui mb-1">
                  <span className="font-bold text-ink flex items-center gap-1">
                    <span>HEARTS:</span>
                    <span className="text-[11px] font-extrabold px-1.5 py-0.2 bg-highlight rounded border border-ink">
                      {p.lives}/5
                    </span>
                  </span>
                  {p.isEliminated && (
                    <span className="text-[10px] font-extrabold uppercase text-undercover">
                      OUT 💀
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center px-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span
                      key={idx}
                      className={`text-base transition-transform duration-200 ${
                        idx < p.lives
                          ? 'animate-pulse scale-110 drop-shadow-sm'
                          : 'opacity-30 grayscale'
                      }`}
                      title={idx < p.lives ? 'Active Heart' : 'Lost Heart'}
                    >
                      {idx < p.lives ? '❤️' : '💔'}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-2 font-ui text-[11px] font-bold text-graphite uppercase tracking-wider flex justify-between">
                <span>Cards in hand:</span>
                <span className="font-extrabold text-ink">{p.hand.length}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Center Arena - Running Total */}
      <div className="relative bg-paper-2 border-3 border-ink rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center space-y-5 shadow-hard-lg overflow-hidden dots">
        <div className="absolute top-3 left-4 font-ui text-xs font-bold uppercase tracking-[0.14em] text-ink flex items-center space-x-1">
          <span>Direction:</span>
          <span className="bg-highlight px-2.5 py-0.5 rounded-lg border-2 border-ink font-extrabold shadow-hard-sm">
            {gameState.direction === 'cw' ? '↻ Clockwise' : '↺ Counter-Clockwise'}
          </span>
        </div>

        <div className="relative flex flex-col items-center justify-center pt-4">
          <div
            className={`w-36 h-36 rounded-full border-3 border-ink flex flex-col items-center justify-center shadow-hard transition-transform duration-300 ${
              gameState.runningTotal > 18
                ? 'bg-phase-reveal text-ink pnp-pop-in'
                : gameState.runningTotal > 14
                ? 'bg-phase-vote text-ink'
                : 'bg-phase-discuss text-ink'
            }`}
          >
            <span className="font-ui text-xs font-bold uppercase tracking-[0.14em] text-graphite">
              TOTAL
            </span>
            <span className="font-display text-5xl uppercase tracking-wide text-ink">
              {gameState.runningTotal}
            </span>
            <span className="font-ui text-xs font-bold text-graphite">/ 21</span>
          </div>
        </div>

        {gameState.message && (
          <div className="font-ui text-sm font-bold text-ink bg-highlight border-3 border-ink px-4 py-1.5 rounded-xl shadow-hard-sm max-w-md text-center">
            {gameState.message}
          </div>
        )}

        {gameState.winnerId && (
          <div className="pnp-slam p-4 bg-highlight border-3 border-ink text-ink rounded-2xl text-center font-display text-2xl uppercase tracking-wide shadow-hard-lg w-full max-w-md -rotate-1">
            🎉 WINNER:{' '}
            {gameState.players.find((p: FiveAlivePlayer) => p.id === gameState.winnerId)?.name}!
          </div>
        )}
      </div>

      {/* Player Hand Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-ui text-xs font-bold uppercase tracking-[0.14em] text-ink">
            YOUR HAND ({userPlayer.hand.length} CARDS)
          </h2>
          {gameState.currentTurnPlayerId === 'p1' && !gameState.winnerId && (
            <span className="font-ui text-xs font-bold uppercase tracking-wider text-civilian bg-highlight px-3 py-1 rounded-lg border-2 border-ink shadow-hard-sm">
              ★ YOUR TURN! SELECT A CARD
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
          {userPlayer.hand.map((card: FiveAliveCard, index: number) => {
            const isSelected = selectedCardId === card.id;
            const canPlay =
              gameState.currentTurnPlayerId === 'p1' && !gameState.winnerId;
            const cardTilt = CARD_TILTS[index % CARD_TILTS.length];

            return (
              <button
                key={card.id}
                disabled={!canPlay}
                onClick={() => {
                  setSelectedCardId(card.id);
                  handlePlayCard(card.id);
                }}
                className={`w-24 h-32 rounded-xl p-2.5 flex flex-col justify-between items-center transition-all duration-150 cursor-pointer transform hover:-translate-y-1 hover:rotate-0 active:translate-x-1 active:translate-y-1 disabled:opacity-40 disabled:cursor-not-allowed ${getCardStyle(
                  card.type,
                  card.value,
                )} ${cardTilt} ${
                  isSelected ? 'ring-4 ring-ink scale-105 shadow-hard-lg' : ''
                }`}
              >
                <span className="font-display text-xs uppercase self-start">
                  {card.label}
                </span>
                <span className="font-display text-3xl uppercase">
                  {card.type === 'number' ? card.value : '★'}
                </span>
                <span className="font-ui text-[9px] font-bold uppercase tracking-wider self-end opacity-90">
                  {card.type.replace('_', ' ')}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
