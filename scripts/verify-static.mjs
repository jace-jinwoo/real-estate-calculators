// 정적 빌드(out/) 검증: 필수 파일, 메타데이터, 내부 링크, sitemap 경로.
// 사용: npm run build && npm run verify
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const OUT = 'out';
const REQUIRED_PAGES = [
  '/', '/about/', '/guide/', '/privacy/', '/terms/', '/contact/',
  '/area/', '/length/', '/weight/', '/temperature/',
  '/shoe-size/', '/clothing-size/', '/base64/', '/json-formatter/',
];
const REQUIRED_FILES = ['robots.txt', 'sitemap.xml', '404.html', 'icon.svg'];

const errors = [];
const fail = (msg) => errors.push(msg);

if (!existsSync(OUT)) {
  console.error('out/ 디렉터리가 없습니다. 먼저 `npm run build` 를 실행하세요.');
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk(OUT);
const htmlFiles = files.filter((f) => f.endsWith('.html'));

for (const f of REQUIRED_FILES) if (!existsSync(join(OUT, f))) fail(`필수 파일 누락: ${f}`);
for (const p of REQUIRED_PAGES) if (!existsSync(join(OUT, p, 'index.html'))) fail(`필수 페이지 누락: ${p}`);

function resolves(urlPath) {
  const clean = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  if (clean === '' || clean === '/') return existsSync(join(OUT, 'index.html'));
  const target = join(OUT, clean);
  if (clean.endsWith('/')) return existsSync(join(target, 'index.html'));
  if (extname(clean)) return existsSync(target);
  return existsSync(join(target, 'index.html')) || existsSync(`${target}.html`);
}

let linkCount = 0;
const titles = new Map();
const descriptions = new Map();

for (const file of htmlFiles) {
  const rel = relative(OUT, file);
  const html = readFileSync(file, 'utf8');

  for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    const url = m[1];
    if (url.startsWith('//')) continue;
    linkCount++;
    if (!resolves(url)) fail(`깨진 내부 링크: ${rel} → ${url}`);
  }

  if (rel === '404.html') continue;

  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1];
  const desc = /<meta name="description" content="([^"]*)"/.exec(html)?.[1];
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
  const og = /<meta property="og:title"/.test(html);
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;

  if (!title) fail(`title 누락: ${rel}`);
  if (!desc) fail(`description 누락: ${rel}`);
  if (!canonical) fail(`canonical 누락: ${rel}`);
  if (!og) fail(`og:title 누락: ${rel}`);
  if (h1Count !== 1) fail(`h1 은 정확히 1개여야 합니다 (${h1Count}개): ${rel}`);
  if (!html.includes('<html lang="ko"')) fail(`lang="ko" 누락: ${rel}`);

  if (title) titles.set(title, [...(titles.get(title) || []), rel]);
  if (desc) descriptions.set(desc, [...(descriptions.get(desc) || []), rel]);
}

for (const [t, list] of titles) if (list.length > 1) fail(`중복 title "${t}": ${list.join(', ')}`);
for (const [d, list] of descriptions) if (list.length > 1) fail(`중복 description: ${list.join(', ')}`);

// sitemap 의 모든 URL 이 실제 페이지와 일치하는지, 필수 페이지가 모두 포함되는지
if (existsSync(join(OUT, 'sitemap.xml'))) {
  const xml = readFileSync(join(OUT, 'sitemap.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  for (const p of locs) if (!resolves(p)) fail(`sitemap 의 경로가 존재하지 않음: ${p}`);
  for (const p of REQUIRED_PAGES) if (!locs.includes(p)) fail(`sitemap 에 누락: ${p}`);
}

if (existsSync(join(OUT, 'robots.txt'))) {
  const robots = readFileSync(join(OUT, 'robots.txt'), 'utf8');
  if (!/Sitemap:\s*\S+\/sitemap\.xml/.test(robots)) fail('robots.txt 에 Sitemap 항목이 없습니다.');
}

// 승인 전 광고 노출 방지: AdSense 스크립트/ins 태그가 없어야 함 (ADS 활성화 빌드에서는 건너뜀)
if (process.env.NEXT_PUBLIC_ADSENSE_ENABLED !== 'true') {
  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    if (html.includes('adsbygoogle') || html.includes('googlesyndication')) {
      fail(`광고 비활성 빌드에 광고 코드가 포함됨: ${relative(OUT, file)}`);
    }
  }
}

console.log(`HTML 페이지 ${htmlFiles.length}개, 내부 링크/리소스 ${linkCount}개 검사`);
if (errors.length > 0) {
  console.error(`\n검증 실패 (${errors.length}건):`);
  for (const e of errors) console.error(` - ${e}`);
  process.exit(1);
}
console.log('정적 빌드 검증 통과');
