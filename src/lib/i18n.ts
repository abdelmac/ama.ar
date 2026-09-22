import { fr } from './fr';
import { en } from './en';
import { de } from './de';
import { ar } from './ar';
import type { Metadata } from 'next';

export const locales = ['fr', 'ar', 'de', 'en'] as const;
export type Locale = (typeof locales)[number];
export const languageNames = { fr: 'Français', ar: 'العربية', de: 'Deutsch', en: 'English' };
export const dictionaries = { fr, ar, de, en };
export function isLocale(value: string): value is Locale { return locales.includes(value as Locale); }
export const origin = 'https://amareine.com';
export const business = { phone: '+33 3 57 85 02 34', tel: '+33357850234', email: 'amareine.europe@gmail.com', address: '12 Rue du Stade, 57730 Folschviller', instagram: 'https://www.instagram.com/amarein.europe/', facebook: 'https://www.facebook.com/profile.php?id=61553700205864' };
export function localizedMetadata(lang: Locale, path = '', title?: string, description?: string): Metadata {
  const d = dictionaries[lang];
  const url = `${origin}/${lang}/${path ? `${path}/` : ''}`;
  return {
    title: title ? `${title} — Amareine` : d.meta.title,
    description: description ?? d.meta.description,
    alternates: { canonical: url, languages: { ...Object.fromEntries(locales.map(locale => [locale, `${origin}/${locale}/${path ? `${path}/` : ''}`])), 'x-default': `${origin}/fr/${path ? `${path}/` : ''}` } },
    openGraph: { type: 'website', siteName: 'Amareine', locale: {fr:'fr_FR',ar:'ar',de:'de_DE',en:'en_GB'}[lang], title: title ?? d.meta.title, description: description ?? d.meta.description, url, images: [{ url: `${origin}/images/mezze.webp`, width: 1200, height: 800, alt: d.hero.imageAlt }] },
    twitter: { card: 'summary_large_image', title: title ?? d.meta.title, description: description ?? d.meta.description, images: [`${origin}/images/mezze.webp`] },
  };
}
export const productImages: Record<string, string> = {
  'pain-alepin': 'pita.webp', 'pain-orge': 'bread-basket.webp', kaak: 'sesame.svg', maamoul: 'maamoul.webp', croissant: 'croissant.svg', 'pain-sandwich': 'sandwich.svg',
};
