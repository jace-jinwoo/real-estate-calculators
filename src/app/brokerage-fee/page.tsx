import type { Metadata } from 'next';
import BrokerageCalculator from '@/components/BrokerageCalculator';
import ToolPage from '@/components/ToolPage';
import { getTool } from '@/data/tools';
import { SITE_NAME } from '@/lib/site';

const meta = getTool('brokerage-fee')!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  keywords: meta.keywords,
  alternates: { canonical: '/brokerage-fee/' },
  openGraph: { type: 'website', locale: 'ko_KR', siteName: SITE_NAME, title: meta.title, description: meta.description, url: '/brokerage-fee/' },
  twitter: { card: 'summary', title: meta.title, description: meta.description },
};

export default function BrokerageFeePage() {
  return (
    <ToolPage meta={meta}>
      <BrokerageCalculator />
    </ToolPage>
  );
}
