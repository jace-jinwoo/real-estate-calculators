'use client';

import type { ReactNode } from 'react';
import { parseNumberInput } from '@/lib/format';

const INPUT = 'w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200 aria-[invalid=true]:border-red-500';

/** 숫자 입력 문자열 → number | null(빈 입력) | undefined(형식 오류) */
export function num(raw: string): number | null | undefined {
  const r = parseNumberInput(raw);
  return r.ok ? r.value : undefined;
}

export const MAN = 10000;
export const won = (v: number) => `${Math.round(v).toLocaleString('ko-KR')}원`;

export function Field({ id, label, value, onChange, suffix, hint, type = 'text' }: {
  id: string; label: string; value: string; onChange: (v: string) => void; suffix?: string; hint?: string; type?: 'text' | 'date';
}) {
  const bad = type === 'text' && value.trim() !== '' && num(value) === undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <input id={id} type={type} inputMode={type === 'text' ? 'decimal' : undefined} value={value} onChange={(e) => onChange(e.target.value)}
          aria-invalid={bad} aria-describedby={hint ? `${id}-hint` : undefined} className={INPUT} />
        {suffix && <span className="shrink-0 text-sm text-gray-600">{suffix}</span>}
      </div>
      {hint && <p id={`${id}-hint`} className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

export function SelectField<T extends string>({ id, label, value, onChange, options, hint }: {
  id: string; label: string; value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as T)} aria-describedby={hint ? `${id}-hint` : undefined} className={INPUT}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {hint && <p id={`${id}-hint`} className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function SubmitButton({ label = '계산하기' }: { label?: string }) {
  return <button type="submit" className="rounded-md bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-300">{label}</button>;
}

export type Msg = { kind: 'idle' } | { kind: 'error'; text: string } | { kind: 'unavailable'; text: string };

export function ResultBox({ title = '계산 결과 (참고용)', msg, children }: { title?: string; msg: Msg | null; children?: ReactNode }) {
  return (
    <section aria-live="polite" className="rounded-lg border border-brand-200 bg-brand-50 p-4">
      <h3 className="font-semibold text-brand-900">{title}</h3>
      {(!msg || msg.kind === 'idle') && !children && <p className="mt-2 text-sm text-gray-600">값을 입력하고 &quot;계산하기&quot;를 누르면 결과가 표시됩니다.</p>}
      {msg?.kind === 'error' && <p role="alert" className="mt-2 text-sm text-red-700">{msg.text}</p>}
      {msg?.kind === 'unavailable' && <p role="status" className="mt-2 rounded bg-white p-3 text-sm text-amber-900"><strong>계산 불가(미확인):</strong> {msg.text}</p>}
      {children}
    </section>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded bg-white p-3"><dt className="text-xs text-gray-500">{label}</dt><dd className="font-semibold">{value}</dd></div>;
}
