import { notFound } from 'next/navigation';
import { Story, Values, ContactBanner } from '@/components/sections';
import { dictionaries, isLocale, localizedMetadata } from '@/lib/i18n';
export async function generateMetadata({params}: {params: Promise<{lang: string}>}) {const {lang} = await params; if(!isLocale(lang)) notFound(); return localizedMetadata(lang, 'story', dictionaries[lang].nav.story);}
export default async function StoryPage({params}: {params: Promise<{lang: string}>}) {const {lang}=await params; if(!isLocale(lang)) notFound();return <><Story lang={lang} full/><Values lang={lang}/><ContactBanner lang={lang}/></>;}
