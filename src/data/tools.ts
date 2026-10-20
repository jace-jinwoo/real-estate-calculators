export type ToolCategory = 'loan' | 'tax' | 'fee';

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  loan: '대출·규제',
  tax: '세금',
  fee: '수수료',
};

export interface SourceRef {
  label: string;
  url?: string;
}

export interface ToolMeta {
  slug: string;
  name: string;
  category: ToolCategory;
  popular: boolean;
  title: string;
  description: string;
  shortDescription: string;
  keywords: string[];
  howTo: string[];
  example: { input: string; output: string; note?: string };
  details: string[];
  faq: { q: string; a: string }[];
  sources: SourceRef[];
  related: string[];
}

export const TOOLS: ToolMeta[] = [
  {
    slug: 'dsr',
    name: 'DSR 계산기',
    category: 'loan',
    popular: true,
    title: 'DSR 계산기 - 총부채원리금상환비율·신규 대출 가능액 추정',
    description:
      '연 소득과 기존 대출 원리금, 신규 대출의 상환방식(원리금균등·원금균등·만기일시)을 입력해 DSR을 계산하고, 기준 비율 이내 신규 대출 가능액을 추정합니다.',
    shortDescription: '기존 대출 원리금과 신규 대출 상환 구조를 나눠 DSR 추정',
    keywords: ['DSR', '총부채원리금상환비율', '대출 한도', '원리금균등', '원금균등', '만기일시', '스트레스 DSR'],
    howTo: [
      '연 소득을 만원 단위로 입력합니다. 세전 소득 인정 기준은 금융기관마다 다를 수 있습니다.',
      '기존 대출을 추가하고 상환 구조(잔액·금리·남은 만기·방식)를 입력하거나, 은행 안내 등으로 아는 연 원리금을 직접 입력합니다.',
      '신규 대출의 금액·금리·만기·상환방식(필요하면 거치 개월)을 입력합니다.',
      '스트레스 가산금리를 반영하려면 공식 확인된 값 버튼을 누르거나 직접 입력하고, 가산을 적용할 대출을 선택합니다.',
      '비교할 기준 비율을 직접 입력하면 기준 이내 여부와 신규 대출 최대 원금 추정치가 표시됩니다.',
    ],
    example: {
      input: '연 소득 6,000만원, 기존 대출 없음, 신규 3억원·연 4%·30년·원리금균등',
      output: '연 원리금 약 1,719만원 → DSR 약 28.6%',
      note: '첫 12개월 원리금 합계를 연 소득으로 나눈 단순 공식 결과이며 금융기관 심사 결과와 다를 수 있습니다.',
    },
    details: [
      'DSR(총부채원리금상환비율)은 모든 가계대출의 연간 원리금 상환액을 연 소득으로 나눈 비율입니다. 이 계산기는 대출별 첫 12개월의 원금과 이자 합계를 연 원리금으로 사용하는 단순 공식 방식입니다.',
      '원리금균등은 매월 상환액이 일정하고, 원금균등은 매월 같은 원금에 줄어드는 잔액에 대한 이자를 더해 첫해 상환액이 큽니다. 만기일시는 만기 전에는 이자만 내므로 만기가 12개월 이내인 경우에만 원금이 첫해 합계에 포함됩니다. 은행이 만기일시·마이너스통장 등의 원리금을 어떻게 환산하는지는 확인하지 못해 이 계산기에 반영하지 않았습니다.',
      '규제 비율(은행·비은행 한도), 소득 인정 범위, 예외 대출은 공식 원문을 확인하지 못해 "미확인"으로 두었습니다. 그래서 기준 비율을 자동 적용하지 않고, 이용자가 직접 입력한 비율과만 비교합니다.',
      '스트레스 DSR 가산금리는 금융위원회 2025-05-20 보도자료의 3단계 값만 데이터로 반영했으며, 이후 개정 여부는 확인하지 못했습니다. 가산 적용 대상(지역·대출 종류·잔액 조건)은 이용자가 직접 판단해 선택합니다.',
    ],
    faq: [
      {
        q: 'DSR 한도 비율은 몇 %인가요?',
        a: '이 사이트는 공식 원문을 열어 확인하지 못해 "미확인"으로 표시합니다. 금융위원회·은행 공지를 확인한 뒤 기준 비율 칸에 직접 입력해 비교하세요.',
      },
      {
        q: '원금균등은 왜 첫해 원리금이 더 큰가요?',
        a: '매월 같은 원금을 갚고 이자는 잔액에 비례해 줄어들기 때문에 초기에 이자가 가장 큽니다. 이 계산기는 첫 12개월 합계를 사용하므로 원리금균등보다 DSR이 높게 나올 수 있습니다.',
      },
      {
        q: '스트레스 가산금리는 실제 대출 금리에 붙나요?',
        a: '금융위원회 보도자료는 스트레스 금리가 실제 대출금리가 아니라 DSR 산정(한도 계산)에 쓰이는 가산이라고 설명합니다. 이 계산기도 DSR 계산에만 가산합니다.',
      },
      {
        q: '신용대출·마이너스통장은 어떻게 입력하나요?',
        a: '은행이 안내한 연 원리금을 알면 "직접 입력"을, 모르면 잔액·금리·만기·방식으로 입력하세요. 한도 약정액 기준 산정 등 은행별 규칙은 반영하지 않습니다.',
      },
    ],
    sources: [
      {
        label: '금융위원회 - 3단계 스트레스 DSR 시행방안 확정·발표 보도자료 (2025-05-20)',
        url: 'https://www.fsc.go.kr/po010101/84617?curPage=42',
      },
      { label: '금융위원회', url: 'https://www.fsc.go.kr' },
      { label: '금융감독원 금융소비자 정보 포털 파인', url: 'https://fine.fss.or.kr' },
    ],
    related: [],
  },
];

export function getTool(slug: string): ToolMeta | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
