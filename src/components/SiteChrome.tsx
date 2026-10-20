import Link from 'next/link';
import { SITE_NAME } from '@/lib/site';
import { TOOLS } from '@/data/tools';

export function SiteHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-bold text-brand-700">
          {SITE_NAME}
        </Link>
        <nav aria-label="주요 메뉴">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <li><Link href="/" className="text-gray-700 hover:text-brand-700">홈</Link></li>
            {TOOLS.map((t) => (
              <li key={t.slug}><Link href={`/${t.slug}/`} className="text-gray-700 hover:text-brand-700">{t.name.replace(' 계산기', '')}</Link></li>
            ))}
            <li><Link href="/guide/" className="text-gray-700 hover:text-brand-700">이용 안내</Link></li>
            <li><Link href="/about/" className="text-gray-700 hover:text-brand-700">서비스 소개</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-gray-600">
        <nav aria-label="전체 도구">
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            {TOOLS.map((t) => (
              <li key={t.slug}>
                <Link href={`/${t.slug}/`} className="hover:text-brand-700">{t.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="사이트 정보" className="mt-4">
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            <li><Link href="/about/" className="hover:text-brand-700">서비스 소개</Link></li>
            <li><Link href="/guide/" className="hover:text-brand-700">이용 안내</Link></li>
            <li><Link href="/privacy/" className="hover:text-brand-700">개인정보처리방침</Link></li>
            <li><Link href="/terms/" className="hover:text-brand-700">이용약관</Link></li>
            <li><Link href="/contact/" className="hover:text-brand-700">문의</Link></li>
          </ul>
        </nav>
        <p className="mt-4 text-xs text-gray-500">
          © {SITE_NAME}. 계산 결과는 참고용 추정치이며 세무·법률·금융 판단의 유일한 근거로 사용하지 마세요. 실제 세액·한도는 국세청, 지자체, 금융기관 등 공식 기관에서 확인하세요.
        </p>
      </div>
    </footer>
  );
}
