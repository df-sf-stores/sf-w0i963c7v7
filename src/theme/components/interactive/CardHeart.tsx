'use client'

import { clsx } from 'clsx'
import { useStorefront, useWishlist } from '@dripfunnel/storefront-core/theme'
import { Icon } from '../Icon'
import shop from '../../styles/shop.module.css'

/**
 * The wishlist heart, in a product card's corner or (with `big`) beside the product page's name: pressed when the product is
 * on the wishlist; signed out, it asks the shopper to sign in first.
 */
export const CardHeart = ({ productId, name, big = false }: { productId: string; name: string; big?: boolean }) => {
  const { t } = useStorefront()
  const wishlist = useWishlist()
  const on = wishlist.has(productId)
  const button = (
    <button
      type="button"
      className={clsx(big ? shop.heartBig : shop.heart, on && shop.heartOn)}
      aria-pressed={on}
      aria-label={t('shop.wishlist.heart', { name })}
      disabled={wishlist.busy || wishlist.status === 'loading'}
      onClick={() => void wishlist.toggle(productId)}
    >
      <Icon name="heart" className={shop.heartIcon} />
    </button>
  )
  if (!big || !wishlist.error) return button
  return (
    <>
      {button}
      <p className={shop.heartNote} role="status">
        {wishlist.error === 'LIMIT' ? t('shop.wishlist.full') : t('shop.wishlist.failed')}
      </p>
    </>
  )
}
