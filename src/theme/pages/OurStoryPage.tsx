import { Link, ThemeImage, useHead, useProductCards, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Diamond, Icon } from '../components/Icon'
import { Layout } from '../components/Layout'
import { PackPicture } from '../components/ProductCard'
import base from '../styles/base.module.css'
import story from '../styles/story.module.css'

const turmeric = ['turmeric-powder'] as const

/** /our-story (PDF p10, p19): the hero, the pack over the brand's Telugu name, the story, what we hold to, and the CTA band. */
export const OurStoryPage = () => {
  const { store, t } = useStorefront()
  const pack = useProductCards(turmeric).cards[0] ?? null
  const values = [
    { tone: story.topTurmeric, title: t('story.values.v1Title'), body: t('story.values.v1Body') },
    { tone: story.topChilli, title: t('story.values.v2Title'), body: t('story.values.v2Body') },
    { tone: story.topIndigo, title: t('story.values.v3Title'), body: t('story.values.v3Body') },
    { tone: story.topLeaf, title: t('story.values.v4Title'), body: t('story.values.v4Body') },
  ]
  useHead({ title: t('story.seoTitle'), description: store.description ?? t('story.hero.lead') })
  return (
    <Layout title={t('common.nav.story')} nav="story" tab="shop">
      <section className={story.split}>
        <div className={story.splitInk}>
          <Diamond className={`${base.diamond} ${base.heroDiamond}`} />
          <div className={story.splitCopy}>
            <p className={`${base.label} ${base.turmericText}`}>{t('story.hero.eyebrow')}</p>
            <h1 className={base.pageTitle}>
              <span className={story.line}>{t('story.hero.line1')}</span>
              <span className={`${story.line} ${base.turmericText}`}>{t('story.hero.line2')}</span>
            </h1>
            <p className={story.inkLead}>{t('story.hero.lead', { city: store.address?.city ?? t('policy.values.city') })}</p>
          </div>
        </div>
        <div className={story.splitPack}>
          <span className={story.ghost} aria-hidden="true">
            {t('home.hero.ghost')}
          </span>
          <div className={story.packHolder}>
            {pack ? <PackPicture product={pack} place="story" className={story.packFrame} /> : <ThemeImage src="single-spices.png" alt={t('story.packAlt')} ratio={0.75} sizes="(min-width: 1100px) 30vw, 60vw" />}
          </div>
        </div>
      </section>

      <section className={base.band} aria-labelledby="story-real">
        <div className={`${base.wrap} ${story.storyGrid}`}>
          <h2 id="story-real" className={base.section}>
            {store.tagline ?? t('story.body.title')}
          </h2>
          <div className={story.storyText}>
            {store.description ? <p className={base.lead}>{store.description}</p> : null}
            <p>{t('story.body.p1', { city: store.address?.city ?? t('policy.values.city') })}</p>
            <p>{t('story.body.p2')}</p>
            <p>{t('story.body.p3')}</p>
          </div>
        </div>
      </section>

      <figure className={story.photo}>
        <div className={story.photoWide}>
          <ThemeImage src="cover-banner.jpg" alt={t('story.photoAlt')} ratio={2.14} sizes="100vw" />
        </div>
        <div className={story.photoSquare}>
          <ThemeImage src="cover-square.jpg" alt={t('story.photoAlt')} ratio={1} sizes="100vw" />
        </div>
      </figure>

      <section className={base.bandPaper2} aria-labelledby="story-values">
        <div className={base.wrap}>
          <div className={base.bandHead}>
            <h2 id="story-values" className={base.section}>
              {t('story.values.title')}
            </h2>
          </div>
          <ul className={story.valueGrid}>
            {values.map((v) => (
              <li key={v.title} className={`${story.valueCard} ${v.tone}`}>
                <h3 className={base.cardTitle}>{v.title}</h3>
                <p className={base.meta}>{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={story.cta}>
        <div className={`${base.wrap} ${story.ctaInner}`}>
          <div>
            <p className={base.label}>{t('story.cta.eyebrow')}</p>
            <h2 className={base.section}>{t('story.cta.title')}</h2>
          </div>
          <Link href="/spices/" className={base.white}>
            {t('home.hero.shop')}
            <Icon name="arrow" className={base.iconSmall} />
          </Link>
        </div>
      </section>
    </Layout>
  )
}
