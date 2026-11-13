import { Link, useHead, useStorefront } from '@dripfunnel/storefront-core/theme'
import { dialable, shownPhone } from './contact'
import { Icon } from './Icon'
import { PolicyBody } from './interactive/PolicyBody'
import { Layout } from './Layout'
import { docs, type DocKind } from './policyDocs'
import base from '../styles/base.module.css'
import story from '../styles/story.module.css'

const tabs = ['privacy', 'terms', 'refunds', 'shipping'] as const

/** The "Need a person?" card: the store's email, phone and hours, read from Site settings, and a call button. */
export const NeedPerson = () => {
  const { store, t } = useStorefront()
  const phone = store.contactPhone
  return (
    <div className={story.person}>
      <p className={base.small}>{t('policy.person.title')}</p>
      {store.contactEmail ? <p>{store.contactEmail}</p> : null}
      {phone ? <p>{shownPhone(phone)}</p> : null}
      <p>{t('common.contact.hours')}</p>
      {phone ? (
        <Link href={t('common.contact.callHref', { phone: dialable(phone) })} className={base.onInk}>
          <Icon name="phone" className={base.iconSmall} />
          {t('policy.person.call')}
        </Link>
      ) : null}
    </div>
  )
}

/** The policy template (PDF p12, p21): tabs, title, the short version, then the numbered sections and the contents list. */
export const PolicyTemplate = ({ kind, withTabs = true }: { kind: DocKind; withTabs?: boolean }) => {
  const { store, t } = useStorefront()
  const doc = docs[kind]
  const values = {
    shop: store.name,
    phone: store.contactPhone ? shownPhone(store.contactPhone) : t('policy.values.phone'),
    email: store.contactEmail ?? t('policy.values.email'),
    city: store.address?.city ?? t('policy.values.city'),
  }
  const title = t(doc.title)
  useHead({ title, description: t(doc.short, values) })
  const names = { privacy: t('policy.privacy.tab'), terms: t('policy.terms.tab'), refunds: t('policy.refunds.tab'), shipping: t('policy.shipping.tab') }
  return (
    <Layout title={title} tab={null}>
      <section className={`${base.wrap} ${story.policy}`}>
        <header className={story.policyHead}>
          <h1 className={base.pageTitle}>{title}</h1>
          <p className={base.meta}>{t(doc.updated, values)}</p>
          {withTabs ? (
            <nav className={story.tabs} aria-label={t('policy.tabsLabel')}>
              {tabs.map((k) => (
                <span key={k} className={k === kind ? story.tabOn : story.tabWrap} aria-current={k === kind ? 'page' : undefined}>
                  <Link href={`/policies/${k}/`} className={story.tab}>
                    {names[k]}
                  </Link>
                </span>
              ))}
            </nav>
          ) : null}
        </header>
        <PolicyBody
          tocLabel={t('policy.toc')}
          sections={doc.sections.map((s) => ({ id: s.id, title: t(s.title), body: t(s.body, values) }))}
          lead={
            <p className={story.short}>
              <Icon name="shield" />
              <span>
                <strong>{t('policy.shortLabel')}</strong> {t(doc.short, values)}
              </span>
            </p>
          }
          aside={<NeedPerson />}
        />
      </section>
    </Layout>
  )
}
