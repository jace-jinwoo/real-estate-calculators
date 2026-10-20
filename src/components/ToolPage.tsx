import Link from 'next/link';
import type { ReactNode } from 'react';
import AdSlot from './AdSlot';
import JsonLd from './JsonLd';
import DataStatusTable from './DataStatusTable';
import { getTool, type ToolMeta } from '@/data/tools';
import { absoluteUrl, SITE_NAME } from '@/lib/site';

export default function ToolPage({ meta, children }: { meta: ToolMeta; children: ReactNode }) {
  const related = meta.related.map((s) => getTool(s)).filter((t): t is ToolMeta => Boolean(t));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: meta.name,
        url: absoluteUrl(`/${meta.slug}/`),
        description: meta.description,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        inLanguage: 'ko-KR',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: meta.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE_NAME, item: absoluteUrl('/') },
          { '@type': 'ListItem', position: 2, name: meta.name, item: absoluteUrl(`/${meta.slug}/`) },
        ],
      },
    ],
  };

  return (
    <article>
      <JsonLd data={jsonLd} />
      <nav aria-label="현재 위치" className="text-sm text-gray-500">
        <Link href="/" className="hover:text-brand-700">홈</Link> <span aria-hidden="true">/</span> {meta.name}
      </nav>
      <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">{meta.name}</h1>
      <p className="mt-2 text-gray-600">{meta.shortDescription}</p>

      <section aria-labelledby="tool-heading" className="mt-6">
        <h2 id="tool-heading" className="sr-only">계산 도구</h2>
        {children}
      </section>

      <AdSlot placement="tool" />

      <section aria-labelledby="howto-heading" className="mt-10">
        <h2 id="howto-heading" className="text-xl font-semibold text-gray-900">사용 방법</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-gray-700">
          {meta.howTo.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="example-heading" className="mt-10">
        <h2 id="example-heading" className="text-xl font-semibold text-gray-900">예제</h2>
        <div className="mt-3 rounded-lg border border-brand-100 bg-brand-50 p-4">
          <p className="text-gray-800"><span className="font-medium">입력:</span> {meta.example.input}</p>
          <p className="mt-1 text-gray-800"><span className="font-medium">결과:</span> {meta.example.output}</p>
          {meta.example.note && <p className="mt-2 text-sm text-gray-600">{meta.example.note}</p>}
        </div>
      </section>

      <section aria-labelledby="detail-heading" className="mt-10">
        <h2 id="detail-heading" className="text-xl font-semibold text-gray-900">상세 설명</h2>
        <div className="mt-3 space-y-3 text-gray-700">
          {meta.details.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <section aria-labelledby="faq-heading" className="mt-10">
        <h2 id="faq-heading" className="text-xl font-semibold text-gray-900">자주 묻는 질문</h2>
        <dl className="mt-3 space-y-4">
          {meta.faq.map((f) => (
            <div key={f.q}>
              <dt className="font-medium text-gray-900">Q. {f.q}</dt>
              <dd className="mt-1 text-gray-700">A. {f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <DataStatusTable tool={meta.slug} />

      <section aria-labelledby="source-heading" className="mt-10">
        <h2 id="source-heading" className="text-xl font-semibold text-gray-900">참고 출처</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-gray-700">
          {meta.sources.map((s) => (
            <li key={s.label}>
              {s.url ? (
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-brand-700 underline hover:text-brand-900">
                  {s.label}
                </a>
              ) : (
                s.label
              )}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-gray-500">
          법령·규제는 개정될 수 있으므로 중요한 판단 전에는 공식 원문과 해당 기관에서 최신 내용을 직접 확인하세요.
        </p>
      </section>

      <AdSlot placement="content" />

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-10">
          <h2 id="related-heading" className="text-xl font-semibold text-gray-900">관련 도구</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-3">
            {related.map((t) => (
              <li key={t.slug}>
                <Link href={`/${t.slug}/`} className="block rounded-lg border border-gray-200 p-3 hover:border-brand-600 hover:bg-brand-50">
                  <span className="font-medium text-gray-900">{t.name}</span>
                  <span className="mt-1 block text-sm text-gray-600">{t.shortDescription}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
