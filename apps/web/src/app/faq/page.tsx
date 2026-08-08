import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbJsonLd } from '@/components/marketing/breadcrumb-json-ld';
import { FaqJsonLd } from '@/components/marketing/faq-json-ld';
import { MarketingPageShell } from '@/components/marketing/marketing-page-shell';
import { PopCard } from '@/components/pop/pop-card';
import { copy } from '@/copy';

export const metadata: Metadata = {
  title: copy.marketing.faq.meta.title,
  description: copy.marketing.faq.meta.description,
  alternates: { canonical: '/faq' },
  openGraph: {
    title: copy.marketing.faq.meta.title,
    description: copy.marketing.faq.meta.description,
    url: '/faq',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: copy.marketing.faq.meta.title,
    description: copy.marketing.faq.meta.description,
  },
};

export default function FaqPage() {
  return (
    <MarketingPageShell>
      <BreadcrumbJsonLd pageName={copy.marketing.faq.meta.title} path="/faq" />
      <FaqJsonLd />
      
      <PopCard className="p-6 md:p-8 bg-paper-2 border-3 border-ink shadow-hard-lg space-y-6">
        <div className="space-y-2 border-b-3 border-ink pb-4">
          <span className="inline-block rounded-lg border-3 border-ink bg-highlight px-3 py-1 font-display text-xs uppercase tracking-wide text-ink shadow-hard-sm">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wide text-ink">
            {copy.marketing.faq.title}
          </h1>
          <p className="font-ui text-base font-semibold text-graphite">
            {copy.marketing.faq.intro}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {copy.marketing.faq.items.map((item, index) => {
            const tilts = ['-rotate-1', 'rotate-1', 'rotate-0'];
            const tilt = tilts[index % tilts.length];

            return (
              <div
                key={item.question}
                className={`flex flex-col gap-2 rounded-xl border-3 border-ink bg-paper-2 p-5 shadow-hard transition-transform duration-150 hover:-translate-y-0.5 ${tilt}`}
              >
                <dt className="font-display text-lg uppercase tracking-wide text-ink">
                  {item.question}
                </dt>
                <dd className="font-ui text-sm font-semibold text-graphite leading-relaxed">
                  {item.answer}
                  {'link' in item ? (
                    <>
                      {' '}
                      <Link
                        href={item.link.href}
                        className="font-ui text-sm font-bold text-civilian underline decoration-2 underline-offset-2 hover:text-ink"
                      >
                        {item.link.label}
                      </Link>
                    </>
                  ) : null}
                </dd>
              </div>
            );
          })}
        </div>
      </PopCard>
    </MarketingPageShell>
  );
}
