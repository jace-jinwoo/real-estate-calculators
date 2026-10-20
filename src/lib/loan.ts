/** 대출 상환 공식 (순수 함수). 금액 단위는 원, 금리는 연 %. */
export type RepaymentMethod = 'annuity' | 'equal-principal' | 'bullet';

export const METHOD_LABELS: Record<RepaymentMethod, string> = {
  annuity: '원리금균등',
  'equal-principal': '원금균등',
  bullet: '만기일시',
};

export interface LoanTerms {
  /** 대출 원금(잔액), 원 */
  principal: number;
  /** 연 금리 %, 스트레스 가산 전 */
  annualRatePct: number;
  /** 총(또는 남은) 만기 개월 수 */
  termMonths: number;
  method: RepaymentMethod;
  /** 거치 개월 수 (이 기간은 이자만 납부). 만기일시에서는 무시 */
  graceMonths?: number;
}

export interface MonthlyRow {
  month: number;
  interest: number;
  principal: number;
  payment: number;
  balance: number;
}

export function validateTerms(t: LoanTerms): string | null {
  if (!Number.isFinite(t.principal) || t.principal < 0) return '대출 원금은 0 이상이어야 합니다.';
  if (!Number.isFinite(t.annualRatePct) || t.annualRatePct < 0 || t.annualRatePct > 100) return '금리는 0~100% 범위로 입력해 주세요.';
  if (!Number.isInteger(t.termMonths) || t.termMonths < 1 || t.termMonths > 1200) return '만기는 1~1200개월의 정수여야 합니다.';
  const g = t.graceMonths ?? 0;
  if (!Number.isInteger(g) || g < 0) return '거치 기간은 0 이상의 정수여야 합니다.';
  if (t.method !== 'bullet' && g >= t.termMonths) return '거치 기간은 만기보다 짧아야 합니다.';
  return null;
}

/** 원리금균등 월 상환액 (금리 0이면 원금/개월). */
export function annuityPayment(principal: number, monthlyRate: number, months: number): number {
  if (months <= 0) return 0;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

/**
 * 월별 상환 스케줄. 월 이자 = 직전 잔액 × 연금리/12 (반올림하지 않음).
 * 거치 기간에는 이자만 납부하고, 이후 방식에 따라 원금을 상환합니다.
 */
export function buildSchedule(t: LoanTerms, adderPct = 0): MonthlyRow[] {
  const err = validateTerms(t);
  if (err) throw new Error(err);
  const r = (t.annualRatePct + adderPct) / 100 / 12;
  const n = t.termMonths;
  const g = t.method === 'bullet' ? 0 : t.graceMonths ?? 0;
  const rows: MonthlyRow[] = [];
  let bal = t.principal;
  const amortMonths = n - g;
  const level = t.method === 'annuity' ? annuityPayment(t.principal, r, amortMonths) : 0;
  const fixedPrincipal = t.method === 'equal-principal' ? t.principal / amortMonths : 0;
  for (let m = 1; m <= n; m++) {
    const interest = bal * r;
    let principal = 0;
    if (t.method === 'bullet') principal = m === n ? bal : 0;
    else if (m > g) principal = t.method === 'annuity' ? level - interest : fixedPrincipal;
    if (m === n) principal = bal; // 부동소수점 오차 제거: 마지막 달 잔액 전액 상환
    bal = Math.max(0, bal - principal);
    rows.push({ month: m, interest, principal, payment: interest + principal, balance: bal });
  }
  return rows;
}

/** 첫 12개월(만기가 12개월 미만이면 만기까지)의 원금+이자 합계. DSR 의 연 원리금 추정에 사용. */
export function firstYearPayment(t: LoanTerms, adderPct = 0): { total: number; interest: number; principal: number } {
  const rows = buildSchedule(t, adderPct).slice(0, 12);
  const interest = rows.reduce((s, r) => s + r.interest, 0);
  const principal = rows.reduce((s, r) => s + r.principal, 0);
  return { total: interest + principal, interest, principal };
}
