import { Link, useHead, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Fold } from '../components/interactive/Fold'
import { Layout } from '../components/Layout'
import { NeedPerson } from '../components/PolicyTemplate'
import base from '../styles/base.module.css'
import story from '../styles/story.module.css'

const questions = [
  ['faq.q1', 'faq.a1'],
  ['faq.q2', 'faq.a2'],
  ['faq.q3', 'faq.a3'],
  ['faq.q4', 'faq.a4'],
  ['faq.q5', 'faq.a5'],
  ['faq.q6', 'faq.a6'],
  ['faq.q7', 'faq.a7'],
  ['faq.q8', 'faq.a8'],
] as const

/** /faqs: questions as accordions, in the policy template's style. */
export const FaqsPage = () => {
  const { store, t } = useStorefront()
  const values = { shop: store.name, city: store.address?.city ?? t('policy.values.city') }
  useHead({ title: t('faq.title'), description: t('faq.lead') })
  return (
    <Layout title={t('faq.title')} tab={null}>
      <section className={`${base.wrap} ${story.policy}`}>
        <header className={story.policyHead}>
          <h1 className={base.pageTitle}>{t('faq.title')}</h1>
          <p className={base.lead}>{t('faq.lead')}</p>
        </header>
        <div className={story.policyGrid}>
          <aside className={story.toc}>
            <NeedPerson />
          </aside>
          <div className={story.sections}>
            {questions.map(([q, a], i) => (
              <Fold key={q} first={i === 0} title={<span className={base.cardTitle}>{t(q)}</span>}>
                <p className={story.para}>{t(a, values)}</p>
              </Fold>
            ))}
            <p className={story.para}>
              <Link href="/policies/refunds/" className={base.textLinkChilli}>
                {t('common.footer.returns')}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
