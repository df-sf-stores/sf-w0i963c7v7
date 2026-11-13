'use client'

import { useEffect, useRef, useState } from 'react'
import { useCart, useStorefront } from '@dripfunnel/storefront-core/theme'
import { slugOf } from '../catalog'
import { Icon } from '../Icon'
import shop from '../../styles/shop.module.css'

type Versions = { product: { versions: { id: string; inStock: boolean }[] } | null }

// A card knows its product, not its version: the first version in stock is the pack a card's ADD puts in the cart.
const versionsQuery = 'query($s:String!){product(slug:$s){versions{id,inStock}}}'

/**
 * The square ADD on a product card. It adds one pack of the product's first version in stock, then says so for a moment;
 * the header's and tab bar's cart counts update from core's cart as it changes.
 */
export const QuickAdd = ({ href, name, inStock, tone = 'ink', label }: { href: string; name: string; inStock: boolean; tone?: 'ink' | 'white'; label?: string }) => {
  const { client, t } = useStorefront()
  const cart = useCart()
  const [state, setState] = useState<'idle' | 'adding' | 'added' | 'failed'>('idle')
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  const settle = (next: 'added' | 'failed') => {
    setState(next)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setState('idle'), 2200)
  }
  const add = async () => {
    if (state === 'adding') return
    setState('adding')
    try {
      const answer = await client.request<Versions>(versionsQuery, { s: slugOf(href) })
      const version = answer.product?.versions.find((v) => v.inStock) ?? null
      settle(version && (await cart.add(version.id, 1)) ? 'added' : 'failed')
    } catch {
      settle('failed')
    }
  }
  const words = state === 'added' ? t('catalog.card.added') : state === 'failed' ? t('catalog.card.failed') : state === 'adding' ? t('catalog.card.adding') : (label ?? t('catalog.card.add'))
  return (
    <>
      <button
        type="button"
        className={tone === 'white' ? shop.addWhite : state === 'added' ? shop.addDone : shop.add}
        disabled={!inStock || state === 'adding'}
        aria-label={inStock ? t('catalog.card.addNamed', { name }) : t('catalog.card.soldOutNamed', { name })}
        onClick={() => void add()}
      >
        {state === 'added' ? <Icon name="check" className={shop.addIcon} /> : null}
        <span aria-hidden="true">{inStock ? words : t('catalog.card.soldOut')}</span>
      </button>
      <span className={shop.live} role="status">
        {state === 'added' ? t('catalog.card.addedNamed', { name }) : state === 'failed' ? t('catalog.card.failed') : ''}
      </span>
    </>
  )
}
