import { firstYearPayment, validateTerms, type LoanTerms } from './loan';

export interface DsrLoan extends LoanTerms {
  name: string;
  /** 이용자가 선택한 스트레스 가산금리 적용 여부 */
  applyStress: boolean;
}

/** 기존 대출: 상환 구조로 계산하거나, 은행 안내 등 연 원리금을 직접 입력 */
export type ExistingLoan =
  | ({ mode: 'schedule' } & DsrLoan)
  | { mode: 'direct'; name: string; annualPayment: number };

export interface DsrInput {
  /** 연 소득(원) */
  annualIncome: number;
  existing: ExistingLoan[];
  newLoan: DsrLoan | null;
  /** 스트레스 가산금리 %p (applyStress 가 true 인 대출에 적용) */
  stressAddPct: number;
  /** 이용자가 직접 입력한 비교 기준 비율 %. 없으면 비교하지 않음 */
  limitPct: number | null;
}

export interface LoanLine {
  name: string;
  kind: 'existing' | 'new';
  annualPayment: number;
  annualInterest: number | null;
  annualPrincipal: number | null;
  stressApplied: boolean;
}

export type DsrResult =
  | { ok: false; error: string }
  | {
      ok: true;
      lines: LoanLine[];
      existingAnnual: number;
      newAnnual: number;
      totalAnnual: number;
      ratioPct: number;
      limitPct: number | null;
      /** 기준 비율이 있을 때만 판정 */
      withinLimit: boolean | null;
      /** 기준 비율이 있고 신규 대출 조건(금리·만기·방식)이 주어졌을 때, 기준 이내로 가능한 신규 대출 최대 원금(원) */
      maxNewPrincipal: number | null;
    };

export function computeDsr(input: DsrInput): DsrResult {
  if (!Number.isFinite(input.annualIncome) || input.annualIncome <= 0) return { ok: false, error: '연 소득은 0보다 커야 합니다.' };
  if (!Number.isFinite(input.stressAddPct) || input.stressAddPct < 0 || input.stressAddPct > 20) return { ok: false, error: '스트레스 가산금리는 0~20%p 범위로 입력해 주세요.' };
  if (input.limitPct !== null && (!Number.isFinite(input.limitPct) || input.limitPct <= 0 || input.limitPct > 1000)) return { ok: false, error: '비교 기준 비율은 0보다 크고 1000 이하여야 합니다.' };

  const lines: LoanLine[] = [];
  for (const [i, l] of input.existing.entries()) {
    const label = l.name || `기존 대출 ${i + 1}`;
    if (l.mode === 'direct') {
      if (!Number.isFinite(l.annualPayment) || l.annualPayment < 0) return { ok: false, error: `${label}: 연 원리금은 0 이상이어야 합니다.` };
      lines.push({ name: label, kind: 'existing', annualPayment: l.annualPayment, annualInterest: null, annualPrincipal: null, stressApplied: false });
      continue;
    }
    const err = validateTerms(l);
    if (err) return { ok: false, error: `${label}: ${err}` };
    const p = firstYearPayment(l, l.applyStress ? input.stressAddPct : 0);
    lines.push({ name: label, kind: 'existing', annualPayment: p.total, annualInterest: p.interest, annualPrincipal: p.principal, stressApplied: l.applyStress && input.stressAddPct > 0 });
  }

  let newAnnual = 0;
  let maxNewPrincipal: number | null = null;
  if (input.newLoan) {
    const l = input.newLoan;
    const label = l.name || '신규 대출';
    const err = validateTerms(l);
    if (err) return { ok: false, error: `${label}: ${err}` };
    const adder = l.applyStress ? input.stressAddPct : 0;
    const p = firstYearPayment(l, adder);
    newAnnual = p.total;
    lines.push({ name: label, kind: 'new', annualPayment: p.total, annualInterest: p.interest, annualPrincipal: p.principal, stressApplied: l.applyStress && input.stressAddPct > 0 });
    if (input.limitPct !== null) {
      const existingSum = lines.filter((x) => x.kind === 'existing').reduce((s, x) => s + x.annualPayment, 0);
      const room = (input.annualIncome * input.limitPct) / 100 - existingSum;
      // 첫 12개월 합계는 원금에 비례하므로 단위 원금(1원)의 연 원리금으로 역산합니다.
      const unit = firstYearPayment({ ...l, principal: 1 }, adder).total;
      maxNewPrincipal = room <= 0 || unit <= 0 ? 0 : room / unit;
    }
  }

  const existingAnnual = lines.filter((x) => x.kind === 'existing').reduce((s, x) => s + x.annualPayment, 0);
  const totalAnnual = existingAnnual + newAnnual;
  const ratioPct = (totalAnnual / input.annualIncome) * 100;
  return {
    ok: true,
    lines,
    existingAnnual,
    newAnnual,
    totalAnnual,
    ratioPct,
    limitPct: input.limitPct,
    withinLimit: input.limitPct === null ? null : ratioPct <= input.limitPct,
    maxNewPrincipal,
  };
}
