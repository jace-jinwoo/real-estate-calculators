import type { Metadata } from 'next';
import { LAST_UPDATED, SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: '이용약관',
  description: `${SITE_NAME} 이용 조건, 면책 사항, 저작권에 관한 약관입니다.`,
  alternates: { canonical: '/terms/' },
  openGraph: { url: '/terms/', title: `이용약관 | ${SITE_NAME}` },
};

export default function TermsPage() {
  return (
    <article className="space-y-6 text-gray-700">
      <h1 className="text-3xl font-bold text-gray-900">이용약관</h1>
      <p className="text-sm text-gray-500">시행일: {LAST_UPDATED}</p>
      <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900" role="note">
        이 문서는 기본 양식입니다. 운영 상황에 맞게 수정하고 필요하면 전문가의 검토를 받으세요.
      </p>

      <section>
        <h2 className="text-xl font-semibold text-gray-900">1. 서비스의 목적</h2>
        <p className="mt-2">{SITE_NAME}는 부동산 세금·대출 계산 도구를 무료로 제공합니다.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900">2. 결과의 성격과 면책</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>제공되는 결과는 참고용이며 정확성·완전성·특정 목적에의 적합성을 보증하지 않습니다.</li>
          <li>세율·한도·규제는 개정될 수 있으며, 확인하지 못한 항목은 &quot;미확인&quot;으로 표시합니다. 실제 세액·대출 한도는 국세청·지자체·금융기관 등 공식 기관의 판단이 우선합니다.</li>
          <li>계약, 세무 신고, 대출 신청, 법률과 관련된 판단은 공식 문서와 전문가 확인에 따라야 하며, 이 서비스의 결과만으로 내린 판단에 대한 책임은 이용자에게 있습니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900">3. 이용자의 책임</h2>
        <p className="mt-2">
          이용자는 서비스를 법령과 공공질서에 반하는 목적으로 사용하거나, 서비스의 정상 운영을 방해하는 행위(과도한 자동 요청 등)를 해서는 안 됩니다. 비밀번호·토큰 등 민감한 정보를 입력할 때는 이용자 본인의 환경 보안에 유의해야 합니다.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900">4. 저작권</h2>
        <p className="mt-2">사이트의 문구·디자인·소스 구성에 대한 권리는 운영자에게 있으며, 사전 동의 없는 무단 복제·배포를 금지합니다.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900">5. 서비스 변경</h2>
        <p className="mt-2">운영자는 서비스의 일부 또는 전부를 사전 고지 후 또는 불가피한 경우 사후에 변경·중단할 수 있습니다.</p>
      </section>
    </article>
  );
}
