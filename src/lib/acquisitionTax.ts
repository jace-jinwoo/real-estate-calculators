import { ACQ_RATES as R } from '@/data/acquisitionTax';

export type AcqKind = 'housing-purchase' | 'purchase-farm' | 'purchase-other' | 'inherit-farm' | 'inherit-other' | 'gift' | 'original' | 'partition';
export type OwnerType = 'individual' | 'corp';

export interface AcqInput {
  kind: AcqKind;
  /** 취득가액(과세표준으로 가정), 원 */
  price: number;
  owner: OwnerType;
  /** 취득 후 보유 주택 수(이번 주택 포함). 4 는 4채 이상 */
  housesAfter: 1 | 2 | 3 | 4;
  regulated: boolean;
  /** 일시적 2주택(중과 제외 사유로 이용자가 판단) */
  temporaryTwo: boolean;
}

export type AcqResult =
  | { ok: false; error: string }
  | { ok: true; status: 'exact'; ratePct: number; tax: number; basis: string }
  | { ok: true; status: 'range'; minRatePct: number; maxRatePct: number; taxMin: number; taxMax: number; basis: string };

const taxOf = (price: number, ratePct: number) => Math.floor((price * ratePct) / 100 + 1e-6);

export function computeAcquisitionTax(i: AcqInput): AcqResult {
  if (!Number.isFinite(i.price) || i.price <= 0) return { ok: false, error: '취득가액은 0보다 커야 합니다.' };
  if (i.price > 1e13) return { ok: false, error: '취득가액이 너무 큽니다.' };
  const fixed = (ratePct: number, basis: string): AcqResult => ({ ok: true, status: 'exact', ratePct, tax: taxOf(i.price, ratePct), basis });

  switch (i.kind) {
    case 'purchase-farm': return fixed(R.nonHousingFarm, '그 밖의 유상취득 - 농지');
    case 'purchase-other': return fixed(R.nonHousing, '그 밖의 유상취득 - 농지 외');
    case 'inherit-farm': return fixed(R.inheritFarm, '상속 - 농지');
    case 'inherit-other': return fixed(R.inherit, '상속 - 농지 외');
    case 'gift': return fixed(R.gift, '무상취득(증여 등)');
    case 'original': return fixed(R.original, '원시취득');
    case 'partition': return fixed(R.partition, '공유물·합유물·총유물 분할');
    case 'housing-purchase': break;
  }

  if (i.owner === 'corp') return fixed(R.heavy4OrCorp, '법인 주택 유상취득 중과');
  const n = i.housesAfter;
  if (n >= 4) return fixed(R.heavy4OrCorp, '4주택 이상 중과');
  if (n === 3) return i.regulated ? fixed(R.heavy3Regulated, '조정대상지역 3주택 중과') : fixed(R.heavy3NonRegulated, '비조정대상지역 3주택 중과');
  if (n === 2 && i.regulated && !i.temporaryTwo) return fixed(R.heavy2Regulated, '조정대상지역 2주택 중과');

  const basisBase = n === 2 && i.temporaryTwo && i.regulated ? '일시적 2주택(중과 제외로 이용자가 선택) - 1주택 기준 세율 적용 추정' : n === 2 ? '비조정대상지역 2주택 - 1주택 기준 세율' : '1주택 기준 세율';
  if (i.price <= R.low) return fixed(R.housingLow.ratePct, `${basisBase}, 6억원 이하`);
  if (i.price > R.high) return fixed(R.housingHigh.ratePct, `${basisBase}, 9억원 초과`);
  return {
    ok: true, status: 'range', minRatePct: R.housingMidMin, maxRatePct: R.housingMidMax,
    taxMin: taxOf(i.price, R.housingMidMin), taxMax: taxOf(i.price, R.housingMidMax),
    basis: `${basisBase}, 6억원 초과 9억원 이하 (구간 내 정확한 세율 산식 미확인 → 범위 표시)`,
  };
}
