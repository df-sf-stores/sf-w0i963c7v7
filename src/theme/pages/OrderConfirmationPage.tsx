import { useHead, useStorefront } from '@dripfunnel/storefront-core/theme'
import { OrderView } from '../components/interactive/OrderView'
import { Layout } from '../components/Layout'

export const OrderConfirmationPage = () => {
  const { t } = useStorefront()
  useHead({ title: t('shop.order.title'), hidden: true })
  return (
    <Layout title={t('shop.order.title')} tab={null}>
      <OrderView />
    </Layout>
  )
}
