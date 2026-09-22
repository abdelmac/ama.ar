import { notFound } from 'next/navigation';
import { Professional, ContactBanner } from '@/components/sections';
import { dictionaries, isLocale, localizedMetadata } from '@/lib/i18n';
export async function generateMetadata({params}: {params: Promise<{lang: string}>}) {const {lang} = await params; if(!isLocale(lang)) notFound(); return localizedMetadata(lang, 'professionals', dictionaries[lang].nav.professionals);}
export default async function Professionals({params}: {params: Promise<{lang: string}>}) {const {lang}=await params; if(!isLocale(lang)) notFound();return <><Professional lang={lang} full/><ContactBanner lang={lang}/></>;}
