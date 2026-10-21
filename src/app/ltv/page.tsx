import type { Metadata } from 'next';
import LtvCalculator from '@/components/LtvCalculator';
import ToolPage from '@/components/ToolPage';
import { getTool } from '@/data/tools';
import { SITE_NAME } from '@/lib/site';

const meta = getTool('ltv')!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  keywords: meta.keywords,
  alternates: { canonical: '/ltv/' },
  openGraph: { type: 'website', locale: 'ko_KR', siteName: SITE_NAME, title: meta.title, description: meta.description, url: '/ltv/' },
  twitter: { card: 'summary', title: meta.title, description: meta.description },
};

export default function LtvPage() {
  return (
    <ToolPage meta={meta}>
      <LtvCalculator />
    </ToolPage>
  );
}
