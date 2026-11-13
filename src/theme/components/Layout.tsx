import type { ReactNode } from 'react'
import { ConsentBanner, Link, PoweredBy, PreviewBanner, StoreLogo, useCart, useOffers, useStorefront } from '@dripfunnel/storefront-core/theme'
import { clsx } from 'clsx'
import { Icon } from './Icon'
import { FooterBar } from './FooterBar'
import { FooterGroup } from './interactive/FooterGroup'
import { MenuDrawer } from './interactive/MenuDrawer'
import { WishlistTool } from './interactive/WishlistTool'
import base from '../styles/base.module.css'

export type NavKey = 'spices' | 'snacks' | 'bundles' | 'story' | 'quality'
export type TabKey = 'shop' | 'search' | 'cart' | 'you'
/** Where an inner page's phone back arrow leads. */
export type BackTo = '/' | '/spices/' | '/snacks/'

const Announce = () => {
  const { t } = useStorefront()
  const { offers } = useOffers()
  const items = [...offers.filter((o) => o.appliesTo !== 'products').map((o) => o.name), t('common.announce.cod'), t('common.announce.fssai'), t('common.announce.gst'), t('common.announce.ships')]
  const list = (copy: boolean) => (
    <ul className={clsx(base.announceList, copy && base.announceCopy)} aria-hidden={copy ? 'true' : undefined}>
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className={base.announceItem}>
          {item}
          <span className={base.announceDot} />
        </li>
      ))}
    </ul>
  )
  return (
    <div className={base.announce}>
      <div className={base.announceTrack}>
        {list(false)}
        {list(true)}
      </div>
    </div>
  )
}

/**
 * Every page's frame (PDF p2, p13): the turmeric announcement bar, the ink header, the phone tab bar and the footer.
 * A page with a `title` gets the inner phone header (back, title, search, cart); without one, the home header (menu,
 * logo, search, cart). `bar` says the page keeps its own sticky action bar, so the tab bar steps aside for it.
 */
