'use client';

import { useId, useMemo, useState } from 'react';
import { computeDsr, type DsrLoan, type ExistingLoan } from '@/lib/dsr';
import { formatNumber, parseNumberInput } from '@/lib/format';
import { METHOD_LABELS, type RepaymentMethod } from '@/lib/loan';
import { getData } from '@/data/regulations';

interface LoanForm {
  key: number;
  name: string;
  mode: 'schedule' | 'direct';
  principal: string; // 만원
  rate: string;
  months: string;
  grace: string;
  method: RepaymentMethod;
  annualPayment: string; // 만원
  stress: boolean;
}

const MAN = 10000;
const won = (v: number) => `${Math.round(v).toLocaleString('ko-KR')}원`;
const manText = (v: number) => `${formatNumber(v / MAN, 1)}만원`;

function blankLoan(key: number, mode: 'schedule' | 'direct' = 'schedule'): LoanForm {
  return { key, name: '', mode, principal: '', rate: '', months: '', grace: '0', method: 'annuity', annualPayment: '', stress: false };
}

function num(raw: string): number | null | undefined {
  const r = parseNumberInput(raw);
  if (!r.ok) return undefined; // 형식 오류
  return r.value; // null = 빈 입력
}

function Field({ id, label, value, onChange, suffix, hint, inputMode = 'decimal' }: {
  id: string; label: string; value: string; onChange: (v: string) => void; suffix?: string; hint?: string; inputMode?: 'decimal' | 'numeric';
}) {
  const bad = value.trim() !== '' && num(value) === undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="text"
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={bad}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200 aria-[invalid=true]:border-red-500"
        />
        {suffix && <span className="shrink-0 text-sm text-gray-600">{suffix}</span>}
      </div>
      {hint && <p id={`${id}-hint`} className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

function LoanFields({ uid, f, set, allowDirect, title }: { uid: string; f: LoanForm; set: (p: Partial<LoanForm>) => void; allowDirect: boolean; title: string }) {
  const p = `${uid}-${f.key}`;
  return (
    <div className="space-y-3">
      {allowDirect && (
        <fieldset>
          <legend className="text-sm font-medium text-gray-700">입력 방식</legend>
          <div className="mt-1 flex gap-4 text-sm">
            <label className="flex items-center gap-1"><input type="radio" name={`${p}-mode`} checked={f.mode === 'schedule'} onChange={() => set({ mode: 'schedule' })} /> 상환 구조로 계산</label>
            <label className="flex items-center gap-1"><input type="radio" name={`${p}-mode`} checked={f.mode === 'direct'} onChange={() => set({ mode: 'direct' })} /> 연 원리금 직접 입력</label>
          </div>
        </fieldset>
      )}
      <div>
        <label htmlFor={`${p}-name`} className="mb-1 block text-sm font-medium text-gray-700">{title} 이름 (선택)</label>
        <input id={`${p}-name`} type="text" maxLength={30} value={f.name} onChange={(e) => set({ name: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200" />
      </div>
      {f.mode === 'direct' ? (
        <Field id={`${p}-ap`} label="연 원리금 상환액" suffix="만원" value={f.annualPayment} onChange={(v) => set({ annualPayment: v })} hint="은행 안내 등으로 알고 있는 1년간 원금+이자 합계" />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field id={`${p}-pr`} label={allowDirect ? '대출 잔액' : '대출 금액'} suffix="만원" value={f.principal} onChange={(v) => set({ principal: v })} />
            <Field id={`${p}-rt`} label="연 금리" suffix="%" value={f.rate} onChange={(v) => set({ rate: v })} />
            <Field id={`${p}-mo`} label={allowDirect ? '남은 만기' : '만기'} suffix="개월" inputMode="numeric" value={f.months} onChange={(v) => set({ months: v })} hint="30년 = 360개월" />
            <div>
              <label htmlFor={`${p}-me`} className="mb-1 block text-sm font-medium text-gray-700">상환방식</label>
              <select id={`${p}-me`} value={f.method} onChange={(e) => set({ method: e.target.value as RepaymentMethod })} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200">
                {(Object.keys(METHOD_LABELS) as RepaymentMethod[]).map((m) => <option key={m} value={m}>{METHOD_LABELS[m]}</option>)}
              </select>
            </div>
          </div>
          {f.method !== 'bullet' && (
            <Field id={`${p}-gr`} label="거치 기간 (이자만 납부)" suffix="개월" inputMode="numeric" value={f.grace} onChange={(v) => set({ grace: v })} hint="없으면 0" />
          )}
        </>
      )}
      {f.mode === 'schedule' && (
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={f.stress} onChange={(e) => set({ stress: e.target.checked })} />
          스트레스 가산금리 적용 (아래 설정값을 이 대출에 더함)
        </label>
      )}
    </div>
  );
}

export default function DsrCalculator() {
  const uid = useId();
  const [income, setIncome] = useState('');
  const [existing, setExisting] = useState<LoanForm[]>([]);
  const [nextKey, setNextKey] = useState(2);
  const [withNew, setWithNew] = useState(true);
  const [newLoan, setNewLoan] = useState<LoanForm>({ ...blankLoan(1), stress: false });
  const [stressAdd, setStressAdd] = useState('0');
  const [limit, setLimit] = useState('');

  const stressDefault = getData('dsr.stress.stage3.default@2025-07-01');
  const stressNonMetro = getData('dsr.stress.stage3.nonmetro-mortgage@2025-07-01');

  const outcome = useMemo(() => {
    const inc = num(income);
    if (inc === undefined) return { kind: 'msg' as const, text: '연 소득은 숫자로 입력해 주세요.' };
    if (inc === null) return { kind: 'idle' as const };
    const stress = num(stressAdd);
    if (stress === undefined) return { kind: 'msg' as const, text: '스트레스 가산금리는 숫자로 입력해 주세요.' };
    const lim = num(limit);
    if (lim === undefined) return { kind: 'msg' as const, text: '비교 기준 비율은 숫자로 입력해 주세요.' };

    const toLoan = (f: LoanForm, label: string): DsrLoan | string => {
      const pr = num(f.principal), rt = num(f.rate), mo = num(f.months), gr = num(f.grace);
      if (pr === undefined || rt === undefined || mo === undefined || gr === undefined) return `${label}: 숫자 형식을 확인해 주세요.`;
      if (pr === null || rt === null || mo === null) return `${label}: 금액·금리·만기를 모두 입력해 주세요.`;
      return { name: f.name, principal: pr * MAN, annualRatePct: rt, termMonths: mo, method: f.method, graceMonths: gr ?? 0, applyStress: f.stress };
    };

    const ex: ExistingLoan[] = [];
    for (const [i, f] of existing.entries()) {
      const label = f.name || `기존 대출 ${i + 1}`;
      if (f.mode === 'direct') {
        const ap = num(f.annualPayment);
        if (ap === undefined) return { kind: 'msg' as const, text: `${label}: 숫자 형식을 확인해 주세요.` };
        if (ap === null) return { kind: 'msg' as const, text: `${label}: 연 원리금을 입력해 주세요.` };
        ex.push({ mode: 'direct', name: f.name, annualPayment: ap * MAN });
      } else {
        const l = toLoan(f, label);
        if (typeof l === 'string') return { kind: 'msg' as const, text: l };
        ex.push({ mode: 'schedule', ...l });
      }
    }
    let nl: DsrLoan | null = null;
    if (withNew) {
      const l = toLoan(newLoan, '신규 대출');
      if (typeof l === 'string') return { kind: 'msg' as const, text: l };
      nl = l;
    }
    if (ex.length === 0 && !nl) return { kind: 'msg' as const, text: '기존 대출 또는 신규 대출을 하나 이상 입력해 주세요.' };
    const r = computeDsr({ annualIncome: inc * MAN, existing: ex, newLoan: nl, stressAddPct: stress ?? 0, limitPct: lim });
    return r.ok ? { kind: 'ok' as const, r } : { kind: 'msg' as const, text: r.error };
  }, [income, existing, withNew, newLoan, stressAdd, limit]);

  const updateEx = (key: number, p: Partial<LoanForm>) => setExisting((l) => l.map((x) => (x.key === key ? { ...x, ...p } : x)));

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-gray-200 p-4" aria-labelledby={`${uid}-inc`}>
        <h3 id={`${uid}-inc`} className="font-semibold text-gray-900">1. 연 소득</h3>
        <div className="mt-3 max-w-sm">
          <Field id={`${uid}-income`} label="연 소득" suffix="만원" value={income} onChange={setIncome} hint="소득 인정 범위는 금융기관 기준이 다를 수 있습니다(미확인)." />
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 p-4" aria-labelledby={`${uid}-ex`}>
        <div className="flex items-center justify-between">
          <h3 id={`${uid}-ex`} className="font-semibold text-gray-900">2. 기존 대출 (원리금)</h3>
          <button type="button" onClick={() => { setExisting((l) => [...l, blankLoan(nextKey)]); setNextKey((k) => k + 1); }} className="rounded-md border border-brand-600 px-3 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-50">
            기존 대출 추가
          </button>
        </div>
        {existing.length === 0 && <p className="mt-3 text-sm text-gray-500">기존 대출이 없으면 비워 두세요.</p>}
        <div className="mt-3 space-y-4">
          {existing.map((f, i) => (
            <div key={f.key} className="rounded-md bg-gray-50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800">기존 대출 {i + 1}</p>
                <button type="button" onClick={() => setExisting((l) => l.filter((x) => x.key !== f.key))} className="text-sm text-red-700 underline" aria-label={`기존 대출 ${i + 1} 삭제`}>삭제</button>
              </div>
              <LoanFields uid={uid} f={f} set={(p) => updateEx(f.key, p)} allowDirect title="기존 대출" />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 p-4" aria-labelledby={`${uid}-nw`}>
        <div className="flex items-center justify-between">
          <h3 id={`${uid}-nw`} className="font-semibold text-gray-900">3. 신규 대출</h3>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={withNew} onChange={(e) => setWithNew(e.target.checked)} /> 신규 대출 포함
          </label>
        </div>
        {withNew && <div className="mt-3"><LoanFields uid={uid} f={newLoan} set={(p) => setNewLoan((x) => ({ ...x, ...p }))} allowDirect={false} title="신규 대출" /></div>}
      </section>

      <section className="rounded-lg border border-gray-200 p-4" aria-labelledby={`${uid}-opt`}>
        <h3 id={`${uid}-opt`} className="font-semibold text-gray-900">4. 선택 설정</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <Field id={`${uid}-stress`} label="스트레스 가산금리" suffix="%p" value={stressAdd} onChange={setStressAdd} hint="체크한 대출의 금리에 더해 DSR 산정에만 사용합니다." />
            <div className="mt-2 flex flex-wrap gap-2">
              {stressDefault?.numeric !== undefined && (
                <button type="button" onClick={() => setStressAdd(String(stressDefault.numeric))} className="rounded-full border border-gray-300 px-3 py-1 text-xs hover:bg-brand-50">3단계 기본 {stressDefault.valueText}</button>
              )}
              {stressNonMetro?.numeric !== undefined && (
                <button type="button" onClick={() => setStressAdd(String(stressNonMetro.numeric))} className="rounded-full border border-gray-300 px-3 py-1 text-xs hover:bg-brand-50">지방 주담대 {stressNonMetro.valueText}</button>
              )}
              <button type="button" onClick={() => setStressAdd('0')} className="rounded-full border border-gray-300 px-3 py-1 text-xs hover:bg-brand-50">적용 안 함</button>
            </div>
            <p className="mt-1 text-xs text-gray-500">금융위원회 2025-05-20 보도자료 기준 값(이후 개정 여부 미확인).</p>
          </div>
          <Field id={`${uid}-limit`} label="비교할 기준 비율 (선택)" suffix="%" value={limit} onChange={setLimit} hint="규제 한도는 공식 원문 미확인이라 자동 적용하지 않습니다. 직접 확인한 값을 입력하세요." />
        </div>
      </section>

      <section aria-labelledby={`${uid}-res`} aria-live="polite" className="rounded-lg border border-brand-200 bg-brand-50 p-4">
        <h3 id={`${uid}-res`} className="font-semibold text-brand-900">계산 결과 (참고용 추정)</h3>
        {outcome.kind === 'idle' && <p className="mt-2 text-sm text-gray-600">연 소득과 대출 정보를 입력하면 결과가 표시됩니다.</p>}
        {outcome.kind === 'msg' && <p role="alert" className="mt-2 text-sm text-red-700">{outcome.text}</p>}
        {outcome.kind === 'ok' && (() => {
          const r = outcome.r;
          return (
            <div className="mt-3 space-y-4">
              <p className="text-3xl font-bold text-brand-900">DSR {formatNumber(r.ratioPct, 2)}%</p>
              <dl className="grid gap-3 sm:grid-cols-3">
                <div className="rounded bg-white p-3"><dt className="text-xs text-gray-500">기존 대출 연 원리금</dt><dd className="font-semibold">{manText(r.existingAnnual)}</dd></div>
                <div className="rounded bg-white p-3"><dt className="text-xs text-gray-500">신규 대출 연 원리금</dt><dd className="font-semibold">{manText(r.newAnnual)}</dd></div>
                <div className="rounded bg-white p-3"><dt className="text-xs text-gray-500">합계 연 원리금</dt><dd className="font-semibold">{manText(r.totalAnnual)}</dd></div>
              </dl>
              {r.withinLimit !== null && r.limitPct !== null && (
                <p className={r.withinLimit ? 'text-sm font-medium text-green-800' : 'text-sm font-medium text-red-700'}>
                  입력한 기준 {formatNumber(r.limitPct, 2)}%에 대해 {r.withinLimit ? '이내입니다.' : '초과합니다.'} (기준 비율은 이용자 입력값이며 공식 한도가 아닙니다)
                </p>
              )}
              {r.maxNewPrincipal !== null && (
                <p className="text-sm text-gray-800">
                  입력한 기준 비율 이내로 가능한 신규 대출 최대 원금(같은 금리·만기·방식 가정, 추정): <strong>{won(Math.floor(r.maxNewPrincipal / MAN) * MAN)}</strong> (약 {formatNumber(r.maxNewPrincipal / MAN, 0)}만원)
                </p>
              )}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <caption className="sr-only">대출별 첫 12개월 원리금</caption>
                  <thead><tr className="border-b border-brand-200 text-gray-700"><th scope="col" className="p-2">대출</th><th scope="col" className="p-2">구분</th><th scope="col" className="p-2 text-right">연 이자</th><th scope="col" className="p-2 text-right">연 원금</th><th scope="col" className="p-2 text-right">연 원리금</th></tr></thead>
                  <tbody>
                    {r.lines.map((l, i) => (
                      <tr key={i} className="border-b border-brand-100">
                        <th scope="row" className="p-2 font-medium">{l.name}{l.stressApplied && <span className="ml-1 text-xs text-gray-500">(스트레스 가산)</span>}</th>
                        <td className="p-2">{l.kind === 'new' ? '신규' : '기존'}</td>
                        <td className="p-2 text-right">{l.annualInterest === null ? '-' : manText(l.annualInterest)}</td>
                        <td className="p-2 text-right">{l.annualPrincipal === null ? '-' : manText(l.annualPrincipal)}</td>
                        <td className="p-2 text-right">{manText(l.annualPayment)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-600">첫 12개월(만기가 짧으면 만기까지)의 원금+이자 합계를 연 소득으로 나눈 단순 공식 추정입니다. 금융기관의 심사·소득 인정·규제 적용과 다를 수 있습니다.</p>
            </div>
          );
        })()}
      </section>
    </div>
  );
}
