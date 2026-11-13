'use client'

import { useEffect, useRef, useState } from 'react'
import { Link, useCart, useStorefront } from '@dripfunnel/storefront-core/theme'
import { Icon } from '../Icon'
import base from '../../styles/base.module.css'

type Versions = { product: { versions: { id: string; inStock: boolean }[] } | null }

const versionsQuery = 'query($s:String!){product(slug:$s){versions{id,inStock}}}'

/** ADD THE BOX: one of each pack in a bundle, added together; the cart works out the price, offers included. */
export const AddBox = ({ slugs, label, tone = 'chilli' }: { slugs: readonly string[]; label: string; tone?: 'chilli' | 'ink' }) => {
  const { client, t } = useStorefront()
  const cart = useCart()
  const [state, setState] = useState<'idle' | 'adding' | 'added' | 'partial' | 'failed'>('idle')
  const done = useRef<HTMLAnchorElement>(null)
  const added = useRef(false)
  useEffect(() => {
    if (added.current) done.current?.focus()
    added.current = false
  }, [state])
  const add = async () => {
    setState('adding')
    let worked = 0
    for (const s of slugs) {
      try {
        const answer = await client.request<Versions>(versionsQuery, { s })
        const version = answer.product?.versions.find((v) => v.inStock) ?? null
        if (version && (await cart.add(version.id, 1))) worked += 1
      } catch {
        // A pack that can't be added is counted out; the shopper hears how many went in.
      }
    }
    added.current = worked > 0
    setState(worked === slugs.length ? 'added' : worked > 0 ? 'partial' : 'failed')
  }
  return (
    <div className={base.noticeActions}>
      {state === 'added' || state === 'partial' ? (
        <Link ref={done} href="/cart/" className={base.inverted}>
          {t('home.box.inCart')}
          <Icon name="arrow" className={base.iconSmall} />
        </Link>
      ) : (
        <button type="button" className={tone === 'ink' ? base.inverted : base.button} disabled={state === 'adding'} onClick={() => void add()}>
          {state === 'adding' ? t('home.box.adding') : label}
          <Icon name="arrow" className={base.iconSmall} />
        </button>
      )}
      <p className={base.meta} role="status">
        {state === 'added' ? t('home.box.added') : state === 'partial' ? t('home.box.partial') : state === 'failed' ? t('home.box.failed') : ''}
      </p>
    </div>
  )
}
