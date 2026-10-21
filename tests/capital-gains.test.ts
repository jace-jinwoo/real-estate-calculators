import { describe, expect, it } from 'vitest';
import { computeCapitalGains, holdingPeriod, type CgtInput } from '@/lib/capitalGains';
import { dataFor } from '@/data/regulations';

const base: CgtInput = { salePrice: 1000000000, acquisitionPrice: 600000000, expenses: 30000000, acquisitionDate: '2020-03-01', saleDate: '2026-10-01', residenceMonths: null };
const calc = (o: Partial<CgtInput>) => computeCapitalGains({ ...base, ...o });

describe('양도소득세 (세액 미계산)', () => {
  it('양도차익과 보유기간', () => {
    expect(calc({})).toMatchObject({ ok: true, gain: 370000000, taxStatus: 'unavailable', holding: { years: 6, months: 7, days: 0 } });
  });
  it('양도차손은 음수', () => {
    expect(calc({ salePrice: 500000000 })).toMatchObject({ gain: -130000000 });
  });
  it('기간 계산: 일 부족 시 월 차감, 윤년·말일', () => {
    expect(holdingPeriod('2024-01-31', '2024-03-01')).toMatchObject({ years: 0, months: 1, days: 1, totalDays: 30 });
    expect(holdingPeriod('2020-03-15', '2022-03-14')).toMatchObject({ years: 1, months: 11, days: 27 });
    expect(holdingPeriod('2026-01-01', '2025-01-01')).toBeNull();
    expect(holdingPeriod('2025-02-30', '2026-01-01')).toBeNull();
  });
  it('검증 오류', () => {
    expect(calc({ salePrice: 0 })).toMatchObject({ ok: false });
    expect(calc({ acquisitionDate: '' })).toMatchObject({ ok: false });
    expect(calc({ saleDate: '2019-01-01' })).toMatchObject({ ok: false });
    expect(calc({ residenceMonths: 999 })).toMatchObject({ ok: false });
    expect(calc({ expenses: -1 })).toMatchObject({ ok: false });
  });
  it('세율·공제 데이터는 모두 미확인이며 값이 없다', () => {
    const items = dataFor('capital-gains-tax');
    expect(items.length).toBeGreaterThan(0);
    for (const d of items) {
      expect(d.status).toBe('미확인');
      expect(d.numeric).toBeUndefined();
      expect(d.valueText).toBeUndefined();
    }
  });
});
