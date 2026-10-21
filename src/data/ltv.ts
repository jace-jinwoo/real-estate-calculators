import type { DataItem } from './schema';

/**
 * LTV 관련 데이터. 금융위원회 보도자료
 * "「긴급 가계부채 점검회의」를 개최하여 수도권 중심의 「가계부채 관리 강화 방안」 발표" (2025-06-27) 를
 * 2026-10-19 에 직접 열어 확인한 값만 '확인' 으로 둡니다. 이후 대책(예: 2025-10 규제지역 확대 등)의 반영은 확인하지 못했습니다.
 */
const URL = 'https://www.fsc.go.kr/no010101/84824?srchCtgry=&curPage=&srchKey=&srchText=&srchBeginDt=&srchEndDt=';
const NAME = '금융위원회 보도자료 "수도권 중심의 가계부채 관리 강화 방안" (2025-06-27)';
const b = { tool: 'ltv', sourceName: NAME, sourceUrl: URL, verifiedAt: '2026-10-19', effectiveFrom: '2025-06-28' } as const;
const LATER = '이 보도자료 이후 개정 여부는 확인하지 못했습니다(미확인). 최신 공지를 확인하세요.';

export const LTV_DATA: DataItem[] = [
  { ...b, id: 'ltv.firsttime.metro-regulated@2025-06-28', key: 'ltv.firsttime.metro-regulated', label: '생애 최초 주택구입 목적 주담대 LTV - 수도권·규제지역', status: '확인', valueText: '70% (6개월 이내 전입의무)', numeric: 70, note: LATER },
  { ...b, id: 'ltv.firsttime.nonmetro@2025-06-28', key: 'ltv.firsttime.nonmetro', label: '생애 최초 주택구입 목적 주담대 LTV - 지방(규제지역 외)', status: '확인', valueText: '80% (현행과 동일로 기재)', numeric: 80, note: LATER },
  { ...b, id: 'ltv.additional.metro-regulated@2025-06-28', key: 'ltv.additional.metro-regulated', label: '2주택 이상 보유자 또는 기존 주택을 팔지 않고 추가 구입하는 1주택자 - 수도권·규제지역 내 추가 주택 구입 목적 주담대 LTV', status: '확인', valueText: '0%', numeric: 0, note: LATER },
  { ...b, id: 'ltv.cap.metro-regulated-purchase@2025-06-28', key: 'ltv.cap.metro-regulated-purchase', label: '주택구입 목적 주담대 한도 - 수도권·규제지역 (중도금대출 제외)', status: '확인', valueText: '최대 6억원', numeric: 600000000, note: LATER },
  { id: 'ltv.general@unverified', key: 'ltv.general', tool: 'ltv', label: '일반(생애최초 아닌 무주택자·1주택자 처분조건부 등) 기본 LTV 비율', status: '미확인', sourceName: NAME, note: '보도자료 표의 현행/개선 수치가 뒤섞여 읽혀 정확한 적용 범위를 확정하지 못했습니다. 비율은 이용자가 직접 입력하세요.' },
  { id: 'ltv.regulated-areas@unverified', key: 'ltv.regulated-areas', tool: 'ltv', label: '현재 규제지역(투기과열지구·조정대상지역) 지정 현황', status: '미확인', sourceName: '국토교통부 (원문 미확인)', note: '지정 지역은 수시로 바뀌므로 직접 확인해야 합니다.' },
  { id: 'ltv.deductions@unverified', key: 'ltv.deductions', tool: 'ltv', label: '소액임차보증금(방 공제) 등 LTV 산정 시 차감 규칙, 금융기관별 담보인정 가액 기준', status: '미확인', sourceName: '금융위원회·은행업감독규정 (원문 미확인)', note: '선순위 채권·임차보증금은 이용자가 입력한 금액 전액을 차감하는 단순 방식입니다.' },
];
