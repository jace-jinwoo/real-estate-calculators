import type { DataItem } from './schema';

/**
 * 중개보수 상한요율 (경기도 주택 중개보수 등에 관한 조례 별표1, 2022-03-04 시행 / 공인중개사법 시행규칙 제20조).
 * 출처 페이지(경기도 부동산 중개보수 요율 안내)를 2026-10-19 에 직접 열어 확인한 값입니다.
 * 주택 중개보수 상한은 시·도 조례로 정해지므로 경기도 외 지역은 확인하지 못해 계산하지 않습니다.
 */
export const BROKERAGE_SOURCE_URL = 'https://gris.gg.go.kr/reb/selectRebRateView.do';
export const BROKERAGE_SOURCE_NAME = '경기도 부동산 중개보수 요율 안내 (경기도 주택 중개보수 등에 관한 조례 별표1, 공인중개사법 시행규칙 제20조)';
export const BROKERAGE_EFFECTIVE_FROM = '2022-03-04';

export interface BrokerageBand {
  /** 구간 하한(이상), 원 */
  from: number;
  /** 구간 상한(미만), 원. 마지막 구간은 null */
  to: number | null;
  /** 상한요율 % */
  ratePct: number;
  /** 한도액(원). null 이면 한도 없음 */
  cap: number | null;
}

const MAN = 10000;
const EOK = 100000000;

/** 주택 매매·교환 */
export const HOUSING_SALE: BrokerageBand[] = [
  { from: 0, to: 5000 * MAN, ratePct: 0.6, cap: 25 * MAN },
  { from: 5000 * MAN, to: 2 * EOK, ratePct: 0.5, cap: 80 * MAN },
  { from: 2 * EOK, to: 6 * EOK, ratePct: 0.4, cap: null },
  { from: 6 * EOK, to: 9 * EOK, ratePct: 0.4, cap: null },
  { from: 9 * EOK, to: 12 * EOK, ratePct: 0.5, cap: null },
  { from: 12 * EOK, to: 15 * EOK, ratePct: 0.6, cap: null },
  { from: 15 * EOK, to: null, ratePct: 0.7, cap: null },
];

/** 주택 임대차 등 */
export const HOUSING_LEASE: BrokerageBand[] = [
  { from: 0, to: 5000 * MAN, ratePct: 0.5, cap: 20 * MAN },
  { from: 5000 * MAN, to: 1 * EOK, ratePct: 0.4, cap: 30 * MAN },
  { from: 1 * EOK, to: 6 * EOK, ratePct: 0.3, cap: null },
  { from: 6 * EOK, to: 9 * EOK, ratePct: 0.4, cap: null },
  { from: 9 * EOK, to: 12 * EOK, ratePct: 0.4, cap: null },
  { from: 12 * EOK, to: 15 * EOK, ratePct: 0.5, cap: null },
  { from: 15 * EOK, to: null, ratePct: 0.6, cap: null },
];

/** 오피스텔·그 외 정률 상한요율 % */
export const OFFICETEL_SMALL = { sale: 0.5, lease: 0.4 };
export const OFFICETEL_OTHER = { sale: 0.9, lease: 0.9 };
export const OTHER_RATE = 0.9;

/** 월세 환산: 보증금 + 월차임×100, 합계가 5천만원 미만이면 월차임×70 */
export const RENT_MULTIPLIER = 100;
export const RENT_MULTIPLIER_SMALL = 70;
export const RENT_SMALL_THRESHOLD = 5000 * MAN;

const base = { tool: 'brokerage-fee', sourceName: BROKERAGE_SOURCE_NAME, sourceUrl: BROKERAGE_SOURCE_URL, verifiedAt: '2026-10-19' } as const;

export const BROKERAGE_DATA: DataItem[] = [
  { ...base, id: 'brokerage.housing.sale.gyeonggi@2022-03-04', key: 'brokerage.housing.sale.gyeonggi', label: '경기도 주택 매매·교환 상한요율·한도액 (7개 구간)', status: '확인', valueText: '5천만원 미만 0.6%(한도 25만원) ~ 15억원 이상 0.7%', effectiveFrom: BROKERAGE_EFFECTIVE_FROM, note: '구간별 전체 값은 계산 결과 표에 표시됩니다.' },
  { ...base, id: 'brokerage.housing.lease.gyeonggi@2022-03-04', key: 'brokerage.housing.lease.gyeonggi', label: '경기도 주택 임대차 등 상한요율·한도액 (7개 구간)', status: '확인', valueText: '5천만원 미만 0.5%(한도 20만원) ~ 15억원 이상 0.6%', effectiveFrom: BROKERAGE_EFFECTIVE_FROM },
  { ...base, id: 'brokerage.officetel@2022-03-04', key: 'brokerage.officetel', label: '오피스텔 상한요율 (85㎡ 이하 + 전용 입식 부엌·수세식 화장실·목욕시설: 매매 0.5%·임대차 0.4% / 그 외 0.9%)', status: '확인', valueText: '0.5% / 0.4% / 0.9%', effectiveFrom: BROKERAGE_EFFECTIVE_FROM, note: '공인중개사법 시행규칙 제20조 제4항·별표2를 인용한 위 페이지 기준.' },
  { ...base, id: 'brokerage.other@2022-03-04', key: 'brokerage.other', label: '토지·상가 등 그 외 상한요율', status: '확인', valueText: '거래금액의 0.9% 이내', numeric: 0.9, effectiveFrom: BROKERAGE_EFFECTIVE_FROM },
  { ...base, id: 'brokerage.rent-conversion@2022-03-04', key: 'brokerage.rent-conversion', label: '월세 포함 거래금액 환산 (보증금 + 월차임×100, 합계 5천만원 미만이면 월차임×70)', status: '확인', valueText: '×100 / ×70', effectiveFrom: BROKERAGE_EFFECTIVE_FROM },
  { id: 'brokerage.housing.other-regions@unverified', key: 'brokerage.housing.other-regions', tool: 'brokerage-fee', label: '서울·부산 등 경기도 외 시·도 주택 중개보수 조례 요율', status: '미확인', sourceName: '각 시·도 조례 (이번 확인 범위에서 원문 미확인)', note: '지역별로 다를 수 있어 계산하지 않습니다. 해당 시·군·구 안내를 확인하세요.' },
  { id: 'brokerage.vat@unverified', key: 'brokerage.vat', tool: 'brokerage-fee', label: '중개보수 부가가치세 세율 및 간이과세 여부', status: '미확인', sourceName: '국세청 (이번 확인 범위에서 원문 미확인)', note: '위 페이지는 부가가치세가 별도라고만 안내하므로 계산 결과에 포함하지 않습니다.' },
];
