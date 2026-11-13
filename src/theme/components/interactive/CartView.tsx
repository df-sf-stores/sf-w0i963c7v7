'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import { CodeField, EditAnswers, Image, LineAnswers, Link, OrderSummary, Price, useCart, useOffers, useProductCards, useStorefront, type CartLine } from '@dripfunnel/storefront-core/theme'
import { packOf, slugOf, staples, starterBox, teluguKey } from '../catalog'
import { Icon } from '../Icon'
import { Notice } from '../Notice'
import { familyClass } from '../ProductCard'
import { QuickAdd } from './QuickAdd'
import { Retry } from './Retry'
import base from '../../styles/base.module.css'
import cartStyles from '../../styles/cart.module.css'

// The packs worth suggesting beside a basket, in the order the shelf leads with them.
const suggestions = [...new Set([...staples, ...starterBox, 'coriander-powder', 'chicken-masala', 'mutton-masala'])]

/** The cart (PDF p7, p16): its lines, a turmeric suggestion, and the ink summary the engine prices, offers included. */
export const CartView = () => {
  const { store, locale, t } = useStorefront()
  const page = useCart()
  const { offers } = useOffers()
  const ideas = useProductCards(suggestions)
  const [codeNote, setCodeNote] = useState<{ words: string; refused: boolean } | null>(null)
  const codeWord = (state: string) =>
    state === 'APPLIED'
      ? t('shop.cart.codes.applied')
      : state === 'NOT_ELIGIBLE'
        ? t('shop.cart.codes.notEligible')
        : state === 'DOESNT_COMBINE'
          ? t('shop.cart.codes.doesntCombine')
          : state === 'SIGN_IN_REQUIRED'
            ? t('shop.cart.codes.signIn')
            : state === 'EXPIRED'
              ? t('shop.cart.codes.expired')
              : state === 'USED_UP'
                ? t('shop.cart.codes.usedUp')
                : state === 'ALREADY_USED'
                  ? t('shop.cart.codes.alreadyUsed')
                  : t('shop.cart.codes.invalid')
  const problemWords = (line: CartLine) =>
    line.problem === 'short' && line.available !== null ? t('shop.cart.problems.short', { count: line.available }) : line.problem === 'not_sold_here' ? t('shop.cart.problems.notSoldHere') : line.problem === 'check_answers' ? t('shop.cart.problems.checkAnswers') : line.problem ? t('shop.cart.problems.unavailable') : null

  if (page.status === 'loading') {
    return (
      <section className={clsx(base.wrap, cartStyles.page)} aria-busy="true">
        <h1 className={base.pageTitle}>{t('shop.cart.title')}</h1>
        <p className={base.meta}>{t('shop.cart.loading')}</p>
      </section>
    )
  }
  if (page.status === 'error') {
    return (
      <Notice main title={t('shop.cart.failed')} lead={t('shop.listing.failedLead')}>
        <Retry label={t('shop.listing.retry')} onRetry={page.retry} />
      </Notice>
    )
  }
  const cart = page.cart
  if (!cart || cart.lines.length === 0) {
    return (
      <Notice main title={t('shop.cart.empty')} lead={t('shop.cart.emptyLead')}>
        <Link href="/spices/" className={base.button}>
          {t('catalog.shelf.backToShelf')}
          <Icon name="arrow" className={base.iconSmall} />
        </Link>
        <Link href="/bundles/" className={base.secondary}>
          {t('common.nav.bundles')}
        </Link>
      </Notice>
    )
  }
  const blocked = cart.lines.some((l) => l.problem !== null)
  const inCart = new Set(cart.lines.map((l) => slugOf(l.href)))
  const next = ideas.cards.find((c) => !inCart.has(slugOf(c.href))) ?? null
  const lastAdded = cart.lines[cart.lines.length - 1] ?? null
  const offer = offers.find((o) => o.appliesTo !== 'shipping') ?? null
  const checkout = blocked ? (
    <button type="button" className={clsx(base.button, base.full)} disabled>
      {t('shop.cart.checkout')}
    </button>
  ) : (
    <Link href="/checkout/" className={clsx(base.button, base.full)}>
      {t('shop.cart.checkout')}
      <Icon name="arrow" className={base.iconSmall} />
    </Link>
  )
  return (
    <section className={clsx(base.wrap, cartStyles.page)}>
      <header className={cartStyles.head}>
        <h1 className={base.pageTitle}>{t('shop.cart.title')}</h1>
        <p className={base.meta}>{t('shop.cart.countLine', { count: cart.count, city: store.address?.city ?? '' })}</p>
      </header>
      {page.error ? (
        <p className={cartStyles.alert} role="alert">
          {t('shop.cart.changeFailed')}
        </p>
      ) : null}
      <div className={cartStyles.layout}>
        <div className={cartStyles.main}>
          <ul className={cartStyles.lines}>
            {cart.lines.map((line) => {
              const pack = packOf(line.href)
              return (
                <li key={line.versionId} className={clsx(cartStyles.line, line.pending && cartStyles.pending)}>
                  <span className={clsx(cartStyles.thumb, familyClass[pack.family])}>
                    {line.photo ? <Image image={line.photo} alt={line.name} ratio={0.75} sizes="96px" /> : null}
                  </span>
                  <div className={cartStyles.info}>
                    <div className={cartStyles.top}>
                      <div>
                        {pack.slug ? (
                          <p className={cartStyles.telugu} lang="te">
                            {t(teluguKey[pack.slug])}
                          </p>
                        ) : null}
                        {line.href ? (
                          <Link href={line.href} className={cartStyles.name}>
                            {line.name}
                          </Link>
                        ) : (
                          <p className={cartStyles.name}>{line.name}</p>
                        )}
                        <p className={base.meta}>{line.versionName ?? t('catalog.card.weight')}</p>
                      </div>
                      {line.lineTotal ? <Price money={line.lineTotal} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={cartStyles.price} /> : null}
                    </div>
                    <LineAnswers line={line} className={base.meta} />
                    <EditAnswers line={line} className={cartStyles.remove} />
                    {line.gift ? <p className={base.meta}>{t('shop.cart.giftFor', { name: line.gift.recipientName, email: line.gift.recipientEmail })}</p> : null}
                    {problemWords(line) ? <p className={cartStyles.problem}>{problemWords(line)}</p> : null}
                    <div className={cartStyles.actions}>
                      <div className={cartStyles.stepper} role="group" aria-label={t('shop.cart.quantity', { name: line.name })}>
                        <button type="button" className={cartStyles.step} disabled={line.quantity <= 1} onClick={() => void page.setQuantity(line.versionId, line.quantity - 1)}>
                          <Icon name="minus" className={base.iconSmall} />
                          <span className={base.hidden}>{t('shop.cart.less')}</span>
                        </button>
                        <span className={cartStyles.quantity} aria-live="polite">
                          {line.quantity}
                        </span>
                        <button type="button" className={cartStyles.step} onClick={() => void page.setQuantity(line.versionId, line.quantity + 1)}>
                          <Icon name="plus" className={base.iconSmall} />
                          <span className={base.hidden}>{t('shop.cart.more')}</span>
                        </button>
                      </div>
                      <button type="button" className={cartStyles.remove} aria-label={t('shop.cart.removeNamed', { name: line.name })} onClick={() => void page.remove(line.versionId)}>
                        {t('shop.cart.remove')}
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
          {next ? (
            <div className={cartStyles.upsell}>
              <div className={cartStyles.upsellText}>
                <p className={base.label}>{offer ? offer.name : t('shop.cart.upsellEyebrow')}</p>
                <p className={base.cardTitle}>{lastAdded ? t('shop.cart.upsellWith', { bought: lastAdded.name, next: next.name }) : t('shop.cart.upsellPlain', { next: next.name })}</p>
                {next.price ? <Price money={next.price} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={cartStyles.upsellPrice} /> : null}
              </div>
              <QuickAdd href={next.href} name={next.name} inStock={next.stock.inStock} />
            </div>
          ) : null}
        </div>
        <aside className={cartStyles.side} aria-labelledby="cart-summary">
          <h2 id="cart-summary" className={base.small}>
            {t('shop.cart.summary')}
          </h2>
          <OrderSummary cart={cart} at="cart" locale={locale} t={t} className={cartStyles.summary} />
          <p className={cartStyles.gst}>{t('shop.cart.gstIncluded')}</p>
          <CodeField
            label={t('shop.cart.code')}
            button={t('shop.cart.apply')}
            message={codeNote?.words ?? null}
            refused={codeNote?.refused ?? false}
            className={cartStyles.code}
            onApply={async (code) => {
              const state = await page.applyCode(code)
              setCodeNote({ words: state ? codeWord(state) : t('shop.cart.changeFailed'), refused: state !== 'APPLIED' })
              return state === 'APPLIED'
            }}
          />
          {cart.codes.length ? (
            <ul className={cartStyles.codes}>
              {cart.codes.map((c) => (
                <li key={c.code} className={cartStyles.codeChip}>
                  <span>{c.code}</span>
                  <button type="button" className={cartStyles.removeOnInk} aria-label={t('shop.cart.removeCode', { code: c.code })} onClick={() => void page.removeCode(c.code)}>
                    {t('shop.cart.remove')}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          {blocked ? <p className={cartStyles.problemOnInk}>{t('shop.cart.blocked')}</p> : null}
          {checkout}
          <p className={cartStyles.secure}>
            <Icon name="lock" className={base.iconSmall} />
            {t('shop.cart.secure')}
          </p>
          <ul className={cartStyles.pay} aria-label={t('common.footer.payLabel')}>
            <li>{t('common.pay.upi')}</li>
            <li>{t('common.pay.cards')}</li>
            <li>{t('common.pay.netbanking')}</li>
            <li>{t('common.pay.cod')}</li>
          </ul>
        </aside>
      </div>
      <div className={clsx(base.actionBar, base.actionBarInk)}>
        <div className={cartStyles.barTotal}>
          <span className={base.label}>{t('shop.cart.total')}</span>
          <Price money={cart.total} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={cartStyles.barPrice} />
        </div>
        {checkout}
      </div>
    </section>
  )
}
