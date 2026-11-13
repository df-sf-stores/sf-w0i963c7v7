import { useHead, useListing, useStorefront } from '@dripfunnel/storefront-core/theme'
import { ShelfView } from '../components/interactive/ShelfView'
import { Layout } from '../components/Layout'
import { PageHero } from '../components/PageHero'

/** /spices: the blended masalas and single spices together (PDF p4, p5, p14). */
export const SpicesPage = () => {
  const { t } = useStorefront()
  const listing = useListing({ collection: 'spices' })
  useHead({ title: t('catalog.spices.seoTitle'), description: t('catalog.spices.seoDescription') })
  return (
    <Layout title={t('catalog.spices.title')} nav="spices" tab="shop">
      <PageHero
        title={t('catalog.spices.title')}
        telugu={t('catalog.spices.telugu')}
        intro={t('catalog.spices.intro')}
        crumbs={[
          { label: t('shop.crumbs.home'), href: '/' },
          { label: t('catalog.spices.title'), href: '/spices/' },
        ]}
      />
      <ShelfView listing={listing} shelves={['blend', 'single']} />
    </Layout>
  )
}
