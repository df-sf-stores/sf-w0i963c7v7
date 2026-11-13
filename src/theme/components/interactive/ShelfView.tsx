'use client'

import { useRef, useState } from 'react'
import { Checkbox, Link, PriceRange, navigate, useLoadOnScroll, useLocation, useOffers, useStorefront, type Listing, type SortKey } from '@dripfunnel/storefront-core/theme'
import { packOf, shelfKey, type Shelf } from '../catalog'
import { Icon } from '../Icon'
import { GridPlaceholder, ProductGrid } from '../ProductCard'
import { Retry } from './Retry'
import { Sheet } from './Sheet'
import base from '../../styles/base.module.css'
import shop from '../../styles/shop.module.css'

const shelfNames = ['blend', 'single', 'snack'] as const

/** The shelf the address names (`?shelf=blend,single`), kept beside core's own filters in the query. */
const chosenShelves = (query: URLSearchParams): Shelf[] =>
  (query.get('shelf') ?? '')
    .split(',')
    .filter((s): s is Shelf => shelfNames.some((n) => n === s))

/**
 * A shelf of products (PDF p4, p5, p14): on phones, Filter and Sort buttons that open bottom sheets; from 1100px, a
 * sidebar of checkbox groups with counts and a three-up grid. Core keeps its filters and sort in the address; the shelf
 * (blend, single, snack) rides there too, so every view can be linked to and survives a refresh.
 */
