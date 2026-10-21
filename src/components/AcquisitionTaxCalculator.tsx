'use client';

import { useId, useState, type FormEvent } from 'react';
import { computeAcquisitionTax, type AcqKind, type AcqResult, type OwnerType } from '@/lib/acquisitionTax';
import { formatNumber } from '@/lib/format';
import { Field, MAN, Msg, Panel, ResultBox, SelectField, Stat, SubmitButton, num, won } from './FormBits';

export default function AcquisitionTaxCalculator() {
  const uid = useId();
  const [kind, setKind] = useState<AcqKind>('housing-purchase');
  const [owner, setOwner] = useState<OwnerType>('individual');
  const [houses, setHouses] = useState<'1' | '2' | '3' | '4'>('1');
  const [regulated, setRegulated] = useState<'no' | 'yes'>('no');
  const [temp, setTemp] = useState<'no' | 'yes'>('no');
  const [price, setPrice] = useState('');
  const [msg, setMsg] = useState<Msg | null>(null);
  const [res, setRes] = useState<Exclude<AcqResult, { ok: false }> | null>(null);
  const isHousing = kind === 'housing-purchase';

  function submit(e: FormEvent) {
    e.preventDefault();
    setRes(null);
    const p = num(price);
    if (p === undefined) return setMsg({ kind: 'error', text: '취득가액의 숫자 형식이 올바르지 않습니다.' });
    if (p === null) return setMsg({ kind: 'error', text: '취득가액을 입력해 주세요.' });
    const out = computeAcquisitionTax({ kind, price: p * MAN, owner, housesAfter: Number(houses) as 1 | 2 | 3 | 4, regulated: regulated === 'yes', temporaryTwo: temp === 'yes' });
    if (!out.ok) return setMsg({ kind: 'error', text: out.error });
    setMsg(null);
    setRes(out);
  }

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      <Panel title="1. 취득 유형">
        <SelectField id={`${uid}-kind`} label="취득 원인·대상" value={kind} onChange={setKind} options={[
          { value: 'housing-purchase', label: '주택 유상취득 (매매 등)' },
          { value: 'purchase-other', label: '주택 외 유상취득 - 농지 외 (토지·건물 등)' },
          { value: 'purchase-farm', label: '주택 외 유상취득 - 농지' },
          { value: 'inherit-other', label: '상속 - 농지 외' },
          { value: 'inherit-farm', label: '상속 - 농지' },
          { value: 'gift', label: '증여 등 무상취득' },
          { value: 'original', label: '원시취득 (신축 등)' },
          { value: 'partition', label: '공유물·합유물·총유물 분할' },
        ]} />
        <Field id={`${uid}-price`} label="취득가액 (과세표준으로 가정)" suffix="만원" value={price} onChange={setPrice} hint="실제 과세표준(취득가격 산정 기준)은 계약·신고 내용에 따라 다를 수 있습니다." />
      </Panel>
      {isHousing && (
        <Panel title="2. 주택 수·지역 (이용자가 직접 판단)">
          <SelectField id={`${uid}-owner`} label="취득자" value={owner} onChange={setOwner} options={[{ value: 'individual', label: '개인' }, { value: 'corp', label: '법인' }]} />
          <SelectField id={`${uid}-houses`} label="취득 후 보유 주택 수 (이번 주택 포함)" value={houses} onChange={setHouses} options={[{ value: '1', label: '1주택' }, { value: '2', label: '2주택' }, { value: '3', label: '3주택' }, { value: '4', label: '4주택 이상' }]} hint="주택 수 산정 기준(세대 합산, 분양권·입주권 등)은 확인하지 못해 반영하지 않습니다." />
          <SelectField id={`${uid}-reg`} label="취득 주택 소재지" value={regulated} onChange={setRegulated} options={[{ value: 'no', label: '비조정대상지역' }, { value: 'yes', label: '조정대상지역' }]} hint="지정 현황은 미확인이므로 직접 확인해 선택하세요." />
          <SelectField id={`${uid}-temp`} label="일시적 2주택에 해당 (2주택·조정대상지역일 때)" value={temp} onChange={setTemp} options={[{ value: 'no', label: '해당 없음' }, { value: 'yes', label: '해당함 (중과 제외로 선택)' }]} hint="해당 요건은 직접 확인해야 하며 이 계산기는 판정하지 않습니다." />
        </Panel>
      )}
      <SubmitButton />
      <ResultBox msg={msg}>
        {res?.status === 'exact' && (
          <div className="mt-3 space-y-3">
            <p className="text-3xl font-bold text-brand-900">취득세(본세) {won(res.tax)}</p>
            <dl className="grid gap-3 sm:grid-cols-2"><Stat label="적용 세율" value={`${formatNumber(res.ratePct, 2)}%`} /><Stat label="적용 구분" value={res.basis} /></dl>
          </div>
        )}
        {res?.status === 'range' && (
          <div className="mt-3 space-y-3">
            <p className="text-3xl font-bold text-brand-900">취득세(본세) {won(res.taxMin)} ~ {won(res.taxMax)}</p>
            <dl className="grid gap-3 sm:grid-cols-2"><Stat label="세율 범위" value={`${res.minRatePct}% ~ ${res.maxRatePct}%`} /><Stat label="적용 구분" value={res.basis} /></dl>
            <p className="text-sm text-amber-900">6억 초과 9억 이하 구간의 정확한 세율 산식은 확인하지 못해 단일 세액으로 표시하지 않습니다.</p>
          </div>
        )}
        {res && <p className="mt-3 text-xs text-gray-600">지방교육세·농어촌특별세, 감면, 중과 제외 사유는 반영하지 않은 취득세 본세의 참고용 추정입니다. 신고·납부 전 위택스·관할 지자체에서 확인하세요.</p>}
      </ResultBox>
    </form>
  );
}
