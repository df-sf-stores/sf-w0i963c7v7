'use client'

import { useEffect, useRef, useState } from 'react'
import { AddToCart, Link, Price, useStorefront, type ProductPage } from '@dripfunnel/storefront-core/theme'
import { Icon } from '../Icon'
import base from '../../styles/base.module.css'
import product from '../../styles/product.module.css'

const Stepper = ({ value, onChange, name, tone = 'paper' }: { value: number; onChange: (n: number) => void; name: string; tone?: 'paper' | 'white' }) => {
  const { t } = useStorefront()
  return (
    <div className={tone === 'white' ? product.stepperWhite : product.stepper} role="group" aria-label={t('shop.cart.quantity', { name })}>
      <button type="button" className={product.stepButton} disabled={value <= 1} onClick={() => onChange(Math.max(1, value - 1))}>
        <Icon name="minus" className={base.iconSmall} />
        <span className={base.hidden}>{t('shop.cart.less')}</span>
      </button>
      <span className={product.stepValue} aria-live="polite">
        {value}
      </span>
      <button type="button" className={product.stepButton} disabled={value >= 20} onClick={() => onChange(Math.min(20, value + 1))}>
        <Icon name="plus" className={base.iconSmall} />
        <span className={base.hidden}>{t('shop.cart.more')}</span>
      </button>
    </div>
  )
}

/**
 * One decision per screen (PDF p24): the PDP picks a size. Each of the product's options shows as size cards; then the
 * quantity and ADD TO CART, inline from 1100px and in a sticky bar at the thumb on phones.
 */
export const BuyBox = ({ page }: { page: ProductPage }) => {
  const { store, locale, t } = useStorefront()
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState<'added' | 'failed' | null>(null)
  const goToCart = useRef<HTMLAnchorElement>(null)
  const justAdded = useRef(false)
  useEffect(() => {
    if (note === 'added' && justAdded.current) goToCart.current?.focus()
    justAdded.current = false
  }, [note])
  const p = page.product
  if (!p) return null
  const version = page.version
  const buyable = version !== null && version.stock.inStock
  const versionFor = (optionId: string, valueId: string) => p.versions.find((v) => Object.entries(v.choices).some(([o, chosen]) => o === optionId && chosen === valueId)) ?? null
  const done = (worked: boolean) => {
    justAdded.current = worked
    setNote(worked ? 'added' : 'failed')
  }
  const price = page.price ? <Price money={page.price} compareAt={page.compareAt} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={product.buttonPrice} /> : null
  const missing = page.missing[0]
  return (
    <div className={product.buy}>
      {page.options.length ? (
        page.options.map((option) => (
          <div key={option.id} role="group" aria-label={option.name} className={product.sizes}>
            {option.values.map((value) => {
              const v = page.options.length === 1 ? versionFor(option.id, value.id) : null
              return (
                <button key={value.id} type="button" className={value.selected ? product.sizeOn : product.size} aria-pressed={value.selected} onClick={() => page.choose(option.id, value.id)}>
                  <span className={product.sizeTop}>
                    <span className={product.sizeName}>{value.name}</span>
                    <span className={value.selected ? product.tickOn : product.tick} aria-hidden="true" />
                  </span>
                  {v?.price ? <Price money={v.price} compareAt={v.compareAt} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={product.sizePrice} /> : null}
                  {value.available ? null : <span className={base.meta}>{t('shop.product.outOfStock')}</span>}
                </button>
              )
            })}
          </div>
        ))
      ) : (
        <div className={product.sizes} role="group" aria-label={t('shop.product.size')}>
          <div className={product.sizeOn}>
            <span className={product.sizeTop}>
              <span className={product.sizeName}>{t('shop.product.onePack')}</span>
              <span className={product.tickOn} aria-hidden="true" />
            </span>
            {page.price ? <Price money={page.price} compareAt={page.compareAt} includesTax={store.pricesIncludeTax} locale={locale} t={t} className={product.sizePrice} /> : null}
          </div>
        </div>
      )}
      <p className={product.stock} role="status">
        {missing ? t('shop.product.choose', { option: missing.name }) : page.stock?.inStock ? t('shop.product.inStock') : t('shop.product.outOfStock')}
      </p>
      <div className={product.addRow}>
        <Stepper value={quantity} onChange={setQuantity} name={p.name} tone="white" />
        <AddToCart versionId={version?.id ?? null} quantity={quantity} disabled={!buyable} className={product.addInk} onDone={done}>
          {t('shop.product.add')}
          {price ? <span aria-hidden="true">·</span> : null}
          {price}
          <Icon name="arrow" className={base.iconSmall} />
        </AddToCart>
      </div>
      {note ? (
        <p className={product.added} role="status">
          {note === 'added' ? t('shop.product.added') : t('shop.product.addFailed')}
          {note === 'added' ? (
            <Link ref={goToCart} href="/cart/" className={base.textLinkChilli}>
              {t('shop.product.goToCart')}
            </Link>
          ) : null}
        </p>
      ) : null}
      <div className={`${base.actionBar} ${product.mobileBar}`}>
        <div className={product.barPrice}>{price}</div>
        <Stepper value={quantity} onChange={setQuantity} name={p.name} />
        <AddToCart versionId={version?.id ?? null} quantity={quantity} disabled={!buyable} className={base.button} onDone={done}>
          {t('shop.product.addShort')}
          <Icon name="arrow" className={base.iconSmall} />
        </AddToCart>
      </div>
    </div>
  )
}
