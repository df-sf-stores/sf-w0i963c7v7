'use client'

import { Link, useStorefront, useWishlist } from '@dripfunnel/storefront-core/theme'
import { Icon } from '../Icon'
import base from '../../styles/base.module.css'

/** The header's wishlist link, between Search and Account, with how many products it holds. */
export const WishlistTool = () => {
  const { t } = useStorefront()
  const { count } = useWishlist()
  return (
    <Link href="/account/wishlist/" className={base.tool}>
      <Icon name="heart" />
      <span className={base.hidden}>{count > 0 ? t('common.tools.wishlistCount', { count }) : t('common.tools.wishlist')}</span>
      {count > 0 ? (
        <span className={base.toolCount} aria-hidden="true">
          {count}
        </span>
      ) : null}
    </Link>
  )
}
