'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { ArrowUpRight, CheckCircle2, LoaderCircle } from 'lucide-react';
import { business, dictionaries, type Locale } from '@/lib/i18n';

export function ContactForm({lang}: {lang: Locale}) {
  const d = dictionaries[lang];
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [subject, setSubject] = useState('0');
  const [product, setProduct] = useState('');
  useEffect(() => { const params = new URLSearchParams(window.location.search); setSubject(params.get('subject') === 'partner' ? '1' : params.get('subject') === 'stockist' ? '2' : '0'); const found = d.products.find(item => item.id === params.get('product')); if (found) setProduct(found.name); }, [d]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get('_gotcha')) return;
    setStatus('sending');
    try { const response = await fetch('https://formspree.io/f/xqkrbyba', { method: 'POST', body: data, headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(20000) }); if (!response.ok) throw new Error('Delivery failed'); setStatus('success'); form.reset(); } catch { setStatus('error'); }
  }
  return <form className="contact-form" action="https://formspree.io/f/xqkrbyba" method="POST" onSubmit={submit} aria-busy={status === 'sending'}><p className="form-required">{d.contact.required}</p><div className="form-row"><label>{d.contact.name} *<input name="Name" autoComplete="name" required maxLength={120}/></label><label>{d.contact.emailLabel} *<input name="Email" type="email" autoComplete="email" required maxLength={254}/></label></div><label>{d.contact.company}<input name="company" autoComplete="organization" maxLength={160}/></label><label>{d.contact.subject}<select name="request_type" value={subject} onChange={e => setSubject(e.target.value)}>{d.contact.subjects.map((item, index) => <option key={item} value={index}>{item}</option>)}</select></label><input type="hidden" name="subject" value="Amareine.com"/><input type="hidden" name="subject_label" value={d.contact.subjects[Number(subject)]}/><input type="hidden" name="language" value={lang}/>{product && <input type="hidden" name="product" value={product}/>}<label>{d.contact.message} *<textarea name="Message" required minLength={10} maxLength={5000} rows={5} placeholder={d.contact.placeholder}/></label><div className="honeypot" aria-hidden="true"><label>Leave empty<input name="_gotcha" tabIndex={-1} autoComplete="off"/></label></div><label className="consent"><input name="consent" type="checkbox" required/><span>{d.contact.consent} <Link href={`/${lang}/privacy/`}>{d.contact.privacyLink}</Link></span></label><button className="button" type="submit" disabled={status === 'sending'}>{status === 'sending' ? d.contact.sending : d.contact.submit}{status === 'sending' ? <LoaderCircle className="spinner" size={18}/> : <ArrowUpRight size={18}/>}</button><div role="status" aria-live="polite">{status === 'success' && <p className="form-success"><CheckCircle2 size={20}/>{d.contact.success}</p>}</div>{status === 'error' && <p className="form-error" role="alert">{d.contact.error}</p>}<p className="form-fallback">{d.contact.fallback} <a href={`mailto:${business.email}`}>{d.contact.emailAction}</a></p></form>;
}
