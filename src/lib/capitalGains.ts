export interface CgtInput {
  salePrice: number;
  acquisitionPrice: number;
  /** 이용자가 직접 입력한 필요경비 합계(취득세·중개보수·수선비 등), 원 */
  expenses: number;
  acquisitionDate: string;
  saleDate: string;
  /** 거주 개월 수(선택). null 이면 미입력 */
  residenceMonths: number | null;
}

export interface Period {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

export type CgtResult =
  | { ok: false; error: string }
  | {
      ok: true;
      /** 양도차익 = 양도가액 - 취득가액 - 필요경비 (음수면 양도차손) */
      gain: number;
      holding: Period;
      residenceMonths: number | null;
      /** 세액은 항상 계산하지 않음 */
      taxStatus: 'unavailable';
      reason: string;
      /** 직접 확인이 필요한 미확인 항목 */
      unverified: string[];
    };

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

function parse(d: string): Date | null {
  const m = ISO.exec(d);
  if (!m) return null;
  const dt = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return dt.getUTCFullYear() === +m[1] && dt.getUTCMonth() === +m[2] - 1 && dt.getUTCDate() === +m[3] ? dt : null;
}

/** 취득일~양도일 달력 기준 기간 (초일 산입 여부 등 법적 기산 규칙은 반영하지 않은 단순 계산) */
export function holdingPeriod(from: string, to: string): Period | null {
  const a = parse(from);
  const b = parse(to);
  if (!a || !b || b < a) return null;
  const addMonths = (base: Date, m: number): Date => {
    const y = base.getUTCFullYear();
    const mo = base.getUTCMonth() + m;
    const last = new Date(Date.UTC(y, mo + 1, 0)).getUTCDate();
    return new Date(Date.UTC(y, mo, Math.min(base.getUTCDate(), last)));
  };
  let total = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth());
  if (addMonths(a, total) > b) total -= 1;
  const days = Math.round((b.getTime() - addMonths(a, total).getTime()) / 86400000);
  const years = Math.floor(total / 12);
  const months = total % 12;
  return { years, months, days, totalDays: Math.round((b.getTime() - a.getTime()) / 86400000) };
}

export const UNVERIFIED_LABELS = [
  '양도소득세 기본세율·누진공제', '보유기간별 단기 양도 세율', '조정대상지역 다주택 중과 및 유예 여부', '장기보유특별공제율(보유·거주기간별)',
  '기본공제 금액', '1세대 1주택 비과세 요건·고가주택 계산', '지방소득세 세율', '필요경비 인정 범위',
];

export function computeCapitalGains(i: CgtInput): CgtResult {
  for (const [label, v] of [['양도가액', i.salePrice], ['취득가액', i.acquisitionPrice], ['필요경비', i.expenses]] as const) {
    if (!Number.isFinite(v) || v < 0) return { ok: false, error: `${label}은(는) 0 이상의 숫자여야 합니다.` };
    if (v > 1e13) return { ok: false, error: `${label}이(가) 너무 큽니다.` };
  }
  if (i.salePrice <= 0) return { ok: false, error: '양도가액은 0보다 커야 합니다.' };
  if (!parse(i.acquisitionDate) || !parse(i.saleDate)) return { ok: false, error: '취득일과 양도일을 올바른 날짜로 입력해 주세요.' };
  const holding = holdingPeriod(i.acquisitionDate, i.saleDate);
  if (!holding) return { ok: false, error: '양도일은 취득일과 같거나 이후여야 합니다.' };
  if (i.residenceMonths !== null) {
    if (!Number.isFinite(i.residenceMonths) || i.residenceMonths < 0) return { ok: false, error: '거주 개월 수는 0 이상이어야 합니다.' };
    const holdMonths = holding.years * 12 + holding.months;
    if (i.residenceMonths > holdMonths + 1) return { ok: false, error: '거주 개월 수가 보유 기간보다 길 수 없습니다.' };
  }
  return {
    ok: true,
    gain: i.salePrice - i.acquisitionPrice - i.expenses,
    holding,
    residenceMonths: i.residenceMonths,
    taxStatus: 'unavailable',
    reason: '양도소득세율·공제·비과세·중과 기준을 공식 원문에서 확인하지 못해 세액을 계산하지 않습니다. 아래 양도차익과 보유·거주기간은 입력값에 대한 단순 산술입니다.',
    unverified: UNVERIFIED_LABELS,
  };
}