export const ShelfView = ({ listing, shelves = [] }: { listing: Listing; shelves?: readonly Shelf[] }) => {
  const { t } = useStorefront()
  const { path, query } = useLocation()
  const { offers } = useOffers()
  const [sheet, setSheet] = useState<'filter' | 'sort' | null>(null)
  const filterButton = useRef<HTMLButtonElement>(null)
  const sortButton = useRef<HTMLButtonElement>(null)
  const end = useLoadOnScroll(listing)
  const picked = chosenShelves(query).filter((s) => shelves.includes(s))
  const items = picked.length ? listing.items.filter((p) => picked.includes(packOf(p.href).shelf)) : listing.items
  const countOf = (s: Shelf) => listing.items.filter((p) => packOf(p.href).shelf === s).length
  const setShelves = (next: Shelf[]) => {
    const kept = query
      .toString()
      .split('&')
      .filter((pair) => pair !== '' && !pair.startsWith('shelf='))
    const rest = [...kept, ...(next.length ? [`shelf=${next.join(',')}`] : [])].join('&')
    navigate(rest ? `${path}?${rest}` : path, { replace: true })
  }
  const toggleShelf = (s: Shelf) => setShelves(picked.includes(s) ? picked.filter((p) => p !== s) : [...picked, s])
  const priced = listing.priceRange.min !== null || listing.priceRange.max !== null
  const on = picked.length + listing.selected.length + Number(priced)
  const clearAll = () => {
    if (picked.length) setShelves([])
    if (listing.selected.length || priced) listing.clear()
  }
  const sortLabels: Record<SortKey, string> = {
    featured: t('shop.listing.sorts.featured'),
    newest: t('shop.listing.sorts.newest'),
    'price-low': t('shop.listing.sorts.priceLow'),
    'price-high': t('shop.listing.sorts.priceHigh'),
    name: t('shop.listing.sorts.name'),
  }
  const offer = offers.find((o) => o.appliesTo !== 'shipping') ?? null
  const usedShelves = shelves.filter((s) => countOf(s) > 0)
  const priceRange = listing.priceBounds ? (
    <PriceRange
      bounds={listing.priceBounds}
      value={listing.priceRange}
      onChange={listing.setPriceRange}
      label={t('shop.listing.price')}
      className={shop.priceRange}
      parts={{ track: shop.priceTrack, rail: shop.priceRail, fill: shop.priceFill, tick: shop.priceTick, thumb: shop.priceThumb, ends: shop.priceEnds, select: shop.priceSelect, to: shop.priceTo }}
    />
  ) : null

  return (
    <div className={`${base.wrap} ${shop.shelf}`}>
      <aside className={shop.sidebar} aria-label={t('catalog.shelf.filter')}>
        <h2 className={shop.sideTitle}>{t('catalog.shelf.filter')}</h2>
        {usedShelves.length > 1 ? (
          <div role="group" aria-label={t('catalog.shelf.category')} className={shop.group}>
            <p className={`${base.label} ${shop.groupName}`}>{t('catalog.shelf.category')}</p>
            {usedShelves.map((s) => (
              <Checkbox key={s} checked={picked.includes(s)} onChange={() => toggleShelf(s)} className={shop.check}>
                {t(shelfKey[s])} <span className={shop.checkCount}>({countOf(s)})</span>
              </Checkbox>
            ))}
          </div>
        ) : null}
        {listing.facets.map((facet) => (
          <div key={facet.id} role="group" aria-label={facet.name} className={shop.group}>
            <p className={`${base.label} ${shop.groupName}`}>{facet.name}</p>
            {facet.values.map((value) => (
              <Checkbox key={value.id} checked={value.selected} onChange={() => listing.toggle(value.id)} className={shop.check}>
                {value.name} <span className={shop.checkCount}>({value.count})</span>
              </Checkbox>
            ))}
          </div>
        ))}
        {priceRange ? (
          <div className={shop.group}>
            <p className={`${base.label} ${shop.groupName}`}>{t('shop.listing.price')}</p>
            {priceRange}
          </div>
        ) : null}
        {offer ? (
          <div className={shop.promo}>
            <p className={shop.promoTitle}>{offer.name}</p>
            {offer.description ? <p className={base.meta}>{offer.description}</p> : null}
          </div>
        ) : (
          <div className={shop.promo}>
            <p className={shop.promoTitle}>{t('catalog.shelf.promoTitle')}</p>
            <p>{t('catalog.shelf.promoLead')}</p>
          </div>
        )}
      </aside>

      <div className={shop.results}>
        <div className={shop.mobileTools}>
          <button ref={filterButton} type="button" className={shop.toolButton} aria-haspopup="dialog" onClick={() => setSheet('filter')}>
            <span className={shop.toolLabel}>
              <Icon name="filter" className={base.iconSmall} />
              {on ? t('catalog.shelf.filterOn', { count: on }) : t('catalog.shelf.filter')}
            </span>
            {on ? <span className={base.badge}>{on}</span> : null}
          </button>
          <button ref={sortButton} type="button" className={shop.toolButton} aria-haspopup="dialog" onClick={() => setSheet('sort')}>
            <span className={shop.toolLabel}>{sortLabels[listing.sort]}</span>
            <Icon name="down" className={base.iconSmall} />
          </button>
        </div>
        <div className={shop.toolbar}>
          <p className={shop.count} role="status">
            {listing.status === 'ready' ? t('catalog.shelf.count', { count: items.length }) : t('shop.listing.loading')}
          </p>
          <div className={shop.sortDesk} role="group" aria-label={t('shop.listing.sort')}>
            <span>{t('shop.listing.sort')}</span>
            <div className={shop.chips}>
              {listing.sorts.map((s) => (
                <button key={s} type="button" className={s === listing.sort ? base.chipOn : base.chip} aria-pressed={s === listing.sort} onClick={() => listing.setSort(s)}>
                  {sortLabels[s]}
                </button>
              ))}
            </div>
          </div>
          {on ? (
            <div className={shop.chips}>
              {picked.map((s) => (
                <button key={s} type="button" className={base.chip} aria-label={t('shop.listing.remove', { name: t(shelfKey[s]) })} onClick={() => toggleShelf(s)}>
                  {t(shelfKey[s])}
                  <Icon name="close" className={base.iconSmall} />
                </button>
              ))}
              {listing.selected.map((s) => (
                <button key={s.id} type="button" className={base.chip} aria-label={t('shop.listing.remove', { name: s.name })} onClick={() => listing.toggle(s.id)}>
                  {s.name}
                  <Icon name="close" className={base.iconSmall} />
                </button>
              ))}
              <button type="button" className={base.textLink} onClick={clearAll}>
                {t('shop.listing.clear')}
              </button>
            </div>
          ) : null}
        </div>

        {listing.status === 'loading' ? <GridPlaceholder label={t('shop.listing.loading')} count={6} /> : null}
        {listing.status === 'error' ? (
          <div className={shop.empty}>
            <h2 className={base.small}>{t('shop.listing.failed')}</h2>
            <p className={base.meta}>{t('shop.listing.failedLead')}</p>
            <Retry label={t('shop.listing.retry')} onRetry={listing.retry} />
          </div>
        ) : null}
        {listing.status === 'ready' && items.length === 0 ? (
          <div className={shop.empty}>
            <h2 className={base.small}>{on ? t('shop.listing.empty') : t('shop.collection.empty')}</h2>
            <p className={base.meta}>{on ? t('shop.listing.emptyLead') : t('shop.collection.emptyLead')}</p>
            {on ? (
              <button type="button" className={base.secondary} onClick={clearAll}>
                {t('shop.listing.clear')}
              </button>
            ) : (
              <Link href="/spices/" className={base.button}>
                {t('catalog.shelf.backToShelf')}
              </Link>
            )}
          </div>
        ) : null}
        {listing.status === 'ready' && items.length ? <ProductGrid products={items} /> : null}
        <div ref={end} className={shop.more}>
          {listing.loadingMore ? (
            <p className={base.meta} role="status">
              {t('shop.listing.loadingMore')}
            </p>
          ) : null}
          {listing.moreFailed ? <Retry label={t('shop.listing.retry')} onRetry={listing.fetchMore} /> : null}
        </div>
      </div>

      <Sheet
        open={sheet === 'filter'}
        title={t('catalog.shelf.filter')}
        closeLabel={t('common.nav.close')}
        onClose={() => setSheet(null)}
        returnTo={filterButton}
        footer={
          <>
            <button type="button" className={base.secondary} onClick={clearAll} disabled={!on}>
              {t('shop.listing.clear')}
            </button>
            <button type="button" className={base.button} onClick={() => setSheet(null)}>
              {t('catalog.shelf.show', { count: items.length })}
            </button>
          </>
        }
      >
        {usedShelves.length > 1 ? (
          <div role="group" aria-label={t('catalog.shelf.category')} className={shop.chipGroup}>
            <p className={base.label}>{t('catalog.shelf.category')}</p>
            <div className={shop.chips}>
              {usedShelves.map((s) => (
                <button key={s} type="button" className={picked.includes(s) ? base.chipOn : base.chip} aria-pressed={picked.includes(s)} onClick={() => toggleShelf(s)}>
                  {t(shelfKey[s])} ({countOf(s)})
                </button>
              ))}
            </div>
          </div>
        ) : null}
        {listing.facets.map((facet) => (
          <div key={facet.id} role="group" aria-label={facet.name} className={shop.chipGroup}>
            <p className={base.label}>{facet.name}</p>
            <div className={shop.chips}>
              {facet.values.map((value) => (
                <button key={value.id} type="button" className={value.selected ? base.chipOn : base.chip} aria-pressed={value.selected} onClick={() => listing.toggle(value.id)}>
                  {value.name} ({value.count})
                </button>
              ))}
            </div>
          </div>
        ))}
        {priceRange ? (
          <div className={shop.chipGroup}>
            <p className={base.label}>{t('shop.listing.price')}</p>
            {priceRange}
          </div>
        ) : null}
        {usedShelves.length < 2 && listing.facets.length === 0 && !priceRange ? <p className={base.meta}>{t('catalog.shelf.noFilters')}</p> : null}
      </Sheet>

      <Sheet open={sheet === 'sort'} title={t('shop.listing.sort')} closeLabel={t('common.nav.close')} onClose={() => setSheet(null)} returnTo={sortButton}>
        <div role="group" aria-label={t('shop.listing.sort')}>
          {listing.sorts.map((s) => (
            <button
              key={s}
              type="button"
              className={s === listing.sort ? shop.optionOn : shop.option}
              aria-pressed={s === listing.sort}
              onClick={() => {
                listing.setSort(s)
                setSheet(null)
              }}
            >
              {sortLabels[s]}
              {s === listing.sort ? <Icon name="check" /> : null}
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  )
}
