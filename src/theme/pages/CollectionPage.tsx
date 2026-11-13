import { Link, useCollection, useHead, useStorefront } from '@dripfunnel/storefront-core/theme'
import { ShelfView } from '../components/interactive/ShelfView'
import { Retry } from '../components/interactive/Retry'
import { Layout } from '../components/Layout'
import { Notice } from '../components/Notice'
import { PageHero } from '../components/PageHero'
import base from '../styles/base.module.css'

/** Any of the store's collections (`/collections/{slug}/`), and every product at `/collections/all/`. */
export const CollectionPage = () => {
  const { t } = useStorefront()
  const page = useCollection()
  const name = page.collection?.name ?? (page.all ? t('shop.collection.all') : null)
  const lead = page.collection ? page.collection.description : page.all ? t('shop.collection.allLead') : null
  useHead({ title: name, description: lead })
  return (
    <Layout title={name ?? t('catalog.spices.title')} back="/spices/" tab="shop">
      {page.found === 'missing' ? (
        <Notice main title={t('shop.collection.missing')} lead={t('shop.collection.missingLead')}>
          <Link href="/spices/" className={base.button}>
            {t('catalog.shelf.backToShelf')}
          </Link>
        </Notice>
      ) : page.found === 'error' ? (
        <Notice main title={t('shop.listing.failed')} lead={t('shop.listing.failedLead')}>
          <Retry label={t('shop.listing.retry')} onRetry={page.retry} />
        </Notice>
      ) : (
        <>
          <PageHero
            title={name ?? t('shop.collection.loading')}
            intro={lead}
            crumbs={name ? [{ label: t('shop.crumbs.home'), href: '/' }, { label: name, href: page.collection?.href ?? '/collections/all/' }] : []}
          />
          <ShelfView listing={page} shelves={['blend', 'single', 'snack']} />
        </>
      )}
    </Layout>
  )
}
