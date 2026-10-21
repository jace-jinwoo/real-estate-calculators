import type { DataItem } from './schema';

/**
 * 취득세 세율. 김해시 취득세 세율 안내 페이지(지방세법 제11조·제12조·제13조의2 근거로 표기)를 2026-10-19 에 직접 열어 확인한 값입니다.
 * 이 페이지에는 세율 기준일(시행일)이 표시되어 있지 않으므로 effectiveFrom 은 비워 두었고,
 * 지방교육세·농어촌특별세 비율은 이 페이지에 없어 미확인입니다. 법령 원문(법제처)은 직접 확인하지 못했습니다.
 */
export const ACQ_SOURCE_URL = 'https://www.gimhae.go.kr/00610/07901/09195.web';
export const ACQ_SOURCE_NAME = '김해시청 취득세 세율 안내 (지방세법 제11조·제12조·제13조의2 근거 표기, 기준일 미표시)';

export const ACQ_RATES = {
  housingLow: { id: 'acq.housing.low', ratePct: 1, label: '주택 유상취득 6억원 이하' },
  housingHigh: { id: 'acq.housing.high', ratePct: 3, label: '주택 유상취득 9억원 초과' },
  housingMidMin: 1.01,
  housingMidMax: 2.99,
  nonHousingFarm: 3,
  nonHousing: 4,
  inheritFarm: 2.3,
  inherit: 2.8,
  gift: 3.5,
  original: 2.8,
  partition: 2.3,
  /** 중과: 조정대상지역 2주택(일시적 2주택 제외) */
  heavy2Regulated: 8,
  heavy3Regulated: 12,
  heavy3NonRegulated: 8,
  heavy4OrCorp: 12,
  /** 6억 초과 9억 이하 구간 하한 / 상한 (원) */
  low: 600000000,
  high: 900000000,
} as const;

const b = { tool: 'acquisition-tax', sourceName: ACQ_SOURCE_NAME, sourceUrl: ACQ_SOURCE_URL, verifiedAt: '2026-10-19', note: '세율 기준일이 페이지에 표시되지 않아 시행일 미확인. 최신 지방세법 원문 확인 필요.' } as const;

export const ACQ_DATA: DataItem[] = [
  { ...b, id: 'acq.housing.low@page', key: 'acq.housing.low', label: '주택 유상취득(1주택 기준) 6억원 이하 취득세율', status: '확인', valueText: '1%', numeric: 1 },
  { ...b, id: 'acq.housing.high@page', key: 'acq.housing.high', label: '주택 유상취득(1주택 기준) 9억원 초과 취득세율', status: '확인', valueText: '3%', numeric: 3 },
  { ...b, id: 'acq.housing.mid@page', key: 'acq.housing.mid', label: '주택 유상취득(1주택 기준) 6억원 초과 9억원 이하 취득세율', status: '확인', valueText: '1.01~2.99% (구간 내 산식은 페이지에 없어 범위로만 표시)', note: '정확한 세율 산식은 확인하지 못해 세액을 범위(최소~최대)로만 표시합니다.' },
  { ...b, id: 'acq.nonhousing@page', key: 'acq.nonhousing', label: '그 밖의 유상취득(매매 등) 세율', status: '확인', valueText: '농지 3%, 농지 외 4%' },
  { ...b, id: 'acq.inherit@page', key: 'acq.inherit', label: '상속 취득세율', status: '확인', valueText: '농지 2.3%, 그 밖 2.8%' },
  { ...b, id: 'acq.gift-original-partition@page', key: 'acq.gift-original-partition', label: '무상취득(증여 등) 3.5%(비영리사업자 2.8%), 원시취득 2.8%, 공유물 등 분할 2.3%', status: '확인', valueText: '3.5% / 2.8% / 2.3%' },
  { ...b, id: 'acq.heavy@page', key: 'acq.heavy', label: '다주택·법인 주택 취득세 중과세율 (조정대상지역 2주택 8%(일시적 2주택 제외)·3주택 12%, 비조정 3주택 8%, 법인·4주택 이상 12%)', status: '확인', valueText: '8% / 12%' },
  { id: 'acq.surtax@unverified', key: 'acq.surtax', tool: 'acquisition-tax', label: '지방교육세·농어촌특별세 세율', status: '미확인', sourceName: '지방세법·농어촌특별세법 (원문 미확인)', note: '취득세 본세만 계산하며 부가세는 포함하지 않습니다.' },
  { id: 'acq.mid-formula@unverified', key: 'acq.mid-formula', tool: 'acquisition-tax', label: '6억 초과~9억 이하 주택의 구간 내 세율 산식', status: '미확인', sourceName: '지방세법 제11조 (원문 미확인)', note: '범위 1.01~2.99% 표시만 가능합니다.' },
  { id: 'acq.exemptions@unverified', key: 'acq.exemptions', tool: 'acquisition-tax', label: '중과 제외 사유, 감면(생애최초 등), 주택 수 산정 기준, 조정대상지역 지정 현황', status: '미확인', sourceName: '지방세법·지방세특례제한법 (원문 미확인)', note: '주택 수·지역은 이용자가 직접 판단해 입력합니다. 감면은 반영하지 않습니다.' },
];
