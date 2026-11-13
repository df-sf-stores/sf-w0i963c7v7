import { useHead, useStorefront } from '@dripfunnel/storefront-core/theme'
import { CartView } from '../components/interactive/CartView'
import { Layout } from '../components/Layout'

export const CartPage = () => {
  const { t } = useStorefront()
  useHead({ title: t('shop.cart.title'), hidden: true })
  return (
    <Layout title={t('shop.cart.title')} back="/spices/" tab="cart" bar>
      <CartView />
    </Layout>
  )
}
