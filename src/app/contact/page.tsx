import type { Metadata } from 'next';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: '문의',
  description: `${SITE_NAME} 오류 제보, 개선 제안, 개인정보 관련 문의 방법을 안내합니다.`,
  alternates: { canonical: '/contact/' },
  openGraph: { url: '/contact/', title: `문의 | ${SITE_NAME}` },
};

export default function ContactPage() {
  return (
    <article className="space-y-6 text-gray-700">
      <h1 className="text-3xl font-bold text-gray-900">문의</h1>
      <p>오류 제보, 변환 기준에 대한 의견, 기능 제안, 개인정보 관련 문의를 이메일로 보내 주세요.</p>

      <section aria-labelledby="mail-h" className="rounded-lg border border-gray-200 p-4">
        <h2 id="mail-h" className="text-lg font-semibold text-gray-900">이메일</h2>
        {CONTACT_EMAIL ? (
          <p className="mt-2">
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-700 underline">{CONTACT_EMAIL}</a>
          </p>
        ) : (
          <p className="mt-2 text-amber-800">
            문의 이메일이 아직 설정되지 않았습니다. (운영자: 배포 환경변수 NEXT_PUBLIC_CONTACT_EMAIL을 설정한 뒤 다시 빌드하세요.)
          </p>
        )}
      </section>

      <section aria-labelledby="tips-h">
        <h2 id="tips-h" className="text-lg font-semibold text-gray-900">제보할 때 알려 주세요</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>사용한 도구와 페이지 주소</li>
          <li>입력한 값과 기대한 결과, 실제 결과</li>
          <li>사용 중인 브라우저와 기기</li>
        </ul>
        <p className="mt-2 text-sm text-gray-500">민감한 정보(비밀번호, 토큰 등)는 보내지 마세요.</p>
      </section>
    </article>
  );
}
