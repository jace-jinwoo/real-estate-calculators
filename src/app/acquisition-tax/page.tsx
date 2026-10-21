import type { Metadata } from 'next';
import AcquisitionTaxCalculator from '@/components/AcquisitionTaxCalculator';
import ToolPage from '@/components/ToolPage';
import { getTool } from '@/data/tools';
import { SITE_NAME } from '@/lib/site';

const meta = getTool('acquisition-tax')!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  keywords: meta.keywords,
  alternates: { canonical: '/acquisition-tax/' },
  openGraph: { type: 'website', locale: 'ko_KR', siteName: SITE_NAME, title: meta.title, description: meta.description, url: '/acquisition-tax/' },
  twitter: { card: 'summary', title: meta.title, description: meta.description },
};

export default function AcquisitionTaxPage() {
  return (
    <ToolPage meta={meta}>
      <AcquisitionTaxCalculator />
    </ToolPage>
  );
}
