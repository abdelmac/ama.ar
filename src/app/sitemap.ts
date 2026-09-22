import type { MetadataRoute } from 'next';
import { dictionaries, locales, origin } from '@/lib/i18n';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap { const pages=['','products/','story/','professionals/','contact/','privacy/',...dictionaries.fr.products.map(p=>`products/${p.id}/`)];return locales.flatMap(lang=>pages.map(path=>({url:`${origin}/${lang}/${path}`,alternates:{languages:Object.fromEntries(locales.map(l=>[l,`${origin}/${l}/${path}`]))},changeFrequency:'monthly' as const,priority:path ? 0.7 : 1})));}
