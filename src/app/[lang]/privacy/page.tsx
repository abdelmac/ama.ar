import { notFound } from 'next/navigation';
import { dictionaries, isLocale, localizedMetadata } from '@/lib/i18n';
export async function generateMetadata({params}: {params: Promise<{lang: string}>}) {const {lang} = await params; if(!isLocale(lang)) notFound(); return localizedMetadata(lang, 'privacy', dictionaries[lang].privacy.title);}
export default async function Privacy({params}: {params: Promise<{lang: string}>}) {const {lang}=await params; if(!isLocale(lang)) notFound(); const d=dictionaries[lang];return <article className="container privacy-page"><h1>{d.privacy.title}</h1><p className="lead">{d.privacy.intro}</p>{d.privacy.sections.map(section=><section key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}</article>;}
