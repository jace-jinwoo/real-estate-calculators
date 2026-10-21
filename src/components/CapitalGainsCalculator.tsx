'use client';

import { useId, useState, type FormEvent } from 'react';
import { computeCapitalGains, type CgtResult } from '@/lib/capitalGains';
import { Field, MAN, Msg, Panel, ResultBox, SelectField, Stat, SubmitButton, num, won } from './FormBits';

export default function CapitalGainsCalculator() {
  const uid = useId();
  const [sale, setSale] = useState('');
  const [acq, setAcq] = useState('');
  const [exp, setExp] = useState('');
  const [acqDate, setAcqDate] = useState('');
  const [saleDate, setSaleDate] = useState('');
  const [resMonths, setResMonths] = useState('');
  const [type, setType] = useState('housing');
  const [count, setCount] = useState('1');
  const [regulated, setRegulated] = useState('no');
  const [msg, setMsg] = useState<Msg | null>(null);
  const [res, setRes] = useState<Extract<CgtResult, { ok: true }> | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    setRes(null);
    const [s, a, x, r] = [num(sale), num(acq), num(exp), num(resMonths)];
    if ([s, a, x, r].includes(undefined)) return setMsg({ kind: 'error', text: '숫자 형식이 올바르지 않은 입력이 있습니다.' });
    if (s === null || a === null) return setMsg({ kind: 'error', text: '양도가액과 취득가액을 입력해 주세요.' });
    const out = computeCapitalGains({
      salePrice: (s as number) * MAN, acquisitionPrice: (a as number) * MAN, expenses: ((x as number | null) ?? 0) * MAN,
      acquisitionDate: acqDate, saleDate, residenceMonths: r as number | null,
    });
    if (!out.ok) return setMsg({ kind: 'error', text: out.error });
    setMsg({ kind: 'unavailable', text: out.reason });
    setRes(out);
  }

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      <p role="note" className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
        이 계산기는 양도소득세 <strong>세액을 계산하지 않습니다</strong>. 세율·공제·비과세·중과 기준을 공식 원문에서 확인하지 못해 &quot;미확인&quot;이며, 양도차익·보유기간 등 입력 구조와 안내만 제공합니다.
      </p>
      <Panel title="1. 금액">
        <Field id={`${uid}-sale`} label="양도가액" suffix="만원" value={sale} onChange={setSale} />
        <Field id={`${uid}-acq`} label="취득가액" suffix="만원" value={acq} onChange={setAcq} />
        <Field id={`${uid}-exp`} label="필요경비 (취득세·중개보수·수선비 등 직접 합산, 없으면 비움)" suffix="만원" value={exp} onChange={setExp} hint="인정 범위는 확인하지 못해 입력한 금액을 그대로 차감합니다." />
      </Panel>
      <Panel title="2. 기간">
        <Field id={`${uid}-ad`} label="취득일" type="date" value={acqDate} onChange={setAcqDate} />
        <Field id={`${uid}-sd`} label="양도일" type="date" value={saleDate} onChange={setSaleDate} />
        <Field id={`${uid}-rm`} label="거주 기간 (선택)" suffix="개월" value={resMonths} onChange={setResMonths} hint="거주 요건 판정은 하지 않고 입력값만 표시합니다." />
      </Panel>
      <Panel title="3. 주택 정보 (참고 입력, 계산에는 사용하지 않음)">
        <SelectField id={`${uid}-type`} label="자산 유형" value={type} onChange={setType} options={[{ value: 'housing', label: '주택' }, { value: 'right', label: '분양권·입주권' }, { value: 'land', label: '토지·기타' }]} />
        <SelectField id={`${uid}-cnt`} label="양도 시점 보유 주택 수" value={count} onChange={setCount} options={[{ value: '1', label: '1주택' }, { value: '2', label: '2주택' }, { value: '3', label: '3주택 이상' }]} />
        <SelectField id={`${uid}-reg`} label="조정대상지역 여부" value={regulated} onChange={setRegulated} options={[{ value: 'no', label: '비조정대상지역' }, { value: 'yes', label: '조정대상지역' }]} />
      </Panel>
      <SubmitButton label="입력값 정리하기" />
      <ResultBox title="정리 결과 (세액 계산 아님)" msg={msg}>
        {res && (
          <div className="mt-3 space-y-3">
            <p className="text-2xl font-bold text-brand-900">양도차익(단순 산술) {won(res.gain)}{res.gain < 0 ? ' (양도차손)' : ''}</p>
            <dl className="grid gap-3 sm:grid-cols-3">
              <Stat label="보유 기간" value={`${res.holding.years}년 ${res.holding.months}개월 ${res.holding.days}일 (${res.holding.totalDays.toLocaleString('ko-KR')}일)`} />
              <Stat label="거주 기간(입력)" value={res.residenceMonths === null ? '미입력' : `${res.residenceMonths}개월`} />
              <Stat label="양도소득세액" value="계산 불가 (미확인)" />
            </dl>
            <div>
              <p className="text-sm font-medium text-gray-800">직접 확인이 필요한 미확인 항목</p>
              <ul className="mt-1 list-disc pl-5 text-sm text-gray-700">{res.unverified.map((u) => <li key={u}>{u}</li>)}</ul>
            </div>
            <p className="text-xs text-gray-600">양도차익 = 양도가액 - 취득가액 - 입력한 필요경비. 보유기간은 달력 기준 단순 계산이며 법적 기산 규칙은 반영하지 않았습니다. 정확한 세액은 홈택스 또는 세무전문가에게 확인하세요.</p>
          </div>
        )}
      </ResultBox>
    </form>
  );
}
