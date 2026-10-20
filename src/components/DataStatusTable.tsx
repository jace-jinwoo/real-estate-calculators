import { dataFor } from '@/data/regulations';

/** 도구가 사용하는 규제·세율 데이터의 확인 상태를 투명하게 보여줍니다. */
export default function DataStatusTable({ tool }: { tool: string }) {
  const items = dataFor(tool);
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="data-heading" className="mt-10">
      <h2 id="data-heading" className="text-xl font-semibold text-gray-900">적용 기준 데이터와 확인 상태</h2>
      <p className="mt-2 text-sm text-gray-600">
        공식 출처를 직접 열어 확인한 값만 &quot;확인&quot;으로 표시하며, 확인하지 못한 항목은 &quot;미확인&quot;으로 두고 계산에 사용하지 않습니다.
      </p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <caption className="sr-only">적용 기준 데이터 목록</caption>
          <thead>
            <tr className="border-b border-gray-300 bg-gray-50 text-gray-700">
              <th scope="col" className="p-2">항목</th>
              <th scope="col" className="p-2">값</th>
              <th scope="col" className="p-2">상태</th>
              <th scope="col" className="p-2">적용일 / 확인일</th>
              <th scope="col" className="p-2">출처·비고</th>
            </tr>
          </thead>
          <tbody>
            {items.map((d) => (
              <tr key={d.id} className="border-b border-gray-200 align-top">
                <th scope="row" className="p-2 font-medium text-gray-900">{d.label}</th>
                <td className="p-2 text-gray-700">{d.status === '확인' ? d.valueText : '-'}</td>
                <td className="p-2">
                  <span className={d.status === '확인' ? 'rounded bg-brand-50 px-2 py-0.5 font-medium text-brand-700' : 'rounded bg-amber-100 px-2 py-0.5 font-medium text-amber-900'}>
                    {d.status}
                  </span>
                </td>
                <td className="p-2 text-gray-700">
                  {d.effectiveFrom ? `${d.effectiveFrom} 시행` : '-'}
                  {d.verifiedAt && <span className="block text-xs text-gray-500">확인 {d.verifiedAt}</span>}
                </td>
                <td className="p-2 text-gray-700">
                  {d.sourceUrl ? (
                    <a href={d.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">{d.sourceName}</a>
                  ) : (
                    d.sourceName
                  )}
                  {d.note && <span className="block text-xs text-gray-500">{d.note}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
