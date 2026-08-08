import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/marketing/breadcrumb-json-ld';
import { MarketingPageShell } from '@/components/marketing/marketing-page-shell';
import { PopCard } from '@/components/pop/pop-card';
import { copy } from '@/copy';

export const metadata: Metadata = {
  title: copy.marketing.terms.meta.title,
  description: copy.marketing.terms.meta.description,
  alternates: { canonical: '/terms' },
  openGraph: {
    title: copy.marketing.terms.meta.title,
    description: copy.marketing.terms.meta.description,
    url: '/terms',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: copy.marketing.terms.meta.title,
    description: copy.marketing.terms.meta.description,
  },
};

export default function TermsPage() {
  return (
    <MarketingPageShell>
      <BreadcrumbJsonLd pageName={copy.marketing.terms.meta.title} path="/terms" />

      <PopCard className="p-6 md:p-8 bg-paper-2 border-3 border-ink shadow-hard-lg space-y-6">
        <div className="space-y-2 border-b-3 border-ink pb-4">
          <span className="inline-block rounded-lg border-3 border-ink bg-highlight px-3 py-1 font-display text-xs uppercase tracking-wide text-ink shadow-hard-sm">
            USER AGREEMENT
          </span>
          <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wide text-ink">
            {copy.marketing.terms.title}
          </h1>
          <p className="font-ui text-base font-semibold text-graphite">
            {copy.marketing.terms.intro}
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {copy.marketing.terms.sections.map((section) => (
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
