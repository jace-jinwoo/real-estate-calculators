'use client';

import { useId, useState, type FormEvent } from 'react';
import { computeLtv, type LtvResult } from '@/lib/ltv';
import { getData } from '@/data/regulations';
import { formatNumber } from '@/lib/format';
import { Field, MAN, Msg, Panel, ResultBox, Stat, SubmitButton, num, won } from './FormBits';

const PRESETS = [
  { id: 'ltv.firsttime.metro-regulated@2025-06-28', short: '생애최초 수도권·규제지역' },
  { id: 'ltv.firsttime.nonmetro@2025-06-28', short: '생애최초 지방' },
  { id: 'ltv.additional.metro-regulated@2025-06-28', short: '수도권·규제지역 추가 주택 구입' },
];

export default function LtvCalculator() {
  const uid = useId();
  const [value, setValue] = useState('');
  const [ltv, setLtv] = useState('');
  const [prior, setPrior] = useState('');
  const [cap, setCap] = useState('');
  const [desired, setDesired] = useState('');
  const [msg, setMsg] = useState<Msg | null>(null);
  const [res, setRes] = useState<Extract<LtvResult, { status: 'calculated' }> | null>(null);
  const capItem = getData('ltv.cap.metro-regulated-purchase@2025-06-28');

  function submit(e: FormEvent) {
    e.preventDefault();
    setRes(null);
    const [v, l, p, c, d] = [num(value), num(ltv), num(prior), num(cap), num(desired)];
    if ([v, l, p, c, d].includes(undefined)) return setMsg({ kind: 'error', text: '숫자 형식이 올바르지 않은 입력이 있습니다.' });
    if (v === null) return setMsg({ kind: 'error', text: '담보가치(매매가 또는 감정가)를 입력해 주세요.' });
    const out = computeLtv({
      collateralValue: (v as number) * MAN, ltvPct: l as number | null, priorClaims: ((p as number | null) ?? 0) * MAN,
      capAmount: c === null ? null : (c as number) * MAN, desiredLoan: d === null ? null : (d as number) * MAN,
    });
    if (!out.ok) return setMsg({ kind: 'error', text: out.error });
    if (out.status === 'unavailable') return setMsg({ kind: 'unavailable', text: out.reason });
    setMsg(null);
    setRes(out);
  }

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      <Panel title="1. 담보와 선순위">
        <Field id={`${uid}-v`} label="담보가치 (매매가 또는 감정가)" suffix="만원" value={value} onChange={setValue} hint="금융기관이 인정하는 기준 가액을 입력하세요." />
        <Field id={`${uid}-p`} label="선순위 채권·임차보증금 (없으면 비움)" suffix="만원" value={prior} onChange={setPrior} hint="입력한 금액 전액을 차감하는 단순 방식입니다(소액임차보증금 공제 등은 미반영)." />
      </Panel>
      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900">2. LTV 비율과 한도</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <Field id={`${uid}-l`} label="적용할 LTV 비율" suffix="%" value={ltv} onChange={setLtv} hint="일반 LTV 비율은 공식 원문 미확인이라 직접 입력해야 합니다." />
            <div className="mt-2 flex flex-wrap gap-2">
              {PRESETS.map((pr) => {
                const d = getData(pr.id);
                if (!d || d.numeric === undefined) return null;
                return <button key={pr.id} type="button" onClick={() => setLtv(String(d.numeric))} className="rounded-full border border-gray-300 px-3 py-1 text-xs hover:bg-brand-50">{pr.short} {d.numeric}%</button>;
              })}
            </div>
            <p className="mt-1 text-xs text-gray-500">금융위원회 2025-06-27 보도자료 기준(이후 개정 미확인).</p>
          </div>
          <div>
            <Field id={`${uid}-c`} label="대출 한도 상한 (선택)" suffix="만원" value={cap} onChange={setCap} />
            {capItem?.numeric !== undefined && (
              <button type="button" onClick={() => setCap(String(capItem.numeric! / MAN))} className="mt-2 rounded-full border border-gray-300 px-3 py-1 text-xs hover:bg-brand-50">수도권·규제지역 주택구입 한도 {capItem.valueText}</button>
            )}
          </div>
          <Field id={`${uid}-d`} label="희망 대출액 (선택)" suffix="만원" value={desired} onChange={setDesired} />
        </div>
      </section>
      <SubmitButton />
      <ResultBox msg={msg}>
        {res && (
          <div className="mt-3 space-y-3">
            <p className="text-3xl font-bold text-brand-900">최대 대출 가능액 {won(res.maxLoan)}</p>
            <dl className="grid gap-3 sm:grid-cols-3">
              <Stat label="담보가치 × LTV" value={won(res.byLtv)} />
              <Stat label="선순위 차감 후" value={won(res.afterPrior)} />
              <Stat label="한도 상한 적용" value={res.capApplied ? '적용됨' : '해당 없음'} />
            </dl>
            {res.desiredLtvPct !== null && (
              <p className={res.desiredWithin ? 'text-sm font-medium text-green-800' : 'text-sm font-medium text-red-700'}>
                희망 대출액 기준 LTV(선순위 포함) {formatNumber(res.desiredLtvPct, 2)}% — 위 최대 가능액 {res.desiredWithin ? '이내입니다.' : '를 초과합니다.'}
              </p>
            )}
            <p className="text-xs text-gray-600">입력한 LTV 비율·한도를 그대로 적용한 단순 계산이며, DSR·소득·지역별 규제·금융기관 심사로 실제 한도는 더 낮아질 수 있습니다. 참고용 추정입니다.</p>
          </div>
        )}
      </ResultBox>
    </form>
  );
}
