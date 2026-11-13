import { Link, Price, useHead, useOffers, useProductCards, useStorefront } from '@dripfunnel/storefront-core/theme'
import { AddBox } from '../components/interactive/AddBox'
import { packOf, starterBox, teluguKey } from '../components/catalog'
import { Diamond, Icon } from '../components/Icon'
import { Layout } from '../components/Layout'
import { PageHero } from '../components/PageHero'
import { GridPlaceholder, PackPicture, ProductGrid } from '../components/ProductCard'
import base from '../styles/base.module.css'
import pages from '../styles/pages.module.css'

/** /bundles: the boxes built from the shelf. Each adds its packs together; the cart prices them, offers included. */
export const BundlesPage = () => {
  const { store, locale, t } = useStorefront()
  const box = useProductCards(starterBox)
  const { offers } = useOffers()
  useHead({ title: t('catalog.bundles.seoTitle'), description: t('catalog.bundles.seoDescription') })
  return (
    <Layout title={t('catalog.bundles.title')} nav="bundles" tab="shop">
      <PageHero
        title={t('catalog.bundles.title')}
        telugu={t('catalog.bundles.telugu')}
        intro={t('catalog.bundles.intro')}
        crumbs={[
          { label: t('shop.crumbs.home'), href: '/' },
          { label: t('catalog.bundles.title'), href: '/bundles/' },
        ]}
      />
      <section className={base.band} aria-labelledby="box-starter">
        <div className={`${base.wrap} ${pages.boxes}`}>
          <article className={pages.boxCard}>
            <div className={pages.boxCardArt}>
              <Diamond className={`${base.diamond} ${pages.bundleDiamond}`} />
              <ul className={pages.fan} aria-label={t('home.box.packs')}>
                {box.cards.map((c) => (
                  <li key={c.id} className={pages.fanPack}>
                    <PackPicture product={c} place="fan" className={pages.fanFrame} />
                  </li>
                ))}
              </ul>
            </div>
            <div className={pages.boxCardCopy}>
              <p className={`${base.label} ${base.chilliText}`}>{offers[0]?.name ?? t('home.box.eyebrow')}</p>
              <h2 id="box-starter" className={base.section}>
                {t('home.box.title')}
              </h2>
              <p className={base.lead}>{t('home.box.lead')}</p>
              <ul className={pages.boxList}>
                {box.cards.map((c) => {
                  const slug = packOf(c.href).slug
                  return (
                    <li key={c.id} className={pages.boxItem}>
                      <span>
                        {slug ? (
                          <span className={pages.boxTelugu} lang="te">
                            {t(teluguKey[slug])}
                          </span>
                        ) : null}
                        <Link href={c.href} className={pages.boxName}>
                          {c.name}
                        </Link>
                      </span>
                      {c.price ? <Price money={c.price} compareAt={c.compareAt} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={pages.boxPrice} /> : null}
                    </li>
                  )
                })}
              </ul>
              <p className={base.meta}>{t('catalog.bundles.priced')}</p>
              <AddBox slugs={starterBox} label={t('home.box.add')} />
            </div>
          </article>
        </div>
      </section>
      <section className={base.bandPaper2} aria-labelledby="box-packs">
        <div className={base.wrap}>
          <div className={base.bandHead}>
            <h2 id="box-packs" className={base.section}>
              {t('catalog.bundles.inside')}
            </h2>
            <Link href="/spices/" className={base.textLinkChilli}>
              {t('home.staples.all')}
              <Icon name="arrow" className={base.iconSmall} />
            </Link>
          </div>
          {box.status === 'loading' ? <GridPlaceholder label={t('shop.listing.loading')} count={4} four /> : <ProductGrid products={box.cards} four />}
        </div>
      </section>
    </Layout>
  )
}
