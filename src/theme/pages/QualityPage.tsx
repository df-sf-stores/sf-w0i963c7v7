import { Link, useHead, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Icon } from '../components/Icon'
import { Layout } from '../components/Layout'
import { PageHero } from '../components/PageHero'
import base from '../styles/base.module.css'
import story from '../styles/story.module.css'

/** /quality (PDF p11, p20): the indigo hero, the chain on ink, what gets checked, and the compliance band. */
export const QualityPage = () => {
  const { t } = useStorefront()
  const chain = [
    { title: t('quality.chain.c1Title'), body: t('quality.chain.c1Body') },
    { title: t('quality.chain.c2Title'), body: t('quality.chain.c2Body') },
    { title: t('quality.chain.c3Title'), body: t('quality.chain.c3Body') },
    { title: t('quality.chain.c4Title'), body: t('quality.chain.c4Body') },
  ]
  const checks = [
    { title: t('quality.checks.k1Title'), items: [t('quality.checks.k1a'), t('quality.checks.k1b'), t('quality.checks.k1c')] },
    { title: t('quality.checks.k2Title'), items: [t('quality.checks.k2a'), t('quality.checks.k2b'), t('quality.checks.k2c')] },
    { title: t('quality.checks.k3Title'), items: [t('quality.checks.k3a'), t('quality.checks.k3b'), t('quality.checks.k3c')] },
  ]
  const compliance = [
    { title: t('quality.compliance.fssaiTitle'), body: t('quality.compliance.fssaiBody'), href: '/fssai-labelling/', link: t('common.footer.fssai') },
    { title: t('quality.compliance.metrologyTitle'), body: t('quality.compliance.metrologyBody'), href: '/fssai-labelling/', link: t('quality.compliance.metrologyLink') },
    { title: t('quality.compliance.complaintsTitle'), body: t('quality.compliance.complaintsBody'), href: '/contact/', link: t('common.footer.contact') },
  ]
  useHead({ title: t('quality.seoTitle'), description: t('quality.hero.lead') })
  return (
    <Layout title={t('common.nav.quality')} nav="quality" tab="shop">
      <PageHero
        tone="indigo"
        title={t('quality.hero.title')}
        intro={t('quality.hero.lead')}
        crumbs={[
          { label: t('shop.crumbs.home'), href: '/' },
          { label: t('common.nav.quality'), href: '/quality/' },
        ]}
      />
      <section className={base.bandInk} aria-labelledby="quality-chain">
        <div className={base.wrap}>
          <div className={base.bandHead}>
            <h2 id="quality-chain" className={base.section}>
              {t('quality.chain.title')}
            </h2>
            <p className={base.bandNote}>{t('quality.chain.note')}</p>
          </div>
          <ol className={story.chain}>
            {chain.map((c, i) => (
              <li key={c.title} className={story.chainItem}>
                <span className={`${base.section} ${base.turmericText}`} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={base.cardTitle}>{c.title}</h3>
                <p className={story.chainBody}>{c.body}</p>
                {i < chain.length - 1 ? (
                  <span className={story.chainArrow} aria-hidden="true">
                    <Icon name="arrow" />
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className={base.band} aria-labelledby="quality-checked">
        <div className={base.wrap}>
          <div className={base.bandHead}>
            <h2 id="quality-checked" className={base.section}>
              {t('quality.checks.title')}
            </h2>
          </div>
          <ul className={story.checkGrid}>
            {checks.map((c) => (
              <li key={c.title} className={story.checkCard}>
                <h3 className={base.cardTitle}>{c.title}</h3>
                <ul className={story.checkList}>
                  {c.items.map((item) => (
                    <li key={item}>
                      <Icon name="check" className={story.checkIcon} />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className={base.bandPaper2} aria-labelledby="quality-compliance">
        <div className={base.wrap}>
          <h2 id="quality-compliance" className={`${base.small} ${story.complianceTitle}`}>
            {t('quality.compliance.title')}
          </h2>
          <ul className={story.compliance}>
            {compliance.map((c) => (
              <li key={c.title} className={story.complianceItem}>
                <p className={base.label}>{c.title}</p>
                <p>{c.body}</p>
                <Link href={c.href} className={base.textLinkChilli}>
                  {c.link}
                  <Icon name="arrow" className={base.iconSmall} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  )
}
