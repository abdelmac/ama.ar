import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, HeartHandshake, Wheat, MapPin } from 'lucide-react';
import { dictionaries, productImages, type Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/fr';

export function ProductCard({product, lang}: {product: Dictionary['products'][number]; lang: Locale}) {
  return <Link className="product-card" href={`/${lang}/products/${product.id}/`}><div className="product-image"><img src={`/images/${productImages[product.id]}.webp`} alt={product.name} loading="lazy" width="600" height="480"/><span className="product-arrow"><ArrowUpRight size={22} aria-hidden="true"/></span></div><div className="product-copy"><span className="eyebrow">{product.tag}</span><h3>{product.name}</h3><p>{product.description}</p></div></Link>;
}

export function Hero({lang}: {lang: Locale}) {
  const d = dictionaries[lang];
  return <section className="hero container"><div className="hero-content"><p className="eyebrow"><span className="line"/>{d.hero.eyebrow}</p><h1>{d.hero.title}<em>{d.hero.accent}</em></h1><p className="hero-description">{d.hero.description}</p><div className="hero-buttons"><Link className="button" href={`/${lang}/products/`}>{d.hero.primary}<ArrowRight size={18}/></Link><Link className="text-link" href={`/${lang}/story/`}>{d.hero.secondary}<ArrowUpRight size={17}/></Link></div><div className="hero-footnote"><span className="small-line"/>{d.hero.note}</div></div><div className="hero-visual"><img className="hero-photo" src="/images/hero.webp" alt={d.hero.imageAlt} width="900" height="1050" fetchPriority="high"/><div className="hero-label"><Wheat size={29} strokeWidth={1.25}/><span>{d.hero.stamp}</span></div><span className="photo-index">01 / AMAREINE</span></div><a className="scroll-cue" href="#selection"><ArrowDown size={15}/>{d.hero.scroll}</a></section>;
}

export function Values({lang}: {lang: Locale}) {
  const d = dictionaries[lang];
  const icons = [Wheat, MapPin, HeartHandshake];
  return <div className="values-bar"><div className="container values-inner">{d.values.map((value, i) => { const Icon = icons[i]; return <div className="value" key={value.title}><Icon size={29} strokeWidth={1.2}/><div><h2>{value.title}</h2><p>{value.text}</p></div></div>; })}</div></div>;
}

export function Selection({lang}: {lang: Locale}) {
  const d = dictionaries[lang];
  return <section id="selection" className="section container"><div className="section-heading"><div><p className="eyebrow">{d.catalog.eyebrow}</p><h2>{d.catalog.title}<em>{d.catalog.accent}</em></h2></div><Link className="text-link" href={`/${lang}/products/`}>{d.catalog.all}<ArrowRight size={17}/></Link></div><div className="product-grid">{d.products.slice(0,4).map(product => <ProductCard key={product.id} product={product} lang={lang}/>)}</div></section>;
}

export function Story({lang, full = false}: {lang: Locale; full?: boolean}) {
  const d = dictionaries[lang];
  return <section className={`story-section ${full ? 'story-full' : ''}`}><div className="container story-grid"><div className="story-visual"><img src="/images/hands.webp" alt={d.story.imageAlt} width="750" height="880" loading="lazy"/><div className="story-caption">{d.story.caption}</div></div><div className="story-content"><p className="eyebrow">{d.story.eyebrow}</p>{full ? <h1>{d.story.title}<em>{d.story.accent}</em></h1> : <h2>{d.story.title}<em>{d.story.accent}</em></h2>}<p className="story-intro">{d.story.intro}</p><p>{d.story.text}</p>{full && <p>{d.story.closing}</p>}<Link className="text-link" href={`/${lang}/${full ? 'contact' : 'story'}/`}>{full ? d.story.link : d.nav.story}<ArrowUpRight size={18}/></Link></div></div></section>;
}

export function Professional({lang, full = false}: {lang: Locale; full?: boolean}) {
  const d = dictionaries[lang];
  return <section className={`professional-section ${full ? 'professional-full' : 'section'}`}><div className="container"><div className="professional-grid"><div className="professional-content"><p className="eyebrow">{d.professional.eyebrow}</p>{full ? <h1>{d.professional.title}<em>{d.professional.accent}</em></h1> : <h2>{d.professional.title}<em>{d.professional.accent}</em></h2>}<p>{d.professional.text}</p><ul>{d.professional.items.map(item => <li key={item}><Check size={16}/>{item}</li>)}</ul><Link className="button button-gold" href={`/${lang}/contact/?subject=partner`}>{d.professional.button}<ArrowUpRight size={17}/></Link></div><div className="professional-visual"><img src="/images/oven.webp" alt={d.professional.imageAlt} width="750" height="850" loading="lazy"/></div></div>{full && <div className="region-block"><MapPin size={34} strokeWidth={1.2}/><div><p className="eyebrow">{d.professional.region}</p><p>{d.professional.regionText}</p></div><Link className="text-link" href={`/${lang}/contact/?subject=stockist`}>{d.nav.contact}<ArrowRight size={18}/></Link></div>}</div></section>;
}

export function ContactBanner({lang}: {lang: Locale}) {
  const d = dictionaries[lang];
  return <section className="contact-banner container"><Wheat size={43} strokeWidth={1}/><p className="eyebrow">{d.contact.eyebrow}</p><h2>{d.contact.title}<em>{d.contact.accent}</em></h2><Link className="text-link" href={`/${lang}/contact/`}>{d.nav.contact}<ArrowUpRight size={19}/></Link></section>;
}
