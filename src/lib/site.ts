export const SITE_NAME = '부동산 세금·대출 계산기';
export const SITE_TAGLINE = 'DSR·취득세·양도소득세·LTV·중개보수를 브라우저에서 바로 계산';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://example.netlify.app').replace(/\/+$/, '');
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || '';
export const LAST_UPDATED = '2026-10-19';
/** 데이터 확인일 (공식 출처를 열어 확인한 날짜) */
export const DATA_VERIFIED_AT = '2026-10-19';
/** 도구 페이지를 제외한 정적 페이지 경로 (sitemap, 검증 스크립트 공통) */
export const STATIC_PATHS = ['/', '/about/', '/guide/', '/privacy/', '/terms/', '/contact/'];

export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true' && ADSENSE_CLIENT !== '';

// Next.js 가 빌드 시 인라인하도록 환경변수를 정적으로 참조합니다.
export const ADSENSE_SLOTS = {
  home: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME || '',
  tool: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL || '',
  content: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT || '',
} as const;

export type AdPlacement = keyof typeof ADSENSE_SLOTS;

/** 경로(예: /dsr/)를 절대 URL 로 변환합니다. */
export function absoluteUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}
