import type { Metadata } from 'next';
import Link from 'next/link';
import { TOOLS } from '@/data/tools';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: '서비스 소개',
  description: `${SITE_NAME}는 부동산 세금·대출 계산기를 제공하는 무료 웹 서비스입니다. 운영 원칙과 데이터 정확성 정책을 안내합니다.`,
  alternates: { canonical: '/about/' },
  openGraph: { url: '/about/', title: `서비스 소개 | ${SITE_NAME}` },
};

export default function AboutPage() {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">서비스 소개</h1>
      <p className="text-gray-700">
        {SITE_NAME}는 부동산 거래와 대출에서 자주 필요한 DSR·취득세·양도소득세·LTV·중개보수 계산을 모은 무료 웹 서비스입니다. 회원가입이 필요 없고, 입력한 값은 서버로 전송되지 않고 방문자의 브라우저 안에서만 처리됩니다.
      </p>

      <section aria-labelledby="tools-h">
        <h2 id="tools-h" className="text-xl font-semibold">제공 도구</h2>
        <p className="mt-2 text-sm text-gray-600">도구는 공식 출처 확인이 끝나는 순서대로 추가됩니다.</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-gray-700">
          {TOOLS.map((t) => (
            <li key={t.slug}>
              <Link href={`/${t.slug}/`} className="text-brand-700 underline">{t.name}</Link> - {t.shortDescription}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="policy-h">
        <h2 id="policy-h" className="text-xl font-semibold">데이터 정확성 정책</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
          <li>세율·공제·한도·규제는 법제처, 국세청, 금융위원회 등 공식 출처를 직접 열어 확인한 값만 적용일별 버전 데이터로 관리합니다.</li>
          <li>각 값에는 출처 URL, 확인일, 적용 기준일을 함께 기록하고 도구 페이지에 확인 상태를 표시합니다.</li>
          <li>확인하지 못한 항목은 임의로 채우지 않고 &quot;미확인&quot;으로 표시하며, 그 항목이 필요한 계산은 하지 않거나 참고용으로만 제공합니다.</li>
          <li>양도소득세처럼 요건이 복잡한 세무 사례는 정확한 세액인 것처럼 표시하지 않습니다.</li>
        </ul>
      </section>

      <section aria-labelledby="ads-h">
        <h2 id="ads-h" className="text-xl font-semibold">광고에 대해</h2>
        <p className="mt-2 text-gray-700">
          서비스 운영을 위해 Google AdSense 광고를 게재할 수 있습니다. 광고는 "광고" 라벨로 구분되며 도구의 버튼·결과와 분리되어 표시됩니다.
        </p>
      </section>

      <p className="text-gray-700">
        오류 제보와 개선 제안은 <Link href="/contact/" className="text-brand-700 underline">문의 페이지</Link>를 이용해 주세요.
      </p>
    </article>
  );
}
