import type { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import { GUIDES } from '@/data/guides';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: '이용 안내',
  description: `${SITE_NAME} 사용 방법과 계산 결과 해석 시 주의사항, 데이터 확인 정책, 안내 콘텐츠를 제공합니다.`,
  alternates: { canonical: '/guide/' },
  openGraph: { url: '/guide/', title: `이용 안내 | ${SITE_NAME}` },
};

export default function GuidePage() {
  return (
    <article className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">이용 안내</h1>

      <section aria-labelledby="howto-h">
        <h2 id="howto-h" className="text-xl font-semibold">기본 사용 방법</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-gray-700">
          <li>홈 화면의 검색창이나 카테고리에서 필요한 도구를 선택합니다.</li>
          <li>값을 입력하면 결과가 실시간으로 표시됩니다. 입력값이 올바르지 않으면 오류 메시지가 표시됩니다.</li>
          <li>결과는 추정치이며 입력값은 서버로 전송되지 않습니다.</li>
          <li>각 도구 페이지 하단의 상세 설명, FAQ, 참고 출처를 함께 확인하세요.</li>
        </ol>
      </section>

      <section aria-labelledby="notes-h">
        <h2 id="notes-h" className="text-xl font-semibold">결과 해석 시 주의사항</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-gray-700">
          <li>세율·한도·규제는 공식 출처를 직접 확인한 값만 사용하며, 확인하지 못한 항목은 &quot;미확인&quot;으로 표시하고 계산에 쓰지 않습니다.</li>
          <li>세무·대출 결과는 참고용 추정이며 실제 세액·한도는 국세청·지자체·금융기관이 결정합니다.</li>
          <li>계약·세무 신고·대출 신청 전에는 공식 기관 또는 전문가(세무사, 공인중개사, 금융기관)에게 확인하세요.</li>
        </ul>
      </section>

      <AdSlot placement="content" />

      <section aria-labelledby="articles-h">
        <h2 id="articles-h" className="text-xl font-semibold">안내 콘텐츠</h2>
        <div className="mt-4 space-y-8">
          {GUIDES.map((g) => (
            <section key={g.id} id={g.id} aria-labelledby={`${g.id}-h`} className="scroll-mt-4">
              <h3 id={`${g.id}-h`} className="text-lg font-semibold text-gray-900">{g.title}</h3>
              <p className="text-xs text-gray-400">{g.date}</p>
              <div className="mt-2 space-y-3 text-gray-700">
                {g.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <p className="mt-2 text-sm">
                <Link href={`/${g.toolSlug}/`} className="text-brand-700 underline">관련 도구로 이동</Link>
              </p>
            </section>
          ))}
        </div>
      </section>
    </article>
  );
}
