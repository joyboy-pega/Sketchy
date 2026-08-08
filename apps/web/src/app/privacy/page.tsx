import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/marketing/breadcrumb-json-ld';
import { MarketingPageShell } from '@/components/marketing/marketing-page-shell';
import { PopCard } from '@/components/pop/pop-card';
import { copy } from '@/copy';

export const metadata: Metadata = {
  title: copy.marketing.privacy.meta.title,
  description: copy.marketing.privacy.meta.description,
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: copy.marketing.privacy.meta.title,
    description: copy.marketing.privacy.meta.description,
    url: '/privacy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: copy.marketing.privacy.meta.title,
    description: copy.marketing.privacy.meta.description,
  },
};

export default function PrivacyPage() {
  return (
    <MarketingPageShell>
      <BreadcrumbJsonLd pageName={copy.marketing.privacy.meta.title} path="/privacy" />

      <PopCard className="p-6 md:p-8 bg-paper-2 border-3 border-ink shadow-hard-lg space-y-6">
        <div className="space-y-2 border-b-3 border-ink pb-4">
          <span className="inline-block rounded-lg border-3 border-ink bg-highlight px-3 py-1 font-display text-xs uppercase tracking-wide text-ink shadow-hard-sm">
            DATA PROTECTION
          </span>
          <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wide text-ink">
            {copy.marketing.privacy.title}
          </h1>
          <p className="font-ui text-base font-semibold text-graphite">
            {copy.marketing.privacy.intro}
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {copy.marketing.privacy.sections.map((section) => (
            <section
              key={section.heading}
              className="flex flex-col gap-2 rounded-xl border-3 border-ink bg-paper p-5 shadow-hard-sm"
            >
              <h2 className="font-display text-base uppercase tracking-wide text-ink">
                {section.heading}
              </h2>
              <p className="font-ui text-sm font-semibold text-graphite leading-relaxed">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </PopCard>
    </MarketingPageShell>
  );
}
