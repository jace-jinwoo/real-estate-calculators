import type { MetadataRoute } from 'next';
import { TOOLS } from '@/data/tools';
import { absoluteUrl, LAST_UPDATED, STATIC_PATHS } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPaths = TOOLS.map((t) => `/${t.slug}/`);
  return [...STATIC_PATHS, ...toolPaths].map((path) => ({
    url: absoluteUrl(path),
    lastModified: LAST_UPDATED,
    changeFrequency: path === '/' || toolPaths.includes(path) ? 'monthly' : 'yearly',
    priority: path === '/' ? 1 : toolPaths.includes(path) ? 0.8 : 0.4,
  }));
}
