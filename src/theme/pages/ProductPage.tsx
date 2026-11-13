import type { ReactNode } from 'react'
import { Breadcrumbs, LegalNotices, Link, Price, RichText, useProduct, useProductCards, useStorefront } from '@dripfunnel/storefront-core/theme'
import { blurbKey, ingredientsKey, packOf, shelfKey, staples, teluguKey } from '../components/catalog'
import { BuyBox } from '../components/interactive/BuyBox'
import { CardHeart } from '../components/interactive/CardHeart'
import { Fold } from '../components/interactive/Fold'
import { PackViewer } from '../components/interactive/PackViewer'
import { Retry } from '../components/interactive/Retry'
import { Icon } from '../components/Icon'
import { Layout, type BackTo } from '../components/Layout'
import { Notice } from '../components/Notice'
import { familyClass, ProductGrid } from '../components/ProductCard'
import base from '../styles/base.module.css'
import product from '../styles/product.module.css'

/** The PDP (PDF p6, p15): the viewer on the pack's family colour, then one decision (the size), the label and the rest of the dabba. */
export const ProductPage = () => {
  const { store, locale, t } = useStorefront()
  const page = useProduct()
  const p = page.product
  const pack = packOf(p?.href)
  const more = useProductCards(staples)
  if (page.status === 'missing' || page.status === 'error' || !p) {
    return (
      <Layout title={t('catalog.spices.title')} back="/spices/">
        {page.status === 'missing' ? (
          <Notice main title={t('shop.product.missing')} lead={t('shop.product.missingLead')}>
            <Link href="/spices/" className={base.button}>
              {t('catalog.shelf.backToShelf')}
            </Link>
          </Notice>
        ) : page.status === 'error' ? (
          <Notice main title={t('shop.product.failed')} lead={t('shop.listing.failedLead')}>
            <Retry label={t('shop.listing.retry')} onRetry={page.retry} />
          </Notice>
        ) : (
          <div className={product.split} aria-busy="true">
            <div className={`${product.viewer} ${familyClass.ink}`} />
            <div className={product.info}>
              <h1 className={base.pageTitle}>{t('shop.product.loading')}</h1>
            </div>
          </div>
        )}
      </Layout>
    )
  }
  const specs = p.specs.filter((s) => s.versionId === null || s.versionId === page.version?.id)
  const city = store.address?.city ?? ''
  const label: { name: string; value: ReactNode }[] = [
    { name: t('catalog.label.ingredients'), value: pack.slug ? t(ingredientsKey[pack.slug]) : t('catalog.label.seePack') },
    { name: t('catalog.label.netWeight'), value: t('catalog.label.netWeightValue') },
    {
      name: t('catalog.label.mrp'),
      value: page.price ? (
        <span className={product.mrp}>
          <Price money={page.price} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={product.labelPrice} />
          <span>{t('catalog.label.mrpValue')}</span>
        </span>
      ) : (
        t('catalog.label.mrpValue')
      ),
    },
    { name: t('catalog.label.fssai'), value: t('catalog.label.fssaiValue') },
    { name: t('catalog.label.bestBefore'), value: t('catalog.label.bestBeforeValue') },
    { name: t('catalog.label.allergen'), value: t('catalog.label.allergenValue') },
    { name: t('catalog.label.maker'), value: t('catalog.label.makerValue', { city, postal: store.address?.postal ?? '' }) },
    { name: t('catalog.label.origin'), value: t('catalog.label.originValue') },
    { name: t('catalog.label.hsn'), value: t('catalog.label.hsnValue') },
    ...specs.map((s) => ({ name: s.name, value: s.value })),
  ]
  const related = (p.related.length ? p.related : more.cards.filter((c) => c.id !== p.id)).slice(0, 4)
  const shelfHref: BackTo = pack.shelf === 'snack' ? '/snacks/' : '/spices/'
  const shelfName = pack.shelf === 'snack' ? t('catalog.snacks.title') : t('catalog.spices.title')
  return (
    <Layout title={p.name} back={shelfHref} nav={pack.shelf === 'snack' ? 'snacks' : 'spices'} bar>
      <div className={product.split}>
        <PackViewer photos={page.photos} name={p.name} slug={pack.slug} ground={familyClass[pack.family]} />
        <div className={product.info}>
          <Breadcrumbs
            crumbs={[
              { label: t('shop.crumbs.home'), href: '/' },
              { label: shelfName, href: shelfHref },
              { label: p.name, href: p.href },
            ]}
            t={t}
            className={base.crumbsDark}
          />
          <div className={product.titleBlock}>
            <p className={`${base.label} ${product.shelf}`}>{t(shelfKey[pack.shelf])}</p>
            {pack.slug ? (
              <p className={product.telugu} lang="te">
                {t(teluguKey[pack.slug])}
              </p>
            ) : null}
            <div className={product.titleRow}>
              <h1 className={base.pageTitle}>{p.name}</h1>
              <CardHeart productId={p.id} name={p.name} big />
            </div>
          </div>
          {page.price ? (
            <p className={product.price}>
              {page.from ? <span>{t('shop.card.from')}</span> : null}
              <Price money={page.price} compareAt={page.compareAt} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={product.bigPrice} />
              <span className={base.meta}>{t('catalog.card.weight')}</span>
            </p>
          ) : null}
          <p className={product.lede}>{pack.slug ? t(blurbKey[pack.slug]) : t('catalog.blurb.fallback')}</p>
          <BuyBox page={page} />
          <ul className={product.trust}>
            <li>
              <Icon name="truck" className={base.iconSmall} />
              {t('shop.product.trustShip')}
            </li>
            <li>
              <Icon name="shield" className={base.iconSmall} />
              {t('shop.product.trustSeal')}
            </li>
            <li>
              <Icon name="receipt" className={base.iconSmall} />
              {t('shop.product.trustGst')}
            </li>
          </ul>
          {p.highlights.length ? (
            <ul className={product.highlights}>
              {p.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          ) : null}
          <Fold wide title={<span className={base.small}>{t('catalog.label.title')}</span>} className={product.labelFold}>
            <dl className={product.label}>
              {label.map((row) => (
                <div key={row.name} className={product.labelRow}>
                  <dt className={base.label}>{row.name}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
            <LegalNotices notices={p.legal} t={t} className={product.legal} />
          </Fold>
          {p.description ? (
            <Fold title={<span className={base.cardTitle}>{t('shop.product.description')}</span>}>
              <RichText html={p.description} className={product.rich} />
            </Fold>
          ) : null}
          {p.faqs.length ? (
            <Fold title={<span className={base.cardTitle}>{t('shop.product.questions')}</span>}>
              <dl className={product.faqs}>
                {p.faqs.map((f) => (
                  <div key={f.question}>
                    <dt>{f.question}</dt>
                    <dd>{f.answer}</dd>
                  </div>
                ))}
              </dl>
            </Fold>
          ) : null}
          {p.returns ? (
            <Fold title={<span className={base.cardTitle}>{t('shop.product.delivery')}</span>}>
              <p>{p.returns}</p>
              <Link href="/policies/refunds/" className={base.textLinkChilli}>
                {t('common.footer.returns')}
              </Link>
            </Fold>
          ) : null}
        </div>
      </div>
      {related.length ? (
        <section className={base.bandPaper2} aria-labelledby="same-dabba">
          <div className={base.wrap}>
            <div className={base.bandHead}>
              <h2 id="same-dabba" className={base.section}>
                {t('shop.product.related')}
              </h2>
              <Link href={shelfHref} className={base.textLinkChilli}>
                {t('home.staples.all')}
                <Icon name="arrow" className={base.iconSmall} />
              </Link>
            </div>
            <ProductGrid products={related} four />
          </div>
        </section>
      ) : null}
    </Layout>
  )
}
