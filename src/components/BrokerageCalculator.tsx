'use client';

import { useId, useState, type FormEvent } from 'react';
import { computeBrokerage, type BrokerageResult, type DealType, type PropertyKind, type Region } from '@/lib/brokerage';
import { Field, MAN, Msg, Panel, ResultBox, SelectField, Stat, SubmitButton, num, won } from './FormBits';

export default function BrokerageCalculator() {
  const uid = useId();
  const [kind, setKind] = useState<PropertyKind>('housing');
  const [deal, setDeal] = useState<DealType>('sale');
  const [region, setRegion] = useState<Region>('gyeonggi');
  const [amount, setAmount] = useState('');
  const [rent, setRent] = useState('');
  const [date, setDate] = useState('');
  const [msg, setMsg] = useState<Msg | null>(null);
  const [res, setRes] = useState<Extract<BrokerageResult, { status: 'calculated' }> | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    setRes(null);
    const a = num(amount);
    const r = num(rent);
    if (a === undefined || r === undefined) return setMsg({ kind: 'error', text: '숫자 형식이 올바르지 않은 입력이 있습니다.' });
    if (a === null) return setMsg({ kind: 'error', text: '거래금액(매매가 또는 보증금)을 입력해 주세요.' });
    const out = computeBrokerage({ kind, deal, region, amount: a * MAN, monthlyRent: (r ?? 0) * MAN, date });
    if (!out.ok) return setMsg({ kind: 'error', text: out.error });
    if (out.status === 'unavailable') return setMsg({ kind: 'unavailable', text: out.reason });
    setMsg(null);
    setRes(out);
  }

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      <Panel title="1. 거래 조건">
        <SelectField id={`${uid}-kind`} label="대상" value={kind} onChange={setKind} options={[
          { value: 'housing', label: '주택 (부속토지 포함)' },
          { value: 'officetel-small', label: '오피스텔 (85㎡ 이하, 전용 입식 부엌·수세식 화장실·목욕시설)' },
          { value: 'officetel-other', label: '오피스텔 (위 조건 외)' },
          { value: 'other', label: '토지·상가 등 그 외' },
        ]} />
        <SelectField id={`${uid}-deal`} label="거래유형" value={deal} onChange={setDeal} options={[{ value: 'sale', label: '매매·교환' }, { value: 'lease', label: '임대차 등 (전세·월세)' }]} />
        {kind === 'housing' && (
          <SelectField id={`${uid}-region`} label="지역 (주택은 시·도 조례 기준)" value={region} onChange={setRegion} options={[{ value: 'gyeonggi', label: '경기도' }, { value: 'other', label: '그 외 지역 (요율 미확인)' }]} hint="확인된 조례는 경기도뿐입니다. 그 외 지역은 계산 불가로 표시합니다." />
        )}
        <Field id={`${uid}-date`} label="거래(계약) 기준일" type="date" value={date} onChange={setDate} />
      </Panel>
      <Panel title="2. 금액">
        <Field id={`${uid}-amount`} label={deal === 'sale' ? '매매가' : '보증금'} suffix="만원" value={amount} onChange={setAmount} />
        {deal === 'lease' && <Field id={`${uid}-rent`} label="월차임 (월세, 없으면 비움)" suffix="만원" value={rent} onChange={setRent} hint="월세가 있으면 보증금 + 월차임×100(합계 5천만원 미만이면 ×70)으로 환산합니다." />}
      </Panel>
      <SubmitButton />
      <ResultBox msg={msg}>
        {res && (
          <div className="mt-3 space-y-3">
            <p className="text-3xl font-bold text-brand-900">상한 중개보수 {won(res.fee)}</p>
            <dl className="grid gap-3 sm:grid-cols-3">
              <Stat label="요율 적용 거래금액" value={won(res.base)} />
              <Stat label="상한요율" value={`${res.ratePct}%`} />
              <Stat label="한도액" value={res.cap === null ? '없음' : won(res.cap)} />
            </dl>
            {res.capApplied && <p className="text-sm text-gray-800">요율 계산액 {won(res.rawFee)}이 한도액을 넘어 한도액이 적용되었습니다.</p>}
            <ul className="list-disc space-y-1 pl-5 text-xs text-gray-600">{res.notes.map((n) => <li key={n}>{n}</li>)}</ul>
            <p className="text-xs text-gray-600">법이 정한 &quot;상한&quot;이며 실제 중개보수는 상한 이내에서 협의합니다. 참고용 추정입니다.</p>
          </div>
        )}
      </ResultBox>
    </form>
  );
}
