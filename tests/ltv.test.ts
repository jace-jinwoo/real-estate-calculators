import { describe, expect, it } from 'vitest';
import { computeLtv, type LtvInput } from '@/lib/ltv';
import { getData } from '@/data/regulations';

const base: LtvInput = { collateralValue: 800000000, ltvPct: 70, priorClaims: 0, capAmount: null, desiredLoan: null };
const calc = (o: Partial<LtvInput>) => computeLtv({ ...base, ...o });

describe('LTV', () => {
  it('담보가치 8억 × 70% = 5.6억', () => {
    expect(calc({})).toMatchObject({ ok: true, status: 'calculated', byLtv: 560000000, maxLoan: 560000000, capApplied: false });
  });
  it('선순위 차감 및 0 하한', () => {
    expect(calc({ priorClaims: 100000000 })).toMatchObject({ afterPrior: 460000000, maxLoan: 460000000 });
    expect(calc({ priorClaims: 900000000 })).toMatchObject({ afterPrior: 0, maxLoan: 0 });
  });
  it('한도 상한 6억 적용', () => {
    expect(calc({ ltvPct: 80, capAmount: 600000000 })).toMatchObject({ byLtv: 640000000, maxLoan: 600000000, capApplied: true });
  });
  it('희망 대출액 판정과 LTV 계산', () => {
    const r = calc({ priorClaims: 80000000, desiredLoan: 480000000 });
    expect(r).toMatchObject({ status: 'calculated', desiredWithin: true });
    expect((r as { desiredLtvPct: number }).desiredLtvPct).toBeCloseTo(70, 6);
    expect(calc({ desiredLoan: 600000000 })).toMatchObject({ desiredWithin: false });
  });
  it('LTV 비율 미입력은 계산 불가, 범위 밖은 오류', () => {
    expect(calc({ ltvPct: null })).toMatchObject({ ok: true, status: 'unavailable' });
    expect(calc({ ltvPct: 120 })).toMatchObject({ ok: false });
    expect(calc({ collateralValue: 0 })).toMatchObject({ ok: false });
  });
  it('확인된 데이터와 미확인 데이터 구분', () => {
    expect(getData('ltv.firsttime.metro-regulated@2025-06-28')).toMatchObject({ status: '확인', numeric: 70 });
    expect(getData('ltv.general@unverified')).toMatchObject({ status: '미확인' });
    expect(getData('ltv.general@unverified')?.numeric).toBeUndefined();
  });
});
