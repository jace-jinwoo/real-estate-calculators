import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import HomeSearch from '@/components/HomeSearch';
import JsonLd from '@/components/JsonLd';
import { GUIDES } from '@/data/guides';
import { CATEGORY_LABELS, TOOLS } from '@/data/tools';
import { absoluteUrl, DATA_VERIFIED_AT, SITE_NAME, SITE_TAGLINE } from '@/lib/site';

export default function HomePage() {
  const items = TOOLS.map((t) => ({
    slug: t.slug, name: t.name, shortDescription: t.shortDescription, category: t.category,
    categoryLabel: CATEGORY_LABELS[t.category], keywords: t.keywords,
  }));
  const categories = Object.entries(CATEGORY_LABELS).map(([id, label]) => ({ id, label }));
  const popular = TOOLS.filter((t) => t.popular);
  const latest = [...GUIDES].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);

  return (
    <div className="space-y-10">
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: absoluteUrl('/'), inLanguage: 'ko-KR', description: SITE_TAGLINE }} />
      <section>
        <h1 className="text-3xl font-bold text-gray-900">{SITE_NAME}</h1>
        <p className="mt-2 text-gray-600">{SITE_TAGLINE}. 가입 없이 무료로 사용하며 입력값은 서버로 전송되지 않습니다.</p>
        <p className="mt-2 rounded-md bg-brand-50 p-3 text-sm text-gray-700">
          공식 출처를 직접 열어 확인한 기준({DATA_VERIFIED_AT} 확인)만 계산에 적용합니다. 확인하지 못한 세율·한도는 &quot;미확인&quot;으로 표시하며 해당 계산은 하지 않거나 참고용으로만 제공합니다.
        </p>
      </section>

      <HomeSearch items={items} categories={categories} />

      <section aria-labelledby="popular-h">
        <h2 id="popular-h" className="text-xl font-semibold text-gray-900">인기 도구</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {popular.map((t) => (
            <li key={t.slug}>
              <Link href={`/${t.slug}/`} className="block rounded-lg border border-gray-200 p-4 hover:border-brand-400 hover:bg-brand-50">
                <span className="font-semibold text-brand-700">{t.name}</span>
                <span className="mt-1 block text-sm text-gray-600">{t.shortDescription}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <AdSlot placement="home" />

      <section aria-labelledby="latest-h">
        <h2 id="latest-h" className="text-xl font-semibold text-gray-900">최신 안내</h2>
        <ul className="mt-3 space-y-3">
          {latest.map((g) => (
            <li key={g.id} className="rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900">{g.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{g.summary}</p>
              <p className="mt-2 text-xs text-gray-500">{g.date} · <Link href={`/${g.toolSlug}/`} className="text-brand-700 hover:underline">관련 도구 보기</Link></p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm"><Link href="/guide/" className="text-brand-700 hover:underline">이용 안내 전체 보기</Link></p>
      </section>
    </div>
  );
}
