'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { dictionaries, type Locale } from '@/lib/i18n';
import { ProductCard } from './sections';

export function Catalog({lang}: {lang: Locale}) {
  const d = dictionaries[lang];
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const normalize = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase(lang);
  const products = d.products.filter(p => (category === 'all' || p.category === category) && normalize(`${p.name} ${p.description}`).includes(normalize(search.trim())));
  return <div className="container catalog-section"><div className="catalog-controls"><div className="filter-tabs" aria-label={d.catalog.all}>{[['all', d.catalog.all], ['bread', d.catalog.bread], ['sweet', d.catalog.sweet]].map(([value, label]) => <button key={value} aria-pressed={category === value} onClick={() => setCategory(value)}>{label}</button>)}</div><label className="search-field"><Search size={19}/><input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder={d.catalog.search} aria-label={d.catalog.search}/></label></div><p className="result-count" aria-live="polite">{products.length} {d.catalog.count}</p><div className="product-grid catalog-grid">{products.map(product => <ProductCard key={product.id} lang={lang} product={product}/>)}</div>{products.length === 0 && <div className="empty-results"><p>{d.catalog.empty}</p><button className="button" onClick={() => {setSearch(''); setCategory('all');}}>{d.catalog.reset}</button></div>}<p className="catalog-note">{d.catalog.note}</p></div>;
}
