import {
  BROKERAGE_EFFECTIVE_FROM, HOUSING_LEASE, HOUSING_SALE, OFFICETEL_OTHER, OFFICETEL_SMALL, OTHER_RATE,
  RENT_MULTIPLIER, RENT_MULTIPLIER_SMALL, RENT_SMALL_THRESHOLD, type BrokerageBand,
} from '@/data/brokerage';

export type PropertyKind = 'housing' | 'officetel-small' | 'officetel-other' | 'other';
export type DealType = 'sale' | 'lease';
export type Region = 'gyeonggi' | 'other';

export interface BrokerageInput {
  kind: PropertyKind;
  deal: DealType;
  region: Region;
  /** 매매가 또는 임대차 보증금, 원 */
  amount: number;
  /** 월차임, 원 (임대차만) */
  monthlyRent: number;
  /** 계약(거래) 기준일 YYYY-MM-DD */
  date: string;
}

export type BrokerageResult =
  | { ok: false; error: string }
  | { ok: true; status: 'unavailable'; reason: string }
  | {
      ok: true;
      status: 'calculated';
      /** 상한요율 적용 대상 거래금액(월세 환산 포함), 원 */
      base: number;
      ratePct: number;
      cap: number | null;
      /** 요율 적용 금액(한도 적용 전), 원 */
      rawFee: number;
      /** 상한 중개보수(한도 적용 후), 원 */
      fee: number;
      capApplied: boolean;
      notes: string[];
    };

export function converted(deal: DealType, amount: number, monthlyRent: number): { base: number; note: string | null } {
  if (deal === 'sale' || monthlyRent <= 0) return { base: amount, note: null };
  const first = amount + monthlyRent * RENT_MULTIPLIER;
  if (first < RENT_SMALL_THRESHOLD) {
    return { base: amount + monthlyRent * RENT_MULTIPLIER_SMALL, note: `월세가 있어 보증금 + 월차임×${RENT_MULTIPLIER_SMALL}으로 환산했습니다 (×${RENT_MULTIPLIER} 합계가 5천만원 미만).` };
  }
  return { base: first, note: `월세가 있어 보증금 + 월차임×${RENT_MULTIPLIER}으로 환산했습니다.` };
}

export function findBand(bands: BrokerageBand[], base: number): BrokerageBand {
  return bands.find((b) => base >= b.from && (b.to === null || base < b.to)) as BrokerageBand;
}

export function computeBrokerage(i: BrokerageInput): BrokerageResult {
  if (!Number.isFinite(i.amount) || i.amount <= 0) return { ok: false, error: '거래금액(매매가 또는 보증금)은 0보다 커야 합니다.' };
  if (i.amount > 1e13) return { ok: false, error: '거래금액이 너무 큽니다.' };
  if (!Number.isFinite(i.monthlyRent) || i.monthlyRent < 0) return { ok: false, error: '월차임은 0 이상이어야 합니다.' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(i.date)) return { ok: false, error: '거래 기준일을 선택해 주세요.' };
  if (i.date < BROKERAGE_EFFECTIVE_FROM) {
    return { ok: true, status: 'unavailable', reason: `확인된 요율은 ${BROKERAGE_EFFECTIVE_FROM} 시행 기준입니다. 그 이전 거래의 요율은 확인하지 못해 계산하지 않습니다.` };
  }
  const { base, note } = converted(i.deal, i.amount, i.monthlyRent);
  const notes: string[] = note ? [note] : [];

  let ratePct: number;
  let cap: number | null = null;
  if (i.kind === 'housing') {
    if (i.region !== 'gyeonggi') {
      return { ok: true, status: 'unavailable', reason: '주택 중개보수 상한은 시·도 조례로 정해지는데, 경기도 외 지역 조례는 확인하지 못해 계산하지 않습니다(미확인). 해당 시·군·구 안내를 확인하세요.' };
    }
    const band = findBand(i.deal === 'sale' ? HOUSING_SALE : HOUSING_LEASE, base);
    ratePct = band.ratePct;
    cap = band.cap;
    notes.push('경기도 주택 중개보수 등에 관한 조례 별표1 (2022-03-04 시행) 기준입니다.');
  } else if (i.kind === 'officetel-small') {
    ratePct = OFFICETEL_SMALL[i.deal];
  } else if (i.kind === 'officetel-other') {
    ratePct = OFFICETEL_OTHER[i.deal];
  } else {
    ratePct = OTHER_RATE;
  }
  if (i.kind !== 'housing') notes.push('공인중개사법 시행규칙 제20조 기준 상한요율이며, 실제 보수는 상한 이내에서 협의합니다.');

  const rawFee = Math.floor((base * ratePct) / 100 + 1e-6);
  const capApplied = cap !== null && rawFee > cap;
  const fee = capApplied && cap !== null ? cap : rawFee;
  notes.push('부가가치세는 별도이며 결과에 포함하지 않았습니다(세율 미확인).');
  return { ok: true, status: 'calculated', base, ratePct, cap, rawFee, fee, capApplied, notes };
}
