import { Link, useHead, useStorefront } from '@dripfunnel/storefront-core/theme'
import { dialable, oneLine, shownPhone } from '../components/contact'
import { Icon } from '../components/Icon'
import { Layout } from '../components/Layout'
import { PageHero } from '../components/PageHero'
import base from '../styles/base.module.css'
import story from '../styles/story.module.css'

/** /contact: every way to reach a person, read from Site settings. */
export const ContactPage = () => {
  const { store, t } = useStorefront()
  const phone = store.contactPhone
  const whatsapp = store.social.find((s) => s.network === 'whatsapp') ?? null
  const place = oneLine(store.address)
  useHead({ title: t('pages.contact.title'), description: t('pages.contact.lead') })
  return (
    <Layout title={t('pages.contact.title')} tab={null}>
      <PageHero
        title={t('pages.contact.title')}
        intro={t('pages.contact.lead')}
        crumbs={[
          { label: t('shop.crumbs.home'), href: '/' },
          { label: t('pages.contact.title'), href: '/contact/' },
        ]}
      />
      <section className={base.band}>
        <ul className={`${base.wrap} ${story.cards}`}>
          {phone ? (
            <li className={story.card}>
              <p className={base.label}>{t('pages.contact.phone')}</p>
              <p className={base.small}>{shownPhone(phone)}</p>
              <p className={base.meta}>{t('common.contact.hours')}</p>
              <Link href={t('common.contact.callHref', { phone: dialable(phone) })} className={base.button}>
                <Icon name="phone" className={base.iconSmall} />
                {t('policy.person.call')}
              </Link>
            </li>
          ) : null}
          {whatsapp ? (
            <li className={story.card}>
              <p className={base.label}>{t('pages.contact.whatsapp')}</p>
              <p className={base.meta}>{t('pages.contact.whatsappLead')}</p>
              <Link href={whatsapp.url} className={base.secondary}>
                {t('pages.contact.whatsappAction')}
              </Link>
            </li>
          ) : null}
          {store.contactEmail ? (
            <li className={story.card}>
              <p className={base.label}>{t('pages.contact.email')}</p>
              <p className={story.wrapText}>{store.contactEmail}</p>
              <p className={base.meta}>{t('pages.contact.emailLead')}</p>
            </li>
          ) : null}
          {place ? (
            <li className={story.card}>
              <p className={base.label}>{t('pages.contact.visit')}</p>
              <p>{place}</p>
              <p className={base.meta}>{t('common.facts.gstin')}</p>
            </li>
          ) : null}
        </ul>
      </section>
    </Layout>
  )
}