export const Layout = ({ children, title, back = '/', nav, tab = 'shop', bar = false }: { children: ReactNode; title?: string; back?: BackTo; nav?: NavKey; tab?: TabKey | null; bar?: boolean }) => {
  const { store, t, mode, poweredBy } = useStorefront()
  const { count } = useCart()
  const links: { key: NavKey; href: string; label: string }[] = [
    { key: 'spices', href: '/spices/', label: t('common.nav.spices') },
    { key: 'snacks', href: '/snacks/', label: t('common.nav.snacks') },
    { key: 'bundles', href: '/bundles/', label: t('common.nav.bundles') },
    { key: 'story', href: '/our-story/', label: t('common.nav.story') },
    { key: 'quality', href: '/quality/', label: t('common.nav.quality') },
  ]
  const tabs: { key: TabKey; href: string; label: string; icon: 'flame' | 'search' | 'bag' | 'user' }[] = [
    { key: 'shop', href: '/spices/', label: t('common.tabs.shop'), icon: 'flame' },
    { key: 'search', href: '/search/', label: t('common.tabs.search'), icon: 'search' },
    { key: 'cart', href: '/cart/', label: t('common.tabs.cart'), icon: 'bag' },
    { key: 'you', href: '/account/', label: t('common.tabs.you'), icon: 'user' },
  ]
  const cartLabel = count > 0 ? t('common.tools.cartCount', { count }) : t('common.tools.cart')
  const brand = (
    <Link href="/" className={base.brand} aria-label={store.logo ? store.name : undefined}>
      <span className={base.brandName}>
        <StoreLogo className={base.brandLogo} />
      </span>
    </Link>
  )
  const shop = [
    { href: '/spices/', label: t('common.footer.allSpices') },
    { href: '/spices/?shelf=blend', label: t('common.footer.blends') },
    { href: '/spices/?shelf=single', label: t('common.footer.singles') },
    { href: '/snacks/', label: t('common.footer.snacks') },
    { href: '/bundles/', label: t('common.footer.bundles') },
  ]
  const help = [
    { href: '/track-order/', label: t('common.footer.track') },
    { href: '/policies/shipping/', label: t('common.footer.shipping') },
    { href: '/policies/refunds/', label: t('common.footer.returns') },
    { href: '/contact/', label: t('common.footer.contact') },
    { href: '/faqs/', label: t('common.footer.faqs') },
  ]
  const legal = [
    { href: '/policies/privacy/', label: t('common.footer.privacy') },
    { href: '/policies/terms/', label: t('common.footer.terms') },
    { href: '/policies/refunds/', label: t('common.footer.refunds') },
    { href: '/policies/shipping/', label: t('common.footer.shippingPolicy') },
    { href: '/fssai-labelling/', label: t('common.footer.fssai') },
  ]
  return (
    <div className={clsx(base.shell, bar && base.withBar, !tab && !bar && base.noTabbar)}>
      {mode === 'live' ? null : <PreviewBanner t={t} className={base.preview} />}
      <Announce />
      <header className={base.header}>
        <div className={base.bar}>
          <div className={base.barStart}>
            <span className={base.mobileOnly}>
              {title ? (
                <Link href={back} className={base.tool}>
                  <Icon name="back" />
                  <span className={base.hidden}>{t('common.nav.back')}</span>
                </Link>
              ) : (
                <MenuDrawer />
              )}
            </span>
            <span className={base.desktopOnly}>{brand}</span>
          </div>
          <div className={`${base.barMid} ${base.mobileOnly}`}>{title ? <p className={base.pageName}>{title}</p> : brand}</div>
          <nav className={base.nav} aria-label={t('common.nav.label')}>
            {links.map((l) => (
              <span key={l.key} className={l.key === nav ? base.navOn : undefined} aria-current={l.key === nav ? 'page' : undefined}>
                <Link href={l.href} className={base.navLink}>
                  {l.label}
                </Link>
              </span>
            ))}
          </nav>
          <div className={base.barEnd}>
            <Link href="/search/" className={base.tool}>
              <Icon name="search" />
              <span className={base.hidden}>{t('common.tools.search')}</span>
            </Link>
            <WishlistTool />
            <span className={base.desktopOnly}>
              <Link href="/account/" className={base.tool}>
                <Icon name="user" />
                <span className={base.hidden}>{t('common.tools.account')}</span>
              </Link>
            </span>
            <span className={base.mobileOnly}>
              <Link href="/cart/" className={base.tool}>
                <Icon name="bag" />
                <span className={base.hidden}>{cartLabel}</span>
                {count > 0 ? (
                  <span className={base.toolCount} aria-hidden="true">
                    {count}
                  </span>
                ) : null}
              </Link>
            </span>
            <Link href="/cart/" className={base.cartButton}>
              <Icon name="bag" className={base.iconSmall} />
              <span aria-hidden="true">{count}</span>
              <span className={base.hidden}>{cartLabel}</span>
            </Link>
          </div>
        </div>
      </header>
      <main id="main" className={base.main}>
        {children}
      </main>
      <footer className={base.footer}>
        <div className={base.wrap}>
          <div className={base.footerGrid}>
            <div className={base.footerAbout}>
              {brand}
              <p className={base.footerBlurb}>{t('common.footer.blurb', { city: store.address?.city ?? t('common.footer.cityFallback') })}</p>
              <div className={base.footerChips}>
                <span className={base.outlineChip}>{t('common.facts.fssaiShort')}</span>
                <span className={base.outlineChip}>{t('common.facts.gstin')}</span>
              </div>
            </div>
            <FooterGroup title={t('common.footer.shop')} links={shop} />
            <FooterGroup title={t('common.footer.help')} links={help} />
            <FooterGroup title={t('common.footer.legal')} links={legal} />
          </div>
          <div className={base.footerBase}>
            <ul className={base.footerPay} aria-label={t('common.footer.payLabel')}>
              <li>{t('common.pay.upi')}</li>
              <li>{t('common.pay.cards')}</li>
              <li>{t('common.pay.netbanking')}</li>
              <li>{t('common.pay.cod')}</li>
            </ul>
          </div>
          {poweredBy ? (
            <div className={base.footerCore}>
              <PoweredBy brand={poweredBy} t={t} className={base.footerLink} />
            </div>
          ) : null}
        </div>
        <FooterBar />
      </footer>
      {tab && !bar ? (
        <nav className={base.tabbar} aria-label={t('common.tabs.label')}>
          {tabs.map((item) => (
            <span key={item.key} className={item.key === tab ? base.tabOn : undefined} aria-current={item.key === tab ? 'page' : undefined}>
              <Link href={item.href} className={base.tab}>
                <Icon name={item.icon} />
                {item.label}
                {item.key === 'cart' && count > 0 ? (
                  <span className={base.tabCount} aria-hidden="true">
                    {count}
                  </span>
                ) : null}
              </Link>
            </span>
          ))}
        </nav>
      ) : null}
      <ConsentBanner t={t} className={base.consent} />
    </div>
  )
}
