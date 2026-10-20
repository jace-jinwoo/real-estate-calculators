'use client';

import { useEffect } from 'react';
import { ADS_ENABLED, ADSENSE_CLIENT, ADSENSE_SLOTS, type AdPlacement } from '@/lib/site';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * 광고 영역. AdSense 승인 전(NEXT_PUBLIC_ADSENSE_ENABLED !== 'true')에는 아무것도 렌더링하지 않습니다.
 * 서비스 버튼과 혼동되지 않도록 "광고" 라벨을 표시하고 본문과 간격을 둡니다.
 */
export default function AdSlot({ placement }: { placement: AdPlacement }) {
  const slot = ADSENSE_SLOTS[placement];
  const active = ADS_ENABLED && slot !== '';

  useEffect(() => {
    if (!active) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // 광고 로드 실패는 서비스 동작에 영향을 주지 않습니다.
    }
  }, [active]);

  if (!active) return null;

  return (
    <aside aria-label="광고" className="my-8 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3">
      <p className="mb-2 text-xs text-gray-500">광고</p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
