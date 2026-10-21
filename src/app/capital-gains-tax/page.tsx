import type { Metadata } from 'next';
import CapitalGainsCalculator from '@/components/CapitalGainsCalculator';
import ToolPage from '@/components/ToolPage';
import { getTool } from '@/data/tools';
import { SITE_NAME } from '@/lib/site';

const meta = getTool('capital-gains-tax')!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  keywords: meta.keywords,
  alternates: { canonical: '/capital-gains-tax/' },
  openGraph: { type: 'website', locale: 'ko_KR', siteName: SITE_NAME, title: meta.title, description: meta.description, url: '/capital-gains-tax/' },
  twitter: { card: 'summary', title: meta.title, description: meta.description },
};

export default function CapitalGainsTaxPage() {
  return (
    <ToolPage meta={meta}>
      <CapitalGainsCalculator />
    </ToolPage>
  );
}
