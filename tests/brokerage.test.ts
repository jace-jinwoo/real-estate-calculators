import { describe, expect, it } from 'vitest';
import { computeBrokerage, converted, type BrokerageInput } from '@/lib/brokerage';

const base: BrokerageInput = { kind: 'housing', deal: 'sale', region: 'gyeonggi', amount: 300000000, monthlyRent: 0, date: '2026-10-19' };
const calc = (o: Partial<BrokerageInput>) => computeBrokerage({ ...base, ...o });

describe('중개보수', () => {
  it('경기도 매매 3억원: 0.4% = 120만원', () => {
    const r = calc({});
    expect(r).toMatchObject({ ok: true, status: 'calculated', ratePct: 0.4, cap: null, fee: 1200000 });
  });
  it('5천만원 미만 매매는 한도 25만원 적용 (4천9백만원 0.6% = 29.4만원 → 25만원)', () => {
    const r = calc({ amount: 49000000 });
    expect(r).toMatchObject({ status: 'calculated', fee: 250000, capApplied: true });
  });
  it('1억원 매매 0.5% = 50만원 (한도 80만원 미만)', () => {
    expect(calc({ amount: 100000000 })).toMatchObject({ fee: 500000, capApplied: false });
  });
  it('구간 경계: 6억원은 6~9억 구간 0.4%, 9억원은 0.5%', () => {
    expect(calc({ amount: 600000000 })).toMatchObject({ ratePct: 0.4, fee: 2400000 });
    expect(calc({ amount: 900000000 })).toMatchObject({ ratePct: 0.5, fee: 4500000 });
  });
  it('임대차 보증금 5천만원~1억원 0.4%, 한도 30만원', () => {
    expect(calc({ deal: 'lease', amount: 90000000 })).toMatchObject({ ratePct: 0.4, cap: 300000, fee: 300000, capApplied: true });
  });
  it('월세 환산: 합계 5천만원 이상이면 ×100, 미만이면 ×70', () => {
    expect(converted('lease', 10000000, 500000).base).toBe(60000000);
    expect(converted('lease', 10000000, 300000).base).toBe(31000000);
    expect(converted('sale', 10000000, 500000).base).toBe(10000000);
  });
  it('경기도 외 주택은 계산 불가(미확인)', () => {
    expect(calc({ region: 'other' })).toMatchObject({ ok: true, status: 'unavailable' });
  });
  it('시행일 이전 날짜는 계산 불가', () => {
    expect(calc({ date: '2020-01-01' })).toMatchObject({ status: 'unavailable' });
  });
  it('오피스텔·상가 정률', () => {
    expect(calc({ kind: 'officetel-small', amount: 200000000 })).toMatchObject({ ratePct: 0.5, fee: 1000000 });
    expect(calc({ kind: 'officetel-other', deal: 'lease', amount: 200000000 })).toMatchObject({ ratePct: 0.9 });
    expect(calc({ kind: 'other', amount: 100000000 })).toMatchObject({ ratePct: 0.9, fee: 900000 });
  });
  it('잘못된 입력', () => {
    expect(calc({ amount: 0 })).toMatchObject({ ok: false });
    expect(calc({ date: '' })).toMatchObject({ ok: false });
    expect(calc({ monthlyRent: -1 })).toMatchObject({ ok: false });
  });
});
