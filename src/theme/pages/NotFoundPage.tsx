import { Link, useHead, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Diamond, Icon } from '../components/Icon'
import { Layout } from '../components/Layout'
import base from '../styles/base.module.css'
import story from '../styles/story.module.css'

export const NotFoundPage = () => {
  const { t } = useStorefront()
  useHead({ title: t('pages.notFound.title'), hidden: true })
  return (
    <Layout tab="shop">
      <section className={story.lost}>
        <Diamond className={`${base.diamond} ${base.heroDiamond}`} />
        <div className={`${base.wrap} ${story.lostInner}`}>
          <p className={`${base.label} ${base.turmericText}`}>{t('pages.notFound.eyebrow')}</p>
          <h1 className={base.hero}>{t('pages.notFound.title')}</h1>
          <p className={base.lead}>{t('pages.notFound.lead')}</p>
          <div className={base.noticeActions}>
            <Link href="/spices/" className={base.onInk}>
              {t('catalog.shelf.backToShelf')}
              <Icon name="arrow" className={base.iconSmall} />
            </Link>
            <Link href="/search/" className={base.ghostOnInk}>
              {t('pages.notFound.search')}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
