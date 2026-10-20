export type ParseResult =
  | { ok: true; value: number | null }
  | { ok: false; error: string };

/** 사용자가 입력한 문자열을 숫자로 변환합니다. 빈 입력은 value: null 입니다. */
export function parseNumberInput(raw: string): ParseResult {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return { ok: true, value: null };
  if (!/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(t)) {
    return { ok: false, error: '숫자만 입력해 주세요. (예: 12.5, -3, 1e3)' };
  }
  const v = Number(t);
  if (!Number.isFinite(v)) {
    return { ok: false, error: '표현할 수 없는 크기의 숫자입니다.' };
  }
  return { ok: true, value: v };
}

/** 소수점 자리수를 제한하고 불필요한 0을 제거합니다. */
export function formatNumber(v: number, decimals = 4): string {
  if (!Number.isFinite(v)) return '';
  const d = Math.min(10, Math.max(0, Math.trunc(decimals)));
  if (v === 0) return '0';
  const abs = Math.abs(v);
  if (abs >= 1e21 || abs < 1e-12) {
    return v.toExponential(Math.min(d, 6));
  }
  let s = v.toFixed(d);
  if (s.includes('.')) s = s.replace(/\.?0+$/, '');
  if (s === '-0') return '0';
  return s;
}
