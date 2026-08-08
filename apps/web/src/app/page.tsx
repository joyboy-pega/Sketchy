import type { Metadata } from 'next';
import { FiveAliveBoard } from '@/components/five-alive/FiveAliveBoard';
import { SiteFooter } from '@/components/marketing/site-footer';
import { SiteHeader } from '@/components/marketing/site-header';

export const metadata: Metadata = {
  title: '5 Alive Card Game | Play Online or Local',
  description: 'Fast-paced 5 Alive card game console. Keep the running total under 21 or lose a life!',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between">
      <SiteHeader />
      <main id="main-content" className="w-full max-w-6xl mx-auto px-4 py-8 flex-1">
        <FiveAliveBoard />
      </main>
      <SiteFooter />
    </div>
  );
}
