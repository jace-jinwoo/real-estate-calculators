import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 정적 내보내기: `npm run build` 결과물이 out/ 디렉터리에 생성됩니다.
  output: 'export',
  // /area/ → out/area/index.html 형태로 생성해 정적 호스팅에서 404를 방지합니다.
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
