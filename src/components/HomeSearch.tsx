'use client';

import Link from 'next/link';
import { useId, useMemo, useState } from 'react';

export interface SearchItem {
  slug: string;
  name: string;
  shortDescription: string;
  category: string;
  categoryLabel: string;
  keywords: string[];
}

export default function HomeSearch({ items, categories }: { items: SearchItem[]; categories: { id: string; label: string }[] }) {
  const uid = useId();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (category !== 'all' && i.category !== category) return false;
      if (!q) return true;
      return (
        i.name.toLowerCase().includes(q) ||
        i.shortDescription.toLowerCase().includes(q) ||
        i.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [items, query, category]);

  return (
    <section aria-labelledby={`${uid}-h`}>
      <h2 id={`${uid}-h`} className="text-xl font-semibold text-gray-900">도구 검색</h2>
      <label htmlFor={`${uid}-q`} className="sr-only">도구 검색어</label>
      <input
        id={`${uid}-q`}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="예: 평, 인치, JSON, 신발"
        className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="카테고리 필터">
        {[{ id: 'all', label: '전체' }, ...categories].map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={category === c.id}
            onClick={() => setCategory(c.id)}
            className={`rounded-full border px-3 py-1 text-sm ${
              category === c.id ? 'border-brand-600 bg-brand-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-brand-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm text-gray-500" aria-live="polite">
        {results.length === 0 ? '검색 결과가 없습니다. 다른 검색어를 입력해 보세요.' : `${results.length}개의 도구`}
      </p>

      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {results.map((t) => (
          <li key={t.slug}>
            <Link href={`/${t.slug}/`} className="block h-full rounded-lg border border-gray-200 p-4 hover:border-brand-600 hover:bg-brand-50">
              <span className="text-xs font-medium text-brand-700">{t.categoryLabel}</span>
              <span className="mt-1 block font-semibold text-gray-900">{t.name}</span>
              <span className="mt-1 block text-sm text-gray-600">{t.shortDescription}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
