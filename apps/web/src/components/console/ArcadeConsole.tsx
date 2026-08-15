'use client';

import React, { useState } from 'react';
import { PopButton } from '@/components/pop/pop-button';
import { PopCard } from '@/components/pop/pop-card';
import { PopDialog } from '@/components/pop/pop-dialog';
import { FiveAliveBoard } from '@/components/five-alive/FiveAliveBoard';
import { IconArrowLeft } from '@/components/icons/icon-arrow-left';
import { IconGamepad } from '@/components/icons/icon-gamepad';
import { IconQuestion } from '@/components/icons/icon-question';
import { IconUsers } from '@/components/icons/icon-users';
import { playClickSound } from '@/lib/sound-fx';

interface GameItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  isAvailable: boolean;
  color: string;
  players: string;
}

const ARCADE_GAMES: GameItem[] = [
  {
    id: 'five-alive',
    title: '5 HEARTS',
    subtitle: 'Keep running total ≤ 21 or lose a heart! Fast-paced 5-heart card elimination.',
    tag: 'FEATURED GAME',
    isAvailable: true,
    color: 'bg-highlight',
    players: '3 – 20 PLAYERS',
  },
  {
    id: 'more-games-coming-soon',
    title: 'MORE GAMES...',
    subtitle: 'New exciting party games are currently in development. Stay tuned!',
    tag: 'COMING SOON',
    isAvailable: false,
    color: 'bg-phase-discuss',
    players: '??? PLAYERS',
  },
];

export function ArcadeConsole() {
  const [activeScreen, setActiveScreen] = useState<'console' | 'five-alive'>('console');
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  const [isModeDialogOpen, setIsModeDialogOpen] = useState<boolean>(false);

  const handleSelectGame = (game: GameItem) => {
    playClickSound();
    if (!game.isAvailable) return;
    setSelectedGame(game);
    setIsModeDialogOpen(true);
  };

  const handleStartAiGame = () => {
    playClickSound();
    setIsModeDialogOpen(false);
    setActiveScreen('five-alive');
  };

  if (activeScreen === 'five-alive') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center max-w-4xl mx-auto px-2">
          <PopButton
            variant="secondary"
            size="md"
            onClick={() => {
              playClickSound();
              setActiveScreen('console');
            }}
          >
            <IconArrowLeft className="w-4 h-4 mr-1 inline" />
            BACK TO ARCADE
          </PopButton>
          <span className="font-display text-sm uppercase tracking-wide text-ink bg-highlight border-3 border-ink px-3 py-1 rounded-lg shadow-hard-sm flex items-center gap-1.5">
            <IconGamepad className="w-4 h-4 text-ink" />
            ARCADE CONSOLE
          </span>
        </div>
        <FiveAliveBoard />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Console Header */}
      <PopCard className="p-6 md:p-8 bg-paper-2 border-3 border-ink shadow-hard-lg relative overflow-hidden dots">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="inline-block rounded-lg border-3 border-ink bg-highlight px-3 py-1 font-display text-xs uppercase tracking-wide text-ink shadow-hard-sm">
                MULTI-GAME SYSTEM
              </span>
              <span className="font-ui text-xs font-bold uppercase tracking-[0.14em] text-graphite">
                v1.0 CONSOLE
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wide text-ink">
              SKETCHY ARCADE
            </h1>
            <p className="font-ui text-base font-semibold text-graphite max-w-xl">
              Select a game below to launch. Play against AI Bots locally or join online multiplayer!
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-phase-discuss border-3 border-ink p-3 rounded-xl shadow-hard-sm">
            <IconGamepad className="w-7 h-7 text-ink" />
            <div>
              <p className="font-display text-xs uppercase text-ink">1 GAME PLAYABLE</p>
              <p className="font-ui text-[11px] font-bold text-graphite">MORE COMING SOON</p>
            </div>
          </div>
        </div>
      </PopCard>

      {/* Game Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ARCADE_GAMES.map((game, index) => {
          const tilts = ['-rotate-1', 'rotate-1'];
          const tilt = tilts[index % tilts.length];

          return (
            <div
              key={game.id}
              onClick={() => handleSelectGame(game)}
              className={`p-6 rounded-2xl border-3 border-ink transition-all duration-200 flex flex-col justify-between space-y-4 ${
                game.color
              } ${tilt} ${
                game.isAvailable
                  ? 'shadow-hard hover:-translate-y-1.5 hover:rotate-0 active:translate-x-1 active:translate-y-1 cursor-pointer'
                  : 'shadow-hard-sm opacity-80 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-ui text-xs font-extrabold uppercase tracking-[0.14em] px-3 py-1 bg-paper-2 border-2 border-ink rounded-lg shadow-hard-sm text-ink">
                  {game.tag}
                </span>
                <span className="font-ui text-xs font-bold uppercase text-ink bg-paper-2 border-2 border-ink px-2.5 py-0.5 rounded-lg">
                  {game.players}
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="font-display text-3xl uppercase tracking-wide text-ink">
                  {game.title}
                </h2>
                <p className="font-ui text-sm font-semibold text-graphite">
                  {game.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t-2 border-ink/20">
                {game.isAvailable ? (
                  <PopButton variant="primary" size="md" onClick={() => handleSelectGame(game)}>
                    LAUNCH GAME ➔
                  </PopButton>
                ) : (
                  <span className="font-display text-xs uppercase tracking-wide text-graphite bg-paper-2/70 border-2 border-ink/40 px-3 py-2 rounded-xl flex items-center gap-1.5">
                    <IconQuestion className="w-3.5 h-3.5 text-graphite" />
                    IN DEVELOPMENT
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mode Selection Dialog */}
      <PopDialog
        open={isModeDialogOpen}
        onOpenChange={setIsModeDialogOpen}
        title={`PLAY ${selectedGame?.title ?? 'GAME'}`}
        description="Choose how you want to play:"
        closeLabel="Close Mode Select"
      >
        <div className="space-y-4 pt-2">
          {/* AI Bot Mode - Available */}
          <div
            onClick={handleStartAiGame}
            className="p-4 bg-highlight border-3 border-ink rounded-xl shadow-hard cursor-pointer transition-all hover:-translate-y-1 active:translate-x-1 active:translate-y-1 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center space-x-2">
                <IconGamepad className="w-5 h-5 text-ink" />
                <h3 className="font-display text-lg uppercase text-ink">PLAY VS AI BOTS</h3>
              </div>
              <p className="font-ui text-xs font-semibold text-graphite mt-1">
                Play locally right now against Bot Bob & Bot Charlie!
              </p>
            </div>
            <PopButton variant="primary" size="md" onClick={handleStartAiGame}>
              PLAY NOW ➔
            </PopButton>
          </div>

          {/* Online Friends Mode - Coming Soon */}
          <div className="p-4 bg-paper-2 border-3 border-ink rounded-xl shadow-hard-sm opacity-70 cursor-not-allowed flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <IconUsers className="w-5 h-5 text-ink" />
                <h3 className="font-display text-lg uppercase text-ink">PLAY WITH FRIENDS</h3>
              </div>
              <p className="font-ui text-xs font-semibold text-graphite mt-1">
                Create online room & invite friends via code or URL.
              </p>
            </div>
            <span className="font-display text-xs uppercase text-ink bg-phase-vote border-2 border-ink px-3 py-1.5 rounded-lg shadow-hard-sm">
              COMING SOON
            </span>
          </div>
        </div>
      </PopDialog>
    </div>
  );
}
