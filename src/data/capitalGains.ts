import type { DataItem } from './schema';

/**
 * 양도소득세 데이터. 국세청 양도소득세 세율 페이지(소득세법 §104①1, §55①)의 위치는 확인했으나
 * 본문 표를 직접 열어 읽지 못했고, 법제처(law.go.kr) 조문도 동적 페이지라 본문을 읽지 못했습니다.
 * 따라서 세율·공제·비과세·중과 값은 모두 '미확인' 이며 이 계산기는 세액을 계산하지 않습니다.
 * (확인하지 못한 값은 기억에 의존해 넣지 않습니다.)
 */
const NTS = '국세청 양도소득세 > 기본정보 (본문 열람 실패, 원문 미확인)';
const un = { tool: 'capital-gains-tax', status: '미확인', sourceName: NTS } as const;

export const CGT_DATA: DataItem[] = [
  { ...un, id: 'cgt.basic-rate@unverified', key: 'cgt.basic-rate', label: '양도소득세 기본세율(과세표준 구간별 세율·누진공제)', note: '소득세법 제55조·제104조. 표를 열어 확인하지 못했습니다.' },
  { ...un, id: 'cgt.short-term-rate@unverified', key: 'cgt.short-term-rate', label: '보유기간별(단기 양도) 세율', note: '확인하지 못했습니다.' },
  { ...un, id: 'cgt.heavy@unverified', key: 'cgt.heavy', label: '조정대상지역 다주택 중과세율 및 중과 유예·배제 여부', note: '시행 시점·유예 여부가 수시로 바뀌므로 반드시 최신 원문 확인이 필요합니다. 확인하지 못했습니다.' },
  { ...un, id: 'cgt.long-term-deduction@unverified', key: 'cgt.long-term-deduction', label: '장기보유특별공제율(보유·거주기간별)', note: '확인하지 못했습니다.' },
  { ...un, id: 'cgt.basic-deduction@unverified', key: 'cgt.basic-deduction', label: '양도소득 기본공제 금액', note: '확인하지 못했습니다.' },
  { ...un, id: 'cgt.exemption@unverified', key: 'cgt.exemption', label: '1세대 1주택 비과세 요건·12억원 기준 등 고가주택 계산, 일시적 2주택 특례', note: '확인하지 못했습니다.' },
  { ...un, id: 'cgt.local-income-tax@unverified', key: 'cgt.local-income-tax', label: '지방소득세 세율', note: '확인하지 못했습니다.' },
  { ...un, id: 'cgt.necessary-expenses@unverified', key: 'cgt.necessary-expenses', label: '필요경비로 인정되는 항목·증명 요건, 취득가액 환산(추계) 규정', note: '입력한 필요경비를 그대로 차감하는 단순 산술만 제공합니다.' },
];
