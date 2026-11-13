import { Link, useHead, useStorefront } from '@dripfunnel/storefront-core/theme'
import { dialable, shownPhone } from '../components/contact'
import { Icon } from '../components/Icon'
import { Layout } from '../components/Layout'
import { PageHero } from '../components/PageHero'
import base from '../styles/base.module.css'
import story from '../styles/story.module.css'

/**
 * /track-order. The Shop API shows an order to the customer who placed it (signed in) or to the browser it was placed
 * from, so tracking starts there; anyone else reaches a person with the order number.
 */
export const TrackOrderPage = () => {
  const { store, t } = useStorefront()
  const phone = store.contactPhone
  const whatsapp = store.social.find((s) => s.network === 'whatsapp') ?? null
  useHead({ title: t('track.title'), description: t('track.lead') })
  return (
    <Layout title={t('track.title')} tab={null}>
      <PageHero
        title={t('track.title')}
        intro={t('track.lead')}
        crumbs={[
          { label: t('shop.crumbs.home'), href: '/' },
          { label: t('track.title'), href: '/track-order/' },
        ]}
      />
      <section className={base.band}>
        <ol className={`${base.wrap} ${story.cards}`}>
          <li className={story.card}>
            <p className={`${base.section} ${base.chilliText}`} aria-hidden="true">
              {t('track.oneNumber')}
            </p>
            <h2 className={base.cardTitle}>{t('track.signedTitle')}</h2>
            <p className={base.meta}>{t('track.signedLead')}</p>
            <Link href="/account/orders/" className={base.button}>
              {t('track.signedAction')}
              <Icon name="arrow" className={base.iconSmall} />
            </Link>
          </li>
          <li className={story.card}>
            <p className={`${base.section} ${base.chilliText}`} aria-hidden="true">
              {t('track.twoNumber')}
            </p>
            <h2 className={base.cardTitle}>{t('track.guestTitle')}</h2>
            <p className={base.meta}>{t('track.guestLead')}</p>
            <div className={base.noticeActions}>
              {whatsapp ? (
                <Link href={whatsapp.url} className={base.secondary}>
                  {t('pages.contact.whatsappAction')}
                </Link>
              ) : null}
              {phone ? (
                <Link href={t('common.contact.callHref', { phone: dialable(phone) })} className={base.secondary}>
                  {shownPhone(phone)}
                </Link>
              ) : null}
            </div>
          </li>
        </ol>
      </section>
    </Layout>
  )
}
