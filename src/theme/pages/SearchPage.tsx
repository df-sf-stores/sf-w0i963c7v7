import { Link, SearchField, useHead, useSearch, useStorefront } from '@dripfunnel/storefront-core/theme'
import { ShelfView } from '../components/interactive/ShelfView'
import { Layout } from '../components/Layout'
import base from '../styles/base.module.css'
import pages from '../styles/pages.module.css'

/** Search: a full-width field on ink (full screen on phones), then the results as a shelf. */
export const SearchPage = () => {
  const { t } = useStorefront()
  const search = useSearch()
  useHead({ title: search.query ? t('shop.search.results', { query: search.query }) : t('shop.search.title'), hidden: true })
  const none = search.status === 'ready' && search.items.length === 0 && search.selected.length === 0
  return (
    <Layout title={t('shop.search.title')} tab="search">
      <section className={pages.searchHero}>
        <div className={`${base.wrap} ${pages.searchInner}`}>
          <h1 className={base.pageTitle}>{search.query ? t('shop.search.results', { query: search.query }) : t('shop.search.title')}</h1>
          <SearchField label={t('shop.search.label')} placeholder={t('shop.search.placeholder')} button={t('shop.search.button')} value={search.query} onSearch={search.setQuery} suggest={4} className={pages.searchField} />
          <div className={pages.searchShortcuts}>
            <Link href="/spices/?shelf=blend" className={base.chip}>
              {t('common.footer.blends')}
            </Link>
            <Link href="/spices/?shelf=single" className={base.chip}>
              {t('common.footer.singles')}
            </Link>
            <Link href="/snacks/" className={base.chip}>
              {t('common.nav.snacks')}
            </Link>
            <Link href="/bundles/" className={base.chip}>
              {t('common.nav.bundles')}
            </Link>
          </div>
        </div>
      </section>
      {none ? (
        <div className={`${base.wrap} ${base.notice}`}>
          <h2 className={base.small}>{t('shop.search.none', { query: search.query })}</h2>
          <p className={base.noticeLead}>{t('shop.search.noneLead')}</p>
          <Link href="/spices/" className={base.button}>
            {t('catalog.shelf.backToShelf')}
          </Link>
        </div>
      ) : search.status === 'idle' ? null : (
        <ShelfView listing={search} shelves={['blend', 'single', 'snack']} />
      )}
    </Layout>
  )
}
