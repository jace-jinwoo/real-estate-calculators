export interface Guide {
  id: string;
  title: string;
  summary: string;
  paragraphs: string[];
  date: string;
  toolSlug: string;
}

export const GUIDES: Guide[] = [
  {
    id: 'dsr-repayment-methods',
    title: 'DSR 계산에서 상환방식이 중요한 이유',
    summary: '원리금균등·원금균등·만기일시에 따라 첫해 원리금이 어떻게 달라지는지 정리했습니다.',
    paragraphs: [
      'DSR은 연간 원리금 상환액을 연 소득으로 나눈 값입니다. 같은 금액·금리·만기라도 상환방식에 따라 첫해에 내는 원금과 이자가 달라 DSR이 다르게 나옵니다.',
      '원리금균등은 매월 상환액이 같고, 원금균등은 첫해 부담이 가장 큽니다. 만기일시는 만기 전까지 이자만 내므로 첫해 합계가 작지만, 금융기관이 DSR 산정 시 이를 어떻게 환산하는지는 별도로 확인해야 합니다.',
    ],
    date: '2026-10-19',
    toolSlug: 'dsr',
  },
  {
    id: 'stress-dsr-note',
    title: '스트레스 DSR 가산금리, 확인된 범위와 한계',
    summary: '금융위원회 보도자료로 확인한 3단계 값과, 아직 확인하지 못한 항목을 구분해 안내합니다.',
    paragraphs: [
      '금융위원회 2025-05-20 보도자료에 따르면 3단계 스트레스 DSR은 2025-07-01부터 주택담보대출·신용대출·기타대출에 1.50%p를 적용하고, 서울·경기·인천을 제외한 지방 주택담보대출은 0.75%p를 적용합니다. 신용대출은 잔액이 1억원을 넘는 경우에만 부과된다고 설명합니다.',
      '이 사이트는 해당 보도자료 이후의 개정 여부와 각 금융기관의 세부 적용을 확인하지 못했습니다. 실제 한도는 대출을 받는 금융기관에 확인하세요.',
    ],
    date: '2026-10-19',
    toolSlug: 'dsr',
  },
];
