'use client'

import { Link, OrderSummary, PaymentElement, Price, useOrder, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Icon } from '../Icon'
import base from '../../styles/base.module.css'
import cartStyles from '../../styles/cart.module.css'
import { DeliveryTracking } from '../DeliveryTracking'
import { Notice } from '../Notice'
import { OrderPill } from '../OrderPill'
import { PaymentMethod } from '../PaymentMethod'
import { Retry } from './Retry'
import { shop } from '../styles/shop'
import { order as styles } from '../styles/order'

/**
 * The order's page (`/order/{id}/`), as D1's order confirmation: where it stands, what to do next, and what was charged;
 * `inAccount`, the same order in the account (`/account/orders/{id}/`), headed by its number.
 */
export const OrderView = ({ inAccount = false }: { inAccount?: boolean }) => {
  const { store, locale, t } = useStorefront()
  const page = useOrder()

  if (page.status === 'loading') {
    return (
      <section className={shop.page} aria-busy="true">
        <h1 className={shop.title}>{t('shop.order.loading')}</h1>
      </section>
    )
  }
  if (page.status === 'error') {
    return (
      <section className={shop.page}>
        <Notice main title={t('shop.order.failed')} lead={t('shop.listing.failedLead')}>
          <Retry label={t('shop.listing.retry')} onRetry={page.retry} />
        </Notice>
      </section>
    )
  }
  const order = page.order
  if (!order) {
    return (
      <section className={shop.page}>
        <Notice main title={t('shop.order.missing')} lead={t('shop.order.missingLead')}>
          <Link href="/" className={shop.primary}>
            {t('shop.order.keepShopping')}
          </Link>
        </Notice>
      </section>
    )
  }
  const awaiting = !order.cancelled && order.payment === 'awaiting'
  const welcome = !inAccount && !order.cancelled
  const timeline = [t('shop.order.next.placed'), t('shop.order.next.packed'), t('shop.order.next.courier'), t('shop.order.next.delivered')]
  return (
    <>
    {welcome ? (
      <section className={cartStyles.orderHero}>
        <div className={`${base.wrap} ${cartStyles.orderHeroInner}`}>
          <span className={cartStyles.checkSquare} aria-hidden="true">
            <Icon name="check" className={cartStyles.checkIcon} />
          </span>
          <OrderPill order={order} />
          <h1 className={base.pageTitle}>{t('shop.order.title')}</h1>
          <p className={cartStyles.orderNumber}>{t('shop.order.numberLine', { number: order.number })}</p>
          <p className={cartStyles.orderLead}>{t('shop.order.sentLine')}</p>
        </div>
      </section>
    ) : null}
    {welcome ? (
      <section className={`${base.wrap} ${cartStyles.next}`} aria-labelledby="order-next">
        <div>
          <h2 id="order-next" className={base.section}>
            {t('shop.order.next.title')}
          </h2>
          <ol className={cartStyles.timeline}>
            {timeline.map((step, i) => (
              <li key={step} className={cartStyles.timelineItem} aria-current={i === 0 ? 'step' : undefined}>
                <span className={i === 0 ? cartStyles.pipDone : cartStyles.pip} aria-hidden="true" />
                <span className={cartStyles.timelineTitle}>{step}</span>
                <span className={base.meta}>{i === 0 ? t('shop.order.next.placedNote') : t('shop.order.next.later')}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className={cartStyles.inkCard}>
          <p className={base.label}>{t('shop.order.paidLabel')}</p>
          <Price money={order.total} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={cartStyles.barPrice} />
          {order.method ? (
            <p>
              <PaymentMethod provider={order.method} />
            </p>
          ) : null}
          <p>{t('shop.order.reference', { number: order.number })}</p>
          <Link href="/track-order/" className={base.onInk}>
            {t('shop.order.track')}
          </Link>
        </div>
      </section>
    ) : null}
    <section className={shop.page}>
      <div className={styles.order}>
        <div className={styles.main}>
          <div className={welcome ? base.hidden : styles.head}>
            {inAccount ? (
              <Link href="/account/" className={styles.back}>
                {t('shop.order.backToAccount')}
              </Link>
            ) : null}
            <OrderPill order={order} />
            {welcome ? null : <h1 className={styles.title}>{order.cancelled ? t('shop.order.cancelledTitle') : inAccount ? t('shop.order.summary', { number: order.number }) : t('shop.order.title')}</h1>}
            {order.cancelled ? <p className={styles.lead}>{t('shop.order.cancelledLead', { number: order.number })}</p> : inAccount ? null : <p className={styles.lead}>{t('shop.order.lead', { number: order.number })}</p>}
          </div>
          {awaiting && order.method === 'bank_transfer' ? (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{t('shop.order.transferTitle')}</h2>
              <p className={styles.note}>{order.payBy ? t('shop.order.transferBy', { number: order.number, date: order.payBy }) : t('shop.order.transferRef', { number: order.number })}</p>
              {order.instructions ? <p className={styles.instructions}>{order.instructions}</p> : null}
            </div>
          ) : null}
          {awaiting && order.method === 'cod' ? <p className={styles.info}>{t('shop.order.cod')}</p> : null}
          {!order.cancelled && order.payment === 'confirming' ? (
            <div className={styles.card}>
              <p className={styles.note} role="status">
                {t('shop.order.confirming')}
              </p>
              <div className={styles.actions}>
                <Retry label={t('shop.order.checkAgain')} onRetry={page.retry} />
                {page.payAgain ? (
                  <button type="button" className={shop.primary} onClick={page.payAgain}>
                    {t('shop.order.payAgain')}
                  </button>
                ) : null}
              </div>
              <PaymentElement t={t} />
            </div>
          ) : null}
          {!order.cancelled && order.tracking ? <DeliveryTracking tracking={order.tracking} /> : null}
          {order.downloads.length > 0 ? (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{t('shop.order.downloads')}</h2>
              <ul className={styles.list}>
                {order.downloads.map((d, i) => (
                  <li key={i} className={styles.item}>
                    {d.url ? (
                      <Link href={d.url} className={shop.secondary}>
                        {t('shop.order.download', { name: d.name })}
                      </Link>
                    ) : (
                      <span>{d.name}</span>
                    )}
                    {d.usesLeft !== null && d.until ? <span className={styles.note}>{t('shop.order.downloadLeft', { count: d.usesLeft, date: d.until })}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {order.licenceKeys.length > 0 ? (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{t('shop.order.keys')}</h2>
              <dl className={styles.facts}>
                {order.licenceKeys.map((k, i) => (
                  <div key={i}>
                    <dt>{k.name}</dt>
                    <dd className={styles.key}>{k.key}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
          {order.lines.flatMap((l, i) =>
            l.gift ? [
              <p key={i} className={styles.info}>
                {l.gift.sendOn ? t('shop.order.giftOn', { name: l.gift.recipientName, date: l.gift.sendOn }) : t('shop.order.giftNow', { name: l.gift.recipientName })}
              </p>,
            ] : [],
          )}
          <div className={styles.card}>
            <dl className={styles.facts}>
              {order.delivery ? (
                <div>
                  <dt>{t('shop.order.method')}</dt>
                  <dd>{order.delivery}</dd>
                </div>
              ) : null}
              {order.method ? (
                <div>
                  <dt>{t('shop.checkout.payment')}</dt>
                  <dd>
                    <PaymentMethod provider={order.method} />
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
          {welcome ? (
            <div className={cartStyles.lowOn}>
              <h2 className={base.small}>{t('shop.order.lowTitle')}</h2>
              <p>{t('shop.order.lowLead')}</p>
              <Link href="/spices/" className={base.inverted}>
                {t('catalog.shelf.backToShelf')}
                <Icon name="arrow" className={base.iconSmall} />
              </Link>
            </div>
          ) : (
            <div className={styles.actions}>
              <Link href="/" className={shop.secondary}>
                {t('shop.order.keepShopping')}
              </Link>
            </div>
          )}
        </div>
        <aside className={styles.side}>
          <h2 className={styles.sideTitle}>{inAccount ? t('shop.checkout.summary') : t('shop.order.summary', { number: order.number })}</h2>
          <OrderSummary order={order} locale={locale} t={t} className={styles.summary} />
        </aside>
      </div>
    </section>
    </>
  )
}
