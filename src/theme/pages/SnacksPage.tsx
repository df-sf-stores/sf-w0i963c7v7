import { useHead, useListing, useStorefront } from '@dripfunnel/storefront-core/theme'
import { ShelfView } from '../components/interactive/ShelfView'
import { Layout } from '../components/Layout'
import { PageHero } from '../components/PageHero'

/** /snacks: the shelf template over the store's papad collection. */
export const SnacksPage = () => {
  const { t } = useStorefront()
  const listing = useListing({ collection: 'papad' })
  useHead({ title: t('catalog.snacks.seoTitle'), description: t('catalog.snacks.seoDescription') })
  return (
    <Layout title={t('catalog.snacks.title')} nav="snacks" tab="shop">
      <PageHero
        title={t('catalog.snacks.title')}
        telugu={t('catalog.snacks.telugu')}
        intro={t('catalog.snacks.intro')}
        crumbs={[
          { label: t('shop.crumbs.home'), href: '/' },
          { label: t('catalog.snacks.title'), href: '/snacks/' },
        ]}
      />
      <ShelfView listing={listing} shelves={['snack']} />
    </Layout>
  )
}
