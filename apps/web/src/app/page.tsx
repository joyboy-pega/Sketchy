import type { Metadata } from 'next';
import { ArcadeConsole } from '@/components/console/ArcadeConsole';
import { SiteFooter } from '@/components/marketing/site-footer';
import { SiteHeader } from '@/components/marketing/site-header';

export const metadata: Metadata = {
  title: 'Sketchy Arcade Console — 5 Hearts Party Game',
  description: 'Multi-game arcade console featuring 5 Hearts card game and exciting party games!',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col justify-between">
      <SiteHeader />
      <main id="main-content" className="w-full max-w-5xl mx-auto px-4 py-8 flex-1">
        <ArcadeConsole />
      </main>
      <SiteFooter />
    </div>
  );
}
