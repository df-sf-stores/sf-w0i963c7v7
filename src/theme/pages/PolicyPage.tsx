import { useLocation } from '@dripfunnel/storefront-core/theme'
import { PolicyTemplate } from '../components/PolicyTemplate'

/** /policies/{privacy|terms|refunds|shipping}/; core's older /policies/returns/ reads as refunds. */
export const PolicyPage = () => {
  const { path } = useLocation()
  const slug = path.split('/').filter(Boolean)[1] ?? ''
  const kind = slug === 'terms' ? 'terms' : slug === 'shipping' ? 'shipping' : slug === 'refunds' || slug === 'returns' ? 'refunds' : slug === 'legal' ? 'fssai' : 'privacy'
  return <PolicyTemplate kind={kind} withTabs={kind !== 'fssai'} />
}
