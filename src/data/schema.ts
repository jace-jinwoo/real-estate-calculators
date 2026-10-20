/**
 * 세율·공제·한도·규제 데이터 스키마.
 * - 각 값은 공식 출처를 직접 열어 확인한 경우에만 status: '확인' 으로 기록합니다.
 * - 확인하지 못한 값은 status: '미확인' 으로 두고 value 를 넣지 않으며, 계산에 사용하지 않습니다.
 * - 적용 기준일(effectiveFrom)별로 같은 key 의 항목을 여러 버전으로 둘 수 있습니다.
 */
export type DataStatus = '확인' | '미확인';

export interface DataItem {
  /** 고유 ID (예: dsr.stress.stage3.metro-mortgage@2025-07-01) */
  id: string;
  /** 같은 규정의 버전들을 묶는 키 */
  key: string;
  /** 이 데이터가 쓰이는 도구 slug */
  tool: string;
  label: string;
  status: DataStatus;
  /** 화면 표시용 값 (status 가 '미확인' 이면 없어야 함) */
  valueText?: string;
  /** 계산에 쓰는 숫자 값 (status 가 '미확인' 이면 없어야 함) */
  numeric?: number;
  /** 적용 시작일 YYYY-MM-DD (버전 구분) */
  effectiveFrom?: string;
  /** 적용 종료일 (없으면 확인 시점 현재 유효) */
  effectiveTo?: string;
  sourceName: string;
  /** 직접 열어 확인한 공식 출처 URL ('확인' 이면 필수) */
  sourceUrl?: string;
  /** 확인일 YYYY-MM-DD ('확인' 이면 필수) */
  verifiedAt?: string;
  note?: string;
}

/** key 별로 기준일 시점에 유효한 '확인' 버전을 고릅니다. 없으면 undefined. */
export function pickVersion(items: DataItem[], key: string, onDate: string): DataItem | undefined {
  return items
    .filter((d) => d.key === key && d.status === '확인' && d.effectiveFrom && d.effectiveFrom <= onDate && (!d.effectiveTo || onDate <= d.effectiveTo))
    .sort((a, b) => (b.effectiveFrom ?? '').localeCompare(a.effectiveFrom ?? ''))[0];
}
