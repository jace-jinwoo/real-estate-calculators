import type { DataItem } from './schema';
import { BROKERAGE_DATA } from './brokerage';
import { LTV_DATA } from './ltv';
import { ACQ_DATA } from './acquisitionTax';
import { CGT_DATA } from './capitalGains';

/**
 * 규제·세율 데이터. 공식 출처를 직접 열어 확인한 값만 status '확인' 으로 기록합니다.
 * 갱신 절차는 README 의 "데이터 갱신" 절을 따르세요.
 */
const FSC_STRESS_URL = 'https://www.fsc.go.kr/po010101/84617?curPage=42';
const FSC_STRESS_NAME = '금융위원회 보도자료 "3단계 스트레스 DSR 시행방안 확정·발표" (2025-05-20)';

export const DATA: DataItem[] = [
  // ───────── DSR ─────────
  {
    id: 'dsr.stress.stage3.default@2025-07-01',
    key: 'dsr.stress.stage3.default',
    tool: 'dsr',
    label: '3단계 스트레스 DSR 스트레스 금리 (주담대·신용대출·기타대출 기본)',
    status: '확인',
    valueText: '1.50%p',
    numeric: 1.5,
    effectiveFrom: '2025-07-01',
    sourceName: FSC_STRESS_NAME,
    sourceUrl: FSC_STRESS_URL,
    verifiedAt: '2026-10-19',
    note: '해당 보도자료 표 기준. 이후 개정 여부와 상품·지역별 세부 적용은 미확인이므로 최신 공지를 확인하세요.',
  },
  {
    id: 'dsr.stress.stage3.nonmetro-mortgage@2025-07-01',
    key: 'dsr.stress.stage3.nonmetro-mortgage',
    tool: 'dsr',
    label: '3단계 스트레스 DSR - 지방(서울·경기·인천 제외) 주택담보대출',
    status: '확인',
    valueText: '0.75%p',
    numeric: 0.75,
    effectiveFrom: '2025-07-01',
    sourceName: FSC_STRESS_NAME,
    sourceUrl: FSC_STRESS_URL,
    verifiedAt: '2026-10-19',
    note: '해당 보도자료 기준. 이후 개정 여부는 미확인.',
  },
  {
    id: 'dsr.stress.stage3.credit-note@2025-07-01',
    key: 'dsr.stress.stage3.credit-note',
    tool: 'dsr',
    label: '3단계 스트레스 DSR - 신용대출 부과 조건',
    status: '확인',
    valueText: '대출 잔액 1억원 초과 시에만 스트레스 금리 부과',
    effectiveFrom: '2025-07-01',
    sourceName: FSC_STRESS_NAME,
    sourceUrl: FSC_STRESS_URL,
    verifiedAt: '2026-10-19',
    note: '이 계산기는 대출별로 "스트레스 금리 적용" 여부를 직접 선택하게 하며 자동 판정하지 않습니다.',
  },
  {
    id: 'dsr.limit.bank@unverified',
    key: 'dsr.limit.bank',
    tool: 'dsr',
    label: '은행권 DSR 규제 비율(한도)',
    status: '미확인',
    sourceName: '은행업감독규정·금융위원회 (이번 확인 범위에서 원문 미확인)',
    note: '공식 원문을 열어 확인하지 못했습니다. 이용자가 직접 기준 비율을 입력할 때만 비교합니다.',
  },
  {
    id: 'dsr.limit.nonbank@unverified',
    key: 'dsr.limit.nonbank',
    tool: 'dsr',
    label: '비은행(제2금융권) DSR 규제 비율(한도)',
    status: '미확인',
    sourceName: '금융위원회 (이번 확인 범위에서 원문 미확인)',
    note: '공식 원문을 열어 확인하지 못했습니다. 이용자가 직접 기준 비율을 입력할 때만 비교합니다.',
  },
  {
    id: 'dsr.income-and-debt-scope@unverified',
    key: 'dsr.income-and-debt-scope',
    tool: 'dsr',
    label: 'DSR 산정 시 소득 인정 범위, 대출 종류별 원리금 산정 세부 규칙, 예외 대출',
    status: '미확인',
    sourceName: '금융위원회·은행업감독규정 (원문 미확인)',
    note: '금융기관마다 소득 인정·만기 반영 방식이 다를 수 있어 이 계산기는 단순 공식 기반 추정만 제공합니다.',
  },
  ...BROKERAGE_DATA,
  ...LTV_DATA,
  ...ACQ_DATA,
  ...CGT_DATA,
];

export function dataFor(tool: string): DataItem[] {
  return DATA.filter((d) => d.tool === tool);
}

export function getData(id: string): DataItem | undefined {
  return DATA.find((d) => d.id === id);
}
