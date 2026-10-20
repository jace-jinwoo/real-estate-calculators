import type { Metadata } from 'next';
import Link from 'next/link';
import { ADS_ENABLED, LAST_UPDATED, SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: `${SITE_NAME}의 개인정보 수집·이용, 쿠키 및 광고(Google AdSense) 관련 처리방침입니다.`,
  alternates: { canonical: '/privacy/' },
  openGraph: { url: '/privacy/', title: `개인정보처리방침 | ${SITE_NAME}` },
};

export default function PrivacyPage() {
  return (
    <article className="space-y-6 text-gray-700">
      <h1 className="text-3xl font-bold text-gray-900">개인정보처리방침</h1>
      <p className="text-sm text-gray-500">시행일: {LAST_UPDATED}</p>
      <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900" role="note">
        이 문서는 서비스 현황에 맞춘 기본 양식입니다. 운영자는 실제 운영 방식(광고 게재, 분석 도구 추가 등)이 바뀔 때마다 내용을 갱신하고, 필요하면 전문가의 검토를 받으세요.
      </p>

      <section>
        <h2 className="text-xl font-semibold text-gray-900">1. 수집하는 개인정보</h2>
        <p className="mt-2">
          {SITE_NAME}는 회원가입과 로그인 기능이 없으며, 이름·연락처 등 개인정보를 직접 수집하지 않습니다. 도구에 입력한 값(소득, 대출 금액, 금리 등)은 방문자의 브라우저 안에서만 처리되며 서버로 전송되거나 저장되지 않습니다.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900">2. 브라우저 저장소</h2>
        <p className="mt-2">현재 서비스는 쿠키나 로컬 저장소에 입력값을 저장하지 않습니다.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900">3. 광고 및 쿠키</h2>
        <p className="mt-2">
          {ADS_ENABLED
            ? '이 사이트는 Google AdSense 광고를 게재합니다. Google을 포함한 제3자 광고 사업자는 쿠키를 사용해 방문자의 이전 방문 기록을 바탕으로 광고를 게재할 수 있습니다. 방문자는 Google 광고 설정에서 맞춤 광고를 해제할 수 있습니다.'
            : '현재 이 사이트는 광고를 게재하지 않습니다. 향후 Google AdSense 광고를 게재하게 되면 Google을 포함한 제3자 광고 사업자가 쿠키를 사용해 광고를 게재할 수 있으며, 이 방침을 갱신해 안내합니다.'}
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900">4. 호스팅 서버 로그</h2>
        <p className="mt-2">
          사이트는 Netlify 등 정적 호스팅 서비스에서 제공되며, 호스팅 사업자는 접속 IP, 브라우저 정보 등 일반적인 서버 로그를 자체 정책에 따라 처리할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900">5. 문의</h2>
        <p className="mt-2">
          개인정보 관련 문의는 <Link href="/contact/" className="text-brand-700 underline">문의 페이지</Link>를 통해 접수해 주세요.
        </p>
      </section>
    </article>
  );
}
