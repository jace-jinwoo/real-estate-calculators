import type { Metadata } from 'next';
import DsrCalculator from '@/components/DsrCalculator';
import ToolPage from '@/components/ToolPage';
import { getTool } from '@/data/tools';
import { SITE_NAME } from '@/lib/site';

const meta = getTool('dsr')!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  keywords: meta.keywords,
  alternates: { canonical: '/dsr/' },
  openGraph: { type: 'website', locale: 'ko_KR', siteName: SITE_NAME, title: meta.title, description: meta.description, url: '/dsr/' },
  twitter: { card: 'summary', title: meta.title, description: meta.description },
};

export default function DsrPage() {
  return (
    <ToolPage meta={meta}>
      <DsrCalculator />
    </ToolPage>
  );
}
