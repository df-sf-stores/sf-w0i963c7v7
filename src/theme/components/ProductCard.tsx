import { Image, Link, Price, ThemeImage, useStorefront, type ProductCard as Card } from '@dripfunnel/storefront-core/theme'
import { cutOut, packOf, shelfKey, teluguKey, type Family } from './catalog'
import { Diamond } from './Icon'
import { CardHeart } from './interactive/CardHeart'
import { QuickAdd } from './interactive/QuickAdd'
import base from '../styles/base.module.css'
import shop from '../styles/shop.module.css'

export const familyClass: Readonly<Record<Family, string>> = {
  chilli: shop.famChilli ?? '',
  ink: shop.famInk ?? '',
  mutton: shop.famMutton ?? '',
  rasam: shop.famRasam ?? '',
  sambar: shop.famSambar ?? '',
  turmeric: shop.famTurmeric ?? '',
  leaf: shop.famLeaf ?? '',
  indigo: shop.famIndigo ?? '',
}

/**
 * The pack floating on its family colour: the store's photo of it, else the theme's cut-out of that pack, else a clean
 * placeholder in the family colour carrying its Telugu name (PDF p23, rule 5).
 */
/** Where a pack shows, which tells the browser how wide its picture is drawn. */
export type PackPlace = 'card' | 'hero' | 'fan' | 'story'

const sizesFor: Readonly<Record<PackPlace, string>> = {
  card: '(min-width: 1100px) 22vw, (min-width: 768px) 30vw, 46vw',
  hero: '(min-width: 1100px) 34vw, 70vw',
  fan: '(min-width: 1100px) 14vw, 30vw',
  story: '(min-width: 1100px) 30vw, 60vw',
}

export const PackPicture = ({ product, place, className }: { product: Card; place: PackPlace; className?: string }) => {
  const { t } = useStorefront()
  const sizes = sizesFor[place]
  const pack = packOf(product.href)
  const own = pack.slug ? cutOut[pack.slug] : undefined
  if (product.photo) {
    return (
      <div className={className ?? shop.pack}>
        <Image image={product.photo} alt={t('catalog.card.packAlt', { name: product.name })} ratio={0.75} sizes={sizes} />
      </div>
    )
  }
  if (own) {
    return (
      <div className={className ?? shop.pack}>
        <ThemeImage src={own} alt={t('catalog.card.packAlt', { name: product.name })} ratio={0.75} sizes={sizes} />
      </div>
    )
  }
  return (
    <div className={shop.placeholder} role="img" aria-label={t('catalog.card.packAlt', { name: product.name })}>
      {pack.slug ? (
        <span className={shop.placeholderTelugu} lang="te">
          {t(teluguKey[pack.slug])}
        </span>
      ) : null}
      <span className={base.label}>{t('catalog.card.weight')}</span>
    </div>
  )
}

/** A product card (PDF p14): the colour block with its shelf tag, the corner diamond and the pack; then name, price and ADD. */
export const ProductCard = ({ product }: { product: Card }) => {
  const { store, locale, t } = useStorefront()
  const pack = packOf(product.href)
  return (
    <article className={shop.card}>
      <Link href={product.href} className={`${shop.tile} ${familyClass[pack.family]}`}>
        <span className={`${base.label} ${shop.tag}`}>{t(shelfKey[pack.shelf])}</span>
        <Diamond className={`${base.diamond} ${shop.corner}`} />
        <PackPicture product={product} place="card" />
        <span className={base.hidden}>{product.name}</span>
      </Link>
      <CardHeart productId={product.id} name={product.name} />
      <div className={shop.body}>
        {pack.slug ? (
          <p className={shop.teluguName} lang="te">
            {t(teluguKey[pack.slug])}
          </p>
        ) : null}
        <h3 className={base.cardTitle}>
          <Link href={product.href} className={shop.nameLink}>
            {product.name}
          </Link>
        </h3>
        <div className={shop.priceRow}>
          {product.price ? <Price money={product.price} compareAt={product.compareAt} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={shop.price} /> : null}
          <span className={shop.weight}>{t('catalog.card.weight')}</span>
        </div>
        <div className={shop.foot}>
          <span className={product.stock.inStock ? shop.stock : shop.stockOut}>{product.stock.inStock ? t('catalog.card.inStock') : t('catalog.card.soldOut')}</span>
          <QuickAdd href={product.href} name={product.name} inStock={product.stock.inStock} wide />
        </div>
      </div>
    </article>
  )
}

export const ProductGrid = ({ products, four = false }: { products: readonly Card[]; four?: boolean }) => (
  <ul className={four ? shop.gridFour : shop.grid}>
    {products.map((p) => (
      <li key={p.id} className={shop.cell}>
        <ProductCard product={p} />
      </li>
    ))}
  </ul>
)

/** The grid's shape while its products load, so nothing moves when they arrive. */
export const GridPlaceholder = ({ label, count, four = false }: { label: string; count: number; four?: boolean }) => (
  <ul className={four ? shop.gridFour : shop.grid} aria-busy="true" aria-label={label}>
    {[...Array(count).keys()].map((i) => (
      <li key={i} className={shop.cell}>
        <div className={shop.skeleton}>
          <div className={shop.skeletonTile} />
          <div className={shop.skeletonLine} />
        </div>
      </li>
    ))}
  </ul>
)
