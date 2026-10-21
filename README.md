# 부동산 세금·대출 계산기 (real-estate-calculators)

DSR·LTV·취득세·양도소득세·중개보수 계산기. Next.js App Router + TypeScript + Tailwind CSS 3, `output: 'export'` 정적 사이트입니다. 서버 API·DB·로그인이 없고 모든 계산은 브라우저에서 이루어집니다.

## 페이지

| 경로 | 상태 |
| --- | --- |
| `/dsr/` | 구현. 스트레스 DSR 가산금리는 확인된 값만 제공, 규제 한도 비율은 미확인(이용자 입력 비교) |
| `/brokerage-fee/` | 구현. 경기도 주택 조례 요율 + 오피스텔·상가 요율만 계산. 그 외 지역 주택은 계산 불가 |
| `/ltv/` | 구현. 금융위 2025-06-27 보도자료의 확인된 값만 선택 제공. 일반 LTV 비율은 이용자 입력 |
| `/acquisition-tax/` | 구현. 확인된 세율만 적용. 6~9억 주택은 범위 표시. 지방교육세·농특세·감면 미반영 |
| `/capital-gains-tax/` | 입력 구조만 구현. **세액 계산 안 함** (세율·공제·비과세·중과 기준 미확인). 양도차익·보유기간만 산술 |

홈(검색·카테고리·인기 도구·최신 안내), 소개, 이용 안내, 개인정보처리방침, 이용약관, 문의, robots.txt, sitemap.xml, icon.svg 포함.

## 데이터 확인 정책과 현황 (확인일 2026-10-19)

값은 공식 출처를 직접 열어 확인한 경우에만 `status: '확인'` 으로 `src/data/*.ts` 에 기록하며 `sourceUrl`·`verifiedAt`·적용일을 함께 둡니다. 확인하지 못한 값은 `status: '미확인'` 으로 두고 계산에 쓰지 않으며 각 도구 페이지의 "적용 기준 데이터와 확인 상태" 표에 그대로 표시합니다.

- 확인: 중개보수 경기도 조례 별표1(2022-03-04 시행)·오피스텔·상가 요율(경기도 안내 페이지), LTV 일부(금융위 2025-06-27), 취득세 세율표(김해시청 안내 페이지, 기준일 미표시), 스트레스 DSR 3단계 가산금리(금융위 2025-05-20).
- 미확인: 경기도 외 시·도 주택 중개보수 조례, 중개보수 부가세, 일반 LTV 비율·규제지역 지정 현황·10.15 대책 이후 변경, DSR 규제 비율, 취득세 6~9억 구간 산식·지방교육세·농특세·감면·중과 제외 사유, 양도소득세 전 항목(기본세율·단기세율·중과·장기보유특별공제·기본공제·비과세·지방소득세).
- 법제처(law.go.kr) 조문 본문은 동적 페이지라 직접 읽지 못했고, 지자체·금융위 페이지를 통해 확인했습니다. 법령 원문 대조는 아직 하지 않았습니다.

## 검증 상태

- 단위 테스트 작성: `tests/*.test.ts` (brokerage, ltv, acquisition-tax, capital-gains 등).
- **`npm install`, `npm test`, `npm run typecheck`, `npm run build`, `npm run verify` 는 이 환경(npm 레지스트리 차단)에서 실행하지 못했습니다.** 코드는 직접 재검토만 했습니다. 로컬에서 아래 명령으로 꼭 확인하세요.
- 날짜 기간 계산(`holdingPeriod`)만 node 로 직접 실행해 확인했습니다.

```bash
npm install
npm test
npm run typecheck
npm run build
npm run verify   # out/ 정적 경로·메타·내부 링크·sitemap 검사 (필수 페이지: scripts/verify-static.mjs)
```

## 개발·배포

```bash
npm run dev
```

- GitHub 저장소 연결 후 Netlify: Build command `npm run build`, Publish directory `out` (`netlify.toml` 에 설정됨).
- 환경변수(`.env.example` 참고): `NEXT_PUBLIC_SITE_URL`(canonical·sitemap 기준), `NEXT_PUBLIC_CONTACT_EMAIL`, 광고는 `NEXT_PUBLIC_ADSENSE_ENABLED=true` 와 `NEXT_PUBLIC_ADSENSE_CLIENT`·슬롯 ID 를 모두 설정하기 전에는 아무것도 렌더링되지 않습니다(`AdSlot`). Google 인증/AdSense 메타태그는 포함하지 않았습니다.

## 데이터 갱신 절차

1. 공식 출처(법제처·국세청·금융위원회·지자체 조례 등)를 직접 열어 값과 시행일을 확인합니다.
2. `src/data/` 의 해당 파일에 항목을 추가하거나(`effectiveFrom`·`effectiveTo` 로 적용일별 버전 관리) `미확인` 항목을 `확인` 으로 바꾸고 `sourceUrl`, `verifiedAt` 을 기록합니다.
3. 계산 로직(`src/lib/*.ts`)과 테스트(`tests/`)를 함께 수정하고, `src/lib/site.ts` 의 `DATA_VERIFIED_AT`·`LAST_UPDATED` 를 갱신합니다.
4. 양도소득세는 기본세율·공제·비과세·중과 값을 확인한 뒤에만 `src/lib/capitalGains.ts` 에 세액 계산을 추가하세요.

## 구조

`src/app/<slug>/page.tsx` → `ToolPage`(설명·FAQ·출처·구조화 데이터) + 계산기 컴포넌트(`src/components/*Calculator.tsx`) → 순수 함수(`src/lib/`) → 데이터(`src/data/`, 스키마 `schema.ts`). 도구 메타는 `src/data/tools.ts` 한 곳에서 홈·sitemap·헤더에 반영됩니다.

결과는 모두 참고용 추정이며 세무·법률·금융 자문이 아닙니다.
