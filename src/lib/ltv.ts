export interface LtvInput {
  /** 담보가치(매매가 또는 감정가 등 이용자가 선택한 기준), 원 */
  collateralValue: number;
  /** 적용 LTV % (이용자 입력 또는 확인된 값 선택) */
  ltvPct: number | null;
  /** 선순위 채권·임차보증금 등 차감액, 원 */
  priorClaims: number;
  /** 대출 한도 상한(예: 확인된 6억원 한도), 원. 없으면 null */
  capAmount: number | null;
  /** 희망 대출액(선택), 원 */
  desiredLoan: number | null;
}

export type LtvResult =
  | { ok: false; error: string }
  | { ok: true; status: 'unavailable'; reason: string }
  | {
      ok: true;
      status: 'calculated';
      /** 담보가치 × LTV, 원 */
      byLtv: number;
      /** 선순위 차감 후, 0 미만이면 0 */
      afterPrior: number;
      capApplied: boolean;
      maxLoan: number;
      /** 희망 대출액 기준 LTV % ((희망액 + 선순위) / 담보가치) */
      desiredLtvPct: number | null;
      /** 희망 대출액이 최대 가능액 이내인지 */
      desiredWithin: boolean | null;
    };

export function computeLtv(i: LtvInput): LtvResult {
  if (!Number.isFinite(i.collateralValue) || i.collateralValue <= 0) return { ok: false, error: '담보가치(매매가 또는 감정가)는 0보다 커야 합니다.' };
  if (!Number.isFinite(i.priorClaims) || i.priorClaims < 0) return { ok: false, error: '선순위 채권·임차보증금은 0 이상이어야 합니다.' };
  if (i.capAmount !== null && (!Number.isFinite(i.capAmount) || i.capAmount < 0)) return { ok: false, error: '대출 한도 상한은 0 이상이어야 합니다.' };
  if (i.desiredLoan !== null && (!Number.isFinite(i.desiredLoan) || i.desiredLoan < 0)) return { ok: false, error: '희망 대출액은 0 이상이어야 합니다.' };
  if (i.ltvPct === null) {
    return { ok: true, status: 'unavailable', reason: '일반 LTV 비율은 공식 원문에서 확정하지 못했습니다. 확인된 값 버튼을 고르거나 직접 확인한 LTV 비율을 입력해 주세요.' };
  }
  if (!Number.isFinite(i.ltvPct) || i.ltvPct < 0 || i.ltvPct > 100) return { ok: false, error: 'LTV 비율은 0~100% 범위로 입력해 주세요.' };

  const byLtv = Math.floor((i.collateralValue * i.ltvPct) / 100 + 1e-6);
  const afterPrior = Math.max(0, byLtv - i.priorClaims);
  const capApplied = i.capAmount !== null && afterPrior > i.capAmount;
  const maxLoan = capApplied && i.capAmount !== null ? i.capAmount : afterPrior;
  const desiredLtvPct = i.desiredLoan === null ? null : ((i.desiredLoan + i.priorClaims) / i.collateralValue) * 100;
  const desiredWithin = i.desiredLoan === null ? null : i.desiredLoan <= maxLoan;
  return { ok: true, status: 'calculated', byLtv, afterPrior, capApplied, maxLoan, desiredLtvPct, desiredWithin };
}
