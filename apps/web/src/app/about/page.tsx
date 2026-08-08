import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/marketing/breadcrumb-json-ld';
import { MarketingPageShell } from '@/components/marketing/marketing-page-shell';
import { PopCard } from '@/components/pop/pop-card';
import { copy } from '@/copy';

export const metadata: Metadata = {
  title: copy.marketing.about.meta.title,
  description: copy.marketing.about.meta.description,
  alternates: { canonical: '/about' },
  openGraph: {
    title: copy.marketing.about.meta.title,
    description: copy.marketing.about.meta.description,
    url: '/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: copy.marketing.about.meta.title,
    description: copy.marketing.about.meta.description,
  },
};

export default function AboutPage() {
  return (
    <MarketingPageShell>
      <BreadcrumbJsonLd pageName={copy.marketing.about.meta.title} path="/about" />

      <PopCard className="p-6 md:p-8 bg-paper-2 border-3 border-ink shadow-hard-lg space-y-6">
        <div className="space-y-2 border-b-3 border-ink pb-4">
          <span className="inline-block rounded-lg border-3 border-ink bg-highlight px-3 py-1 font-display text-xs uppercase tracking-wide text-ink shadow-hard-sm">
            OUR STORY
          </span>
          <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wide text-ink">
            {copy.marketing.about.title}
          </h1>
        </div>

        <div className="flex flex-col gap-4 font-ui text-base font-semibold text-graphite leading-relaxed">
          {copy.marketing.about.paragraphs.map((paragraph) => (
            <p key={paragraph} className="bg-paper border-2 border-ink p-4 rounded-xl shadow-hard-sm text-ink">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="p-4 bg-phase-vote border-3 border-ink rounded-xl shadow-hard-sm">
          <p className="font-display text-sm uppercase tracking-wide text-ink">
            {copy.marketing.about.closingLine}
          </p>
        </div>
      </PopCard>
    </MarketingPageShell>
  );
}
