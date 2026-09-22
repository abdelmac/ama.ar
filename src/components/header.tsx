'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Globe2, Menu, X } from 'lucide-react';
import { dictionaries, languageNames, locales, type Locale } from '@/lib/i18n';

export function Header({ lang }: { lang: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuButton = useRef<HTMLButtonElement>(null);
  const d = dictionaries[lang];
  useEffect(() => { if (!open) return; const handler = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); menuButton.current?.focus(); } }; document.addEventListener('keydown', handler); return () => document.removeEventListener('keydown', handler); }, [open]);
  const items = [['', d.nav.home], ['products/', d.nav.products], ['story/', d.nav.story], ['professionals/', d.nav.professionals]];
  return <>
    <a className="skip-link" href="#main">{d.nav.skip}</a>
    <div className="announcement"><span className="tiny-star">✳</span>{d.announcement}<span className="tiny-star">✳</span></div>
    <header className="site-header">
      <div className="header-inner container">
        <Link href={`/${lang}/`} className="brand" aria-label={`Amareine — ${d.nav.home}`}><img src="/images/logo.webp" width="53" height="53" alt="" /><span>AMAREINE<small>LE GOÛT DU PARTAGE</small></span></Link>
        <nav className={`main-nav ${open ? 'is-open' : ''}`} id="main-navigation" aria-label={d.nav.open}>
          {items.map(([path, label]) => <Link onClick={() => setOpen(false)} aria-current={pathname === `/${lang}/${path}` || (path && pathname.startsWith(`/${lang}/${path}`)) ? 'page' : undefined} key={path} href={`/${lang}/${path}`}>{label}</Link>)}
          <Link className="mobile-contact" onClick={() => setOpen(false)} href={`/${lang}/contact/`}>{d.nav.contact}</Link>
        </nav>
        <div className="header-actions">
          <div className="language-control"><Globe2 size={16} aria-hidden="true" /><select aria-label={d.nav.language} value={lang} onChange={event => { const tail = pathname.replace(/^\/(fr|ar|de|en)(?=\/|$)/, ''); window.location.assign(`/${event.target.value}${tail || '/'}${window.location.search}${window.location.hash}`); }}>{locales.map(locale => <option lang={locale} key={locale} value={locale}>{languageNames[locale]}</option>)}</select></div>
          <Link className="button button-small header-contact" href={`/${lang}/contact/`}>{d.nav.contact}<ArrowUpRight size={15} aria-hidden="true" /></Link>
          <button ref={menuButton} className="menu-button" aria-expanded={open} aria-controls="main-navigation" aria-label={open ? d.nav.close : d.nav.open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
    </header>
  </>;
}
