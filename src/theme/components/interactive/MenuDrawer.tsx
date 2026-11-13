'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { Link, useOffers, useProducts, useStorefront } from '@dripfunnel/storefront-core/theme'
import { packOf } from '../catalog'
import { dialable, shownPhone } from '../contact'
import { Icon } from '../Icon'
import base from '../../styles/base.module.css'

const Rows = () => {
  const { t } = useStorefront()
  const { products, status } = useProducts({ first: 24 })
  const spices = products.filter((p) => packOf(p.href).shelf !== 'snack').length
  const snacks = products.length - spices
  const counted = status === 'ready'
  const rows = [
    { href: '/spices/', name: t('common.nav.spices'), note: counted ? t('common.menu.products', { count: spices }) : t('common.menu.spicesNote') },
    { href: '/snacks/', name: t('common.nav.snacks'), note: counted ? t('common.menu.products', { count: snacks }) : t('common.menu.snacksNote') },
    { href: '/bundles/', name: t('common.nav.bundlesKits'), note: t('common.menu.bundlesNote') },
    { href: '/our-story/', name: t('common.nav.story'), note: null },
    { href: '/quality/', name: t('common.nav.quality'), note: null },
    { href: '/track-order/', name: t('common.nav.track'), note: null },
    { href: '/contact/', name: t('common.nav.contact'), note: null },
  ]
  return (
    <ul className={base.drawerRows}>
      {rows.map((r) => (
        <li key={r.href}>
          <Link href={r.href} className={base.drawerRow}>
            <span>
              <span className={base.drawerName}>{r.name}</span>
              {r.note ? <span className={base.drawerNote}>{r.note}</span> : null}
            </span>
            <Icon name="arrow" />
          </Link>
        </li>
      ))}
    </ul>
  )
}

/** The phone menu (PDF p3): a full-screen ink panel; Escape, the close button and any link close it. */
export const MenuDrawer = () => {
  const { store, t } = useStorefront()
  const { offers } = useOffers()
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const close = useRef<HTMLButtonElement>(null)
  const heading = useId()
  const wasOpen = useRef(false)
  useEffect(() => {
    if (open) close.current?.focus()
    else if (wasOpen.current) toggle.current?.focus()
    wasOpen.current = open
  }, [open])
  const keys = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') setOpen(false)
  }
  const offer = offers[0] ?? null
  const phone = store.contactPhone
  return (
    <>
      <button ref={toggle} type="button" className={base.tool} aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(true)}>
        <Icon name="menu" />
        <span className={base.hidden}>{t('common.nav.menu')}</span>
      </button>
      {open ? (
        <div id="site-menu" className={base.drawer} role="dialog" aria-modal="true" aria-labelledby={heading} onKeyDown={keys}>
          <span className={base.guard} tabIndex={0} onFocus={() => close.current?.focus()} />
          <div className={base.drawerHead}>
            <Link href="/" className={base.brand}>
              <span id={heading} className={base.brandName}>
                {store.name}
              </span>
              <span className={base.brandTelugu} lang="te">
                {t('common.brand.telugu')}
              </span>
            </Link>
            <button ref={close} type="button" className={base.tool} onClick={() => setOpen(false)}>
              <Icon name="close" />
              <span className={base.hidden}>{t('common.nav.close')}</span>
            </button>
          </div>
          <nav aria-label={t('common.nav.label')}>
            <Rows />
          </nav>
          {offer ? (
            <div className={base.drawerPromo}>
              <p className={base.small}>{offer.name}</p>
              {offer.description ? <p className={base.meta}>{offer.description}</p> : null}
            </div>
          ) : (
            <div className={base.drawerPromo}>
              <p className={base.small}>{t('common.menu.promoTitle')}</p>
              <p>{t('common.menu.promoLead')}</p>
            </div>
          )}
          <div className={base.drawerActions}>
            <Link href="/sign-in/" className={base.ghostOnInk}>
              {t('common.menu.signIn')}
            </Link>
            <Link href="/register/" className={base.white}>
              {t('common.menu.register')}
            </Link>
          </div>
          <div className={base.drawerFacts}>
            {phone ? <Link href={t('common.contact.callHref', { phone: dialable(phone) })}>{shownPhone(phone)}</Link> : null}
            <p>{t('common.contact.hours')}</p>
            <p>{t('common.facts.fssai')}</p>
            <p>{t('common.facts.gstin')}</p>
          </div>
          <span className={base.guard} tabIndex={0} onFocus={() => close.current?.focus()} />
        </div>
      ) : null}
    </>
  )
}
