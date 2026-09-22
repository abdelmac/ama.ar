import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/cormorant-garamond/latin-500-italic.css';
import '@fontsource/noto-sans-arabic/arabic-400.css';
import '@fontsource/noto-sans-arabic/arabic-600.css';
import '../globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { isLocale, locales, localizedMetadata } from '@/lib/i18n';

export function generateStaticParams() { return locales.map(lang => ({lang})); }
export const dynamicParams = false;
export async function generateMetadata({params}: {params: Promise<{lang: string}>}): Promise<Metadata> { const {lang} = await params; if (!isLocale(lang)) notFound(); return {...localizedMetadata(lang), icons: {icon:'/images/favicon.png', apple:'/images/apple-touch-icon.png'}}; }
export default async function LocaleLayout({children, params}: {children: React.ReactNode; params: Promise<{lang: string}>}) { const {lang} = await params; if (!isLocale(lang)) notFound(); return <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}><body><Header lang={lang}/><main id="main">{children}</main><Footer lang={lang}/></body></html>; }
