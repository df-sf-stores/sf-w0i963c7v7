import type { ReactNode } from 'react'
import { ConsentBanner, Link, PoweredBy, PreviewBanner, useCart, useStorefront } from '@dripfunnel/storefront-core/theme'
import { FooterBar } from './FooterBar'
import { Icon } from './Icon'
import base from '../styles/base.module.css'
import cartStyles from '../styles/cart.module.css'

/**
 * Checkout's own frame (PDF p8, p17): the ink bar with the shop's name, the secure note and the way back to the cart, and
 * the 1 Cart, 2 Delivery, 3 Pay stepper. No menu and no tab bar, so nothing stacks over the payment.
 */
export const CheckoutLayout = ({ children }: { children: ReactNode }) => {
  const { store, t, mode, poweredBy } = useStorefront()
  const { cart } = useCart()
  const paying = cart?.step === 'pay'
  const steps = [
    { label: t('shop.checkout.stepCart'), on: false },
    { label: t('shop.checkout.stepDelivery'), on: !paying },
    { label: t('shop.checkout.stepPay'), on: paying },
  ]
  return (
    <div className={base.shell}>
      {mode === 'live' ? null : <PreviewBanner t={t} className={base.preview} />}
      <header className={cartStyles.checkoutHeader}>
        <div className={cartStyles.checkoutBar}>
          <Link href="/cart/" className={cartStyles.backLink}>
            <Icon name="back" className={base.iconSmall} />
            {t('shop.checkout.backToCart')}
          </Link>
          <Link href="/" className={base.brand}>
            <span className={base.brandName}>{store.name}</span>
          </Link>
          <p className={cartStyles.secureNote}>
            <Icon name="lock" className={base.iconSmall} />
            {t('shop.checkout.secure')}
          </p>
        </div>
        <ol className={cartStyles.stepper3} aria-label={t('shop.checkout.steps')}>
          {steps.map((s, i) => (
            <li key={s.label} className={s.on ? cartStyles.stepItemOn : cartStyles.stepItem} aria-current={s.on ? 'step' : undefined}>
              {i > 0 ? <span className={cartStyles.stepRule} aria-hidden="true" /> : null}
              <span className={cartStyles.stepNum}>{i === 0 ? <Icon name="check" className={base.iconSmall} /> : String(i + 1)}</span>
              {s.label}
            </li>
          ))}
        </ol>
      </header>
      <main id="main" className={base.main}>
        {children}
      </main>
      <footer className={cartStyles.checkoutFooter}>
        <p className={cartStyles.checkoutLinks}>
          <Link href="/policies/terms/">{t('common.footer.terms')}</Link>
          <Link href="/policies/privacy/">{t('common.footer.privacy')}</Link>
          <Link href="/policies/refunds/">{t('common.footer.refunds')}</Link>
          <Link href="/policies/shipping/">{t('common.footer.shippingPolicy')}</Link>
        </p>
        {poweredBy ? (
          <div className={base.footerCore}>
            <PoweredBy brand={poweredBy} t={t} className={base.footerLink} />
          </div>
        ) : null}
        <FooterBar className={cartStyles.checkoutBase} />
      </footer>
      <ConsentBanner t={t} className={base.consent} />
    </div>
  )
}
