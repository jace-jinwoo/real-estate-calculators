import { describe, expect, it } from 'vitest';
import { computeAcquisitionTax, type AcqInput } from '@/lib/acquisitionTax';
import { getData } from '@/data/regulations';

const base: AcqInput = { kind: 'housing-purchase', price: 500000000, owner: 'individual', housesAfter: 1, regulated: false, temporaryTwo: false };
const calc = (o: Partial<AcqInput>) => computeAcquisitionTax({ ...base, ...o });

describe('취득세', () => {
  it('1주택 5억 = 1% 500만원, 경계 6억도 1%', () => {
    expect(calc({})).toMatchObject({ status: 'exact', ratePct: 1, tax: 5000000 });
    expect(calc({ price: 600000000 })).toMatchObject({ status: 'exact', ratePct: 1 });
  });
  it('9억 초과 3%, 9억 정확히는 범위', () => {
    expect(calc({ price: 1000000000 })).toMatchObject({ status: 'exact', ratePct: 3, tax: 30000000 });
    expect(calc({ price: 900000000 })).toMatchObject({ status: 'range' });
  });
  it('6~9억은 범위만 (7억: 1.01%~2.99%)', () => {
    expect(calc({ price: 700000000 })).toMatchObject({ status: 'range', taxMin: 7070000, taxMax: 20930000 });
  });
  it('중과 표', () => {
    expect(calc({ housesAfter: 2, regulated: true })).toMatchObject({ ratePct: 8 });
    expect(calc({ housesAfter: 2, regulated: false })).toMatchObject({ status: 'exact', ratePct: 1 });
    expect(calc({ housesAfter: 2, regulated: true, temporaryTwo: true })).toMatchObject({ ratePct: 1 });
    expect(calc({ housesAfter: 3, regulated: true })).toMatchObject({ ratePct: 12 });
    expect(calc({ housesAfter: 3, regulated: false })).toMatchObject({ ratePct: 8 });
    expect(calc({ housesAfter: 4 })).toMatchObject({ ratePct: 12 });
    expect(calc({ owner: 'corp' })).toMatchObject({ ratePct: 12 });
  });
  it('주택 외 고정 세율', () => {
    expect(calc({ kind: 'purchase-other' })).toMatchObject({ ratePct: 4 });
    expect(calc({ kind: 'purchase-farm' })).toMatchObject({ ratePct: 3 });
    expect(calc({ kind: 'inherit-farm' })).toMatchObject({ ratePct: 2.3 });
    expect(calc({ kind: 'inherit-other' })).toMatchObject({ ratePct: 2.8 });
    expect(calc({ kind: 'gift' })).toMatchObject({ ratePct: 3.5 });
    expect(calc({ kind: 'original' })).toMatchObject({ ratePct: 2.8 });
    expect(calc({ kind: 'partition' })).toMatchObject({ ratePct: 2.3 });
  });
  it('입력 검증과 미확인 데이터', () => {
    expect(calc({ price: 0 })).toMatchObject({ ok: false });
    expect(getData('acq.surtax@unverified')?.status).toBe('미확인');
    expect(getData('acq.mid-formula@unverified')?.numeric).toBeUndefined();
  });
});
