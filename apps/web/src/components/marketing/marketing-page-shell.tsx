import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/marketing/site-footer';
import { SiteHeader } from '@/components/marketing/site-header';
import { SkipLink } from '@/components/marketing/skip-link';

export function MarketingPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col justify-between">
      <SkipLink />
      <SiteHeader />
      <main id="main-content" className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 sm:px-6 py-10 flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
