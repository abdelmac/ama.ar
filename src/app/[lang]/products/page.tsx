import { notFound } from 'next/navigation';
import { Catalog } from '@/components/catalog';
import { dictionaries, isLocale, localizedMetadata } from '@/lib/i18n';
export async function generateMetadata({params}: {params: Promise<{lang: string}>}) {const {lang} = await params; if(!isLocale(lang)) notFound(); return localizedMetadata(lang, 'products', dictionaries[lang].nav.products);}
export default async function Products({params}: {params: Promise<{lang: string}>}) {const {lang} = await params; if(!isLocale(lang)) notFound(); const d=dictionaries[lang]; return <><section className="page-heading container"><p className="eyebrow">{d.catalog.eyebrow}</p><h1>{d.catalog.title}<em>{d.catalog.accent}</em></h1><p>{d.catalog.description}</p></section><Catalog lang={lang}/></>;}
