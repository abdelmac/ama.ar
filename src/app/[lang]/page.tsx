import { notFound } from 'next/navigation';
import { Hero, Values, Selection, Story, Professional, ContactBanner } from '@/components/sections';
import { business, isLocale, origin } from '@/lib/i18n';

export default async function Home({params}: {params: Promise<{lang: string}>}) { const {lang} = await params; if (!isLocale(lang)) notFound(); const structured = {'@context':'https://schema.org','@type':'Bakery',name:'Amareine',url:origin,telephone:business.tel,email:business.email,image:`${origin}/images/hero.webp`,address:{'@type':'PostalAddress',streetAddress:'12 Rue du Stade',postalCode:'57730',addressLocality:'Folschviller',addressCountry:'FR'},sameAs:[business.instagram,business.facebook]}; return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured).replace(/</g,'\\u003c')}}/><Hero lang={lang}/><Values lang={lang}/><Selection lang={lang}/><Story lang={lang}/><Professional lang={lang}/><ContactBanner lang={lang}/></>; }
