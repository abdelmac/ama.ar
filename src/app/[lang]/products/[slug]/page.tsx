import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Utensils } from 'lucide-react';
import { dictionaries, isLocale, localizedMetadata, productImages } from '@/lib/i18n';
export function generateStaticParams() {return dictionaries.fr.products.map(p => ({slug:p.id}));}
export const dynamicParams=false;
type Params = {params:Promise<{lang:string;slug:string}>};
export async function generateMetadata({params}:Params) {const {lang,slug}=await params; if(!isLocale(lang)) notFound(); const p=dictionaries[lang].products.find(p=>p.id===slug); if(!p) notFound(); return localizedMetadata(lang,`products/${slug}`,p.name,p.description);}
export default async function Product({params}:Params) {const {lang,slug}=await params; if(!isLocale(lang)) notFound(); const d=dictionaries[lang];const p=d.products.find(p=>p.id===slug); if(!p) notFound(); return <section className="container product-detail"><Link className="text-link back-link" href={`/${lang}/products/`}><ArrowLeft size={17}/>{d.catalog.back}</Link><div className="product-detail-grid"><img className="detail-image" src={`/images/${productImages[slug]}`} alt={p.name} width="750" height="850" fetchPriority="high"/><div className="detail-copy"><p className="eyebrow">{p.tag}</p><h1>{p.name}</h1><p className="lead">{p.description}</p><h2>{d.catalog.details}</h2><p>{p.details}</p><div className="serving"><Utensils size={22}/><div><h2>{d.catalog.serving}</h2><p>{p.serving}</p></div></div><Link className="button" href={`/${lang}/contact/?product=${p.id}`}>{d.catalog.ask}<ArrowUpRight size={18}/></Link><p className="catalog-note">{d.catalog.note}</p></div></div></section>;}
