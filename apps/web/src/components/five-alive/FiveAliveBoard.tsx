'use client';

import React, { useState } from 'react';
import type { FiveAliveCard, FiveAliveGameState, FiveAlivePlayer } from '@sketchy/engine';
import { playCard, startFiveAliveGame } from '@sketchy/engine';

export function FiveAliveBoard() {
  const [gameState, setGameState] = useState<FiveAliveGameState>(() =>
    startFiveAliveGame([
      { id: 'p1', name: 'You (Player 1)' },
      { id: 'p2', name: 'Bot Bob' },
      { id: 'p3', name: 'Bot Charlie' },
    ]),
  );

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const userPlayer = gameState.players[0]!;

  const handlePlayCard = (cardId: string) => {
    if (!gameState.currentTurnPlayerId) return;

    const nextState = playCard(
      gameState,
      gameState.currentTurnPlayerId,
      cardId,
    );
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

    const afterBotState = playCard(state, activeBotId, cardToPlay.id);
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
    const freshGame = startFiveAliveGame([
      { id: 'p1', name: 'You (Player 1)' },
      { id: 'p2', name: 'Bot Bob' },
      { id: 'p3', name: 'Bot Charlie' },
    ]);
    setGameState(freshGame);
    setSelectedCardId(null);
  };

  const getCardColorClass = (type: string, value?: number) => {
    switch (type) {
      case 'five_alive':
        return 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-emerald-500/30';
      case 'set_21':
        return 'bg-gradient-to-br from-amber-500 to-red-600 text-white shadow-amber-500/30';
      case 'skip':
      case 'reverse':
      case 'pass':
        return 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-500/30';
      case 'bomb':
        return 'bg-gradient-to-br from-purple-600 to-pink-700 text-white shadow-purple-500/30';
      default:
        if ((value ?? 0) >= 5) {
          return 'bg-gradient-to-br from-rose-500 to-red-700 text-white shadow-rose-500/30';
        }
        return 'bg-gradient-to-br from-slate-700 to-slate-900 text-slate-100 border border-slate-600';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-slate-950 text-white rounded-3xl shadow-2xl border border-slate-800 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500">
            5 ALIVE
          </h1>
          <p className="text-xs text-slate-400">
            Keep running total ≤ 21 or lose a life!
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold px-3 py-1 bg-slate-800 rounded-full text-slate-300">
            Round {gameState.round}
          </span>
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/30 active:scale-95"
          >
            New Game
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {gameState.players.map((p: FiveAlivePlayer) => {
          const isTurn = p.id === gameState.currentTurnPlayerId;
          return (
            <div
              key={p.id}
              className={`p-3 rounded-2xl border transition-all duration-300 ${
                isTurn
                  ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/50 scale-105'
                  : 'bg-slate-900/60 border-slate-800'
              } ${p.isEliminated ? 'opacity-40 grayscale' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm truncate">{p.name}</span>
                {isTurn && (
                  <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full font-extrabold animate-pulse">
                    TURN
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-slate-400">Lives:</span>
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span
                      key={idx}
                      className={
                        idx < p.lives ? 'text-red-500' : 'text-slate-700'
                      }
                    >
                      ❤️
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                Cards left: {p.hand.length}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
        <div className="absolute top-3 left-4 text-xs font-semibold text-slate-400 flex items-center space-x-1">
          <span>Direction:</span>
          <span className="text-indigo-400 font-bold">
            {gameState.direction === 'cw' ? '↻ Clockwise' : '↺ Counter-Clockwise'}
          </span>
        </div>

        <div className="relative flex flex-col items-center justify-center">
          <div
            className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border-4 shadow-2xl transition-all duration-500 ${
              gameState.runningTotal > 18
                ? 'border-red-500 bg-red-950/40 text-red-400 shadow-red-500/40 animate-bounce'
                : gameState.runningTotal > 14
                ? 'border-amber-500 bg-amber-950/40 text-amber-400 shadow-amber-500/30'
                : 'border-emerald-500 bg-emerald-950/40 text-emerald-400 shadow-emerald-500/30'
            }`}
          >
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
              TOTAL
            </span>
            <span className="text-4xl font-black">{gameState.runningTotal}</span>
            <span className="text-[10px] text-slate-500 font-bold">/ 21</span>
          </div>
        </div>

        {gameState.message && (
          <div className="text-center text-sm font-semibold text-indigo-300 bg-indigo-950/50 border border-indigo-800/50 px-4 py-1.5 rounded-full max-w-md">
            {gameState.message}
          </div>
        )}

        {gameState.winnerId && (
          <div className="p-4 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white rounded-2xl text-center font-black text-xl shadow-xl w-full max-w-md animate-pulse">
            🎉 Winner:{' '}
            {gameState.players.find((p: FiveAlivePlayer) => p.id === gameState.winnerId)?.name}!
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-300">
            YOUR HAND ({userPlayer.hand.length} Cards)
          </h2>
          {gameState.currentTurnPlayerId === 'p1' && !gameState.winnerId && (
            <span className="text-xs text-emerald-400 font-bold animate-pulse">
              ★ Your turn! Click a card to play.
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
          {userPlayer.hand.map((card: FiveAliveCard) => {
            const isSelected = selectedCardId === card.id;
            const canPlay =
              gameState.currentTurnPlayerId === 'p1' && !gameState.winnerId;

            return (
              <button
                key={card.id}
                disabled={!canPlay}
                onClick={() => {
                  setSelectedCardId(card.id);
                  handlePlayCard(card.id);
                }}
                className={`w-20 h-28 rounded-2xl p-2 flex flex-col justify-between items-center transition-all duration-200 shadow-lg cursor-pointer transform hover:-translate-y-2 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${getCardColorClass(
                  card.type,
                  card.value,
                )} ${
                  isSelected ? 'ring-4 ring-white scale-110 -translate-y-2' : ''
                }`}
              >
                <span className="text-xs font-black self-start">
                  {card.label}
                </span>
                <span className="text-2xl font-black">
                  {card.type === 'number' ? card.value : '★'}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider self-end opacity-75">
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
