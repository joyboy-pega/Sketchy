import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbJsonLd } from '@/components/marketing/breadcrumb-json-ld';
import { MarketingPageShell } from '@/components/marketing/marketing-page-shell';
import { PopCard } from '@/components/pop/pop-card';
import { PopButton } from '@/components/pop/pop-button';
import { IconTarget } from '@/components/icons/icon-target';
import { IconCards } from '@/components/icons/icon-cards';
import { IconZap } from '@/components/icons/icon-zap';
import { IconHeart } from '@/components/icons/icon-heart';

export const metadata: Metadata = {
  title: 'How to Play 5 Hearts — Rules & Card Mechanics',
  description: 'Learn the complete rules and action card strategies for 5 Hearts card game.',
};

export default function HowToPlayPage() {
  return (
    <MarketingPageShell>
      <BreadcrumbJsonLd pageName="How to Play 5 Hearts" path="/how-to-play" />

      <PopCard className="p-6 md:p-8 bg-paper-2 border-3 border-ink shadow-hard-lg space-y-6">
        <div className="space-y-2 border-b-3 border-ink pb-4">
          <span className="inline-flex items-center gap-1 rounded-lg border-3 border-ink bg-highlight px-3 py-1 font-display text-xs uppercase tracking-wide text-ink shadow-hard-sm">
            <IconHeart className="w-3.5 h-3.5 fill-ink text-ink" />
            GAME GUIDE
          </span>
          <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wide text-ink">
            HOW TO PLAY 5 HEARTS
          </h1>
          <p className="font-ui text-base font-semibold text-graphite">
            Fast-paced card elimination party game! Keep the running total under 21 or lose a heart.
          </p>
        </div>

        <div className="space-y-6 font-ui">
          {/* Objective */}
          <div className="p-5 bg-phase-discuss border-3 border-ink rounded-xl shadow-hard-sm space-y-2">
            <h2 className="font-display text-xl uppercase text-ink flex items-center space-x-2">
              <IconTarget className="w-5 h-5 text-ink" />
              <span>THE OBJECTIVE</span>
            </h2>
            <p className="text-sm font-semibold text-graphite leading-relaxed">
              Every player starts with **5 Hearts** and a hand of 10 cards. On your turn, play a card to add to the **Running Total**. Your goal is to force other players over 21 while keeping your hearts intact!
            </p>
          </div>

          {/* Core Rules */}
          <div className="p-5 bg-paper border-3 border-ink rounded-xl shadow-hard-sm space-y-3">
            <h2 className="font-display text-xl uppercase text-ink flex items-center space-x-2">
              <IconCards className="w-5 h-5 text-ink" />
              <span>BASIC RULES & TURNS</span>
            </h2>
            <ul className="space-y-2 text-sm font-semibold text-graphite list-disc list-inside">
              <li>**Number Cards (0–7)**: Add their exact face value to the running total (e.g. Total 10 + Card 5 = Total 15).</li>
              <li>**Going Over 21**: If your card pushes the running total above 21, you **lose 1 heart**, the running total resets to 0, and a new round begins.</li>
              <li>**Winning a Round**: If you play your last card and empty your hand, you win the round! All other active players lose 1 heart.</li>
            </ul>
          </div>

          {/* Action Cards */}
          <div className="p-5 bg-phase-vote border-3 border-ink rounded-xl shadow-hard-sm space-y-3">
            <h2 className="font-display text-xl uppercase text-ink flex items-center space-x-2">
              <IconZap className="w-5 h-5 text-ink" />
              <span>SPECIAL ACTION CARDS</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
              <div className="bg-paper-2 border-2 border-ink p-3 rounded-lg shadow-hard-sm space-y-1">
                <span className="font-display text-sm text-highlight bg-ink px-2 py-0.5 rounded">5 HEARTS</span>
                <p className="text-graphite">Instantly resets the running total back to 0!</p>
              </div>

              <div className="bg-paper-2 border-2 border-ink p-3 rounded-lg shadow-hard-sm space-y-1">
                <span className="font-display text-sm text-undercover bg-ink px-2 py-0.5 rounded">= 21</span>
                <p className="text-graphite">Instantly sets the running total directly to 21.</p>
              </div>

              <div className="bg-paper-2 border-2 border-ink p-3 rounded-lg shadow-hard-sm space-y-1">
                <span className="font-display text-sm text-civilian bg-ink px-2 py-0.5 rounded">SKIP</span>
                <p className="text-graphite">Skips the next player's turn in turn order.</p>
              </div>

              <div className="bg-paper-2 border-2 border-ink p-3 rounded-lg shadow-hard-sm space-y-1">
                <span className="font-display text-sm text-civilian bg-ink px-2 py-0.5 rounded">REVERSE</span>
                <p className="text-graphite">Flips direction of play (Clockwise ↔ Counter-Clockwise).</p>
              </div>

              <div className="bg-paper-2 border-2 border-ink p-3 rounded-lg shadow-hard-sm space-y-1">
                <span className="font-display text-sm text-civilian bg-ink px-2 py-0.5 rounded">PASS</span>
                <p className="text-graphite">Passes your turn without adding any points to the total.</p>
              </div>

              <div className="bg-paper-2 border-2 border-ink p-3 rounded-lg shadow-hard-sm space-y-1">
                <span className="font-display text-sm text-mrwhite bg-ink px-2 py-0.5 rounded">BOMB</span>
                <p className="text-graphite">Reduces running total by 5.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Launch */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-3 border-ink">
          <p className="font-ui text-sm font-bold text-ink">
            Ready to test your strategy? Launch the Arcade Console now!
          </p>
          <Link href="/">
            <PopButton variant="primary" size="lg">
              PLAY 5 HEARTS NOW ➔
            </PopButton>
          </Link>
        </div>
      </PopCard>
    </MarketingPageShell>
  );
}
