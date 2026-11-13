import { Link, Price, ThemeImage, useProductCards, useProducts, useStorefront } from '@dripfunnel/storefront-core/theme'
import { AddBox } from '../components/interactive/AddBox'
import { QuickAdd } from '../components/interactive/QuickAdd'
import { packOf, staples, starterBox, teluguKey } from '../components/catalog'
import { Diamond, Icon } from '../components/Icon'
import { Layout } from '../components/Layout'
import { GridPlaceholder, PackPicture, ProductGrid } from '../components/ProductCard'
import base from '../styles/base.module.css'
import shop from '../styles/shop.module.css'
import pages from '../styles/pages.module.css'

/** The store's tagline as the hero's three lines ("Real Flavour. Real Aroma. Real Quality."), read from Site settings. */
const taglineLines = (tagline: string | null | undefined): string[] =>
  (tagline ?? '')
    .split(/(?<=\.)\s+/)
    .map((l) => l.trim())
    .filter(Boolean)

export const HomePage = () => {
  const { store, locale, t } = useStorefront()
  const shelf = useProducts({ first: 24 })
  const kitchen = useProductCards(staples)
  const box = useProductCards(starterBox)
  const fromStore = taglineLines(store.tagline)
  const lines = fromStore.length === 3 ? fromStore : [t('home.hero.line1'), t('home.hero.line2'), t('home.hero.line3')]
  const garam = kitchen.cards.find((c) => packOf(c.href).slug === 'garam-masala') ?? null
  const count = (s: 'blend' | 'single' | 'snack') => shelf.products.filter((p) => packOf(p.href).shelf === s).length
  const counted = shelf.status === 'ready'
  const tiles = [
    { href: '/spices/?shelf=blend', tone: shop.famChilli, eyebrow: counted ? t('home.shelf.blendCount', { count: count('blend') }) : t('home.shelf.blendEyebrow'), title: t('home.shelf.blendTitle'), blurb: t('home.shelf.blendBlurb'), image: 'blended_spice.png' as const, alt: t('home.shelf.blendAlt') },
    { href: '/spices/?shelf=single', tone: shop.famLeaf, eyebrow: counted ? t('home.shelf.singleCount', { count: count('single') }) : t('home.shelf.singleEyebrow'), title: t('home.shelf.singleTitle'), blurb: t('home.shelf.singleBlurb'), image: 'single-spices.png' as const, alt: t('home.shelf.singleAlt') },
    { href: '/snacks/', tone: shop.famIndigo, eyebrow: counted ? t('home.shelf.snackCount', { count: count('snack') }) : t('home.shelf.snackEyebrow'), title: t('home.shelf.snackTitle'), blurb: t('home.shelf.snackBlurb'), image: 'snacks.png' as const, alt: t('home.shelf.snackAlt') },
  ]
  const steps = [
    { title: t('home.field.s1Title'), body: t('home.field.s1Body') },
    { title: t('home.field.s2Title'), body: t('home.field.s2Body') },
    { title: t('home.field.s3Title'), body: t('home.field.s3Body') },
    { title: t('home.field.s4Title'), body: t('home.field.s4Body') },
  ]
  const trust = [
    { icon: 'shield' as const, title: t('home.trust.sealTitle'), body: t('home.trust.sealBody') },
    { icon: 'truck' as const, title: t('home.trust.shipTitle'), body: t('home.trust.shipBody') },
    { icon: 'receipt' as const, title: t('home.trust.gstTitle'), body: t('home.trust.gstBody') },
    { icon: 'leaf' as const, title: t('home.trust.pureTitle'), body: t('home.trust.pureBody') },
  ]
  return (
    <Layout tab="shop">
      <section className={pages.hero} aria-labelledby="home-title">
        <div className={pages.heroInk}>
          <Diamond className={`${base.diamond} ${pages.heroDiamond}`} />
          <div className={pages.heroCopy}>
            <p className={`${base.label} ${base.turmericText}`}>{t('home.hero.eyebrow')}</p>
            <h1 id="home-title" className={base.hero}>
              <span className={pages.line}>{lines[0]}</span>
              <span className={`${pages.line} ${base.turmericText}`}>{lines[1]}</span>
              <span className={pages.line}>{lines[2]}</span>
            </h1>
            <p className={pages.heroLead}>{t('home.hero.lead')}</p>
            <div className={pages.heroActions}>
              <Link href="/spices/" className={`${base.onInk} ${pages.heroPrimary}`}>
                {t('home.hero.shop')}
                <Icon name="arrow" className={base.iconSmall} />
              </Link>
              <Link href="/quality/" className={`${base.ghostOnInk} ${base.desktopOnly}`}>
                {t('home.hero.source')}
              </Link>
            </div>
          </div>
        </div>
        <div className={pages.heroPack}>
          <span className={pages.ghost} aria-hidden="true">
            {t('home.hero.ghost')}
          </span>
          <div className={pages.heroPackImage}>
            {garam ? <PackPicture product={garam} place="hero" className={pages.heroPackFrame} /> : <ThemeImage src="blended_spice.png" alt={t('home.hero.packAlt')} ratio={0.74} sizes="(min-width: 1100px) 34vw, 70vw" />}
          </div>
          {garam ? (
            <Link href={garam.href} className={pages.heroTag}>
              <span className={`${base.label} ${base.turmericText}`}>{t('home.hero.tag')}</span>
              <span className={base.cardTitle}>{garam.name}</span>
              <span className={pages.heroTagMeta}>
                {garam.price ? <Price money={garam.price} compareAt={garam.compareAt} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={pages.inkPrice} /> : null}
                <span>{t('catalog.card.weight')}</span>
              </span>
            </Link>
          ) : null}
        </div>
        {garam ? (
          <div className={pages.heroStrip}>
            <div>
              <p className={base.cardTitle}>{garam.name}</p>
              <p className={pages.stripMeta}>
                {garam.price ? <Price money={garam.price} compareAt={garam.compareAt} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={pages.inkPrice} /> : null}
                <span>{t('catalog.card.weight')}</span>
              </p>
            </div>
            <QuickAdd href={garam.href} name={garam.name} inStock={garam.stock.inStock} tone="white" />
          </div>
        ) : null}
      </section>

      <section className={base.band} aria-labelledby="home-shelf">
        <div className={base.wrap}>
          <div className={base.bandHead}>
            <h2 id="home-shelf" className={base.section}>
              {t('home.shelf.title')}
            </h2>
            <p className={base.bandNote}>{t('home.shelf.note')}</p>
          </div>
          <ul className={shop.tiles}>
            {tiles.map((tile) => (
              <li key={tile.href}>
                <Link href={tile.href} className={`${shop.catTile} ${tile.tone}`}>
                  <Diamond className={`${base.diamond} ${shop.corner}`} />
                  <span className={shop.catText}>
                    <span className={base.label}>{tile.eyebrow}</span>
                    <span className={base.small}>{tile.title}</span>
                    <span className={shop.catBlurb}>{tile.blurb}</span>
                  </span>
                  <span className={shop.catPack}>
                    <ThemeImage src={tile.image} alt={tile.alt} ratio={0.75} sizes="(min-width: 768px) 14vw, 36vw" />
                  </span>
                  <span className={`${base.label} ${shop.catFoot}`}>
                    {t('home.shelf.browse')}
                    <Icon name="arrow" className={base.iconSmall} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={base.bandPaper2} aria-labelledby="home-staples">
        <div className={base.wrap}>
          <div className={base.bandHead}>
            <div>
              <p className={`${base.label} ${base.chilliText}`}>{t('home.staples.eyebrow')}</p>
              <h2 id="home-staples" className={base.section}>
                {t('home.staples.title')}
              </h2>
            </div>
            <Link href="/spices/" className={base.textLinkChilli}>
              {counted ? t('home.staples.allCount', { count: shelf.products.length }) : t('home.staples.all')}
              <Icon name="arrow" className={base.iconSmall} />
            </Link>
          </div>
          {kitchen.status === 'loading' ? <GridPlaceholder label={t('shop.listing.loading')} count={4} four /> : <ProductGrid products={kitchen.cards} four />}
        </div>
      </section>

      <section className={base.bandInk} aria-labelledby="home-field">
        <div className={base.wrap}>
          <div className={base.bandHead}>
            <h2 id="home-field" className={base.section}>
              {t('home.field.title')} <span className={base.turmericText}>{t('home.field.titleEnd')}</span>
            </h2>
            <p className={base.bandNote}>{t('home.field.note')}</p>
          </div>
          <ol className={pages.steps}>
            {steps.map((s, i) => (
              <li key={s.title} className={pages.step}>
                <span className={`${base.section} ${base.turmericText}`} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={base.cardTitle}>{s.title}</h3>
                <p className={pages.stepBody}>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={pages.bundle} aria-labelledby="home-box">
        <div className={pages.bundleCopy}>
          <p className={`${base.label} ${base.chilliText}`}>{t('home.box.eyebrow')}</p>
          <h2 id="home-box" className={base.section}>
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
          <AddBox slugs={starterBox} label={t('home.box.add')} />
          <Link href="/bundles/" className={base.textLink}>
            {t('home.box.inside')}
            <Icon name="arrow" className={base.iconSmall} />
          </Link>
        </div>
        <div className={pages.bundleArt}>
          <Diamond className={`${base.diamond} ${pages.bundleDiamond}`} />
          <ul className={pages.fan} aria-label={t('home.box.packs')}>
            {box.cards.map((c) => (
              <li key={c.id} className={pages.fanPack}>
                <PackPicture product={c} place="fan" className={pages.fanFrame} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={pages.trust} aria-label={t('home.trust.label')}>
        <ul className={`${base.wrap} ${pages.trustList}`}>
          {trust.map((item) => (
            <li key={item.title} className={pages.trustItem}>
              <Icon name={item.icon} />
              <span>
                <span className={pages.trustTitle}>{item.title}</span>
                <span className={pages.trustBody}>{item.body}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}
