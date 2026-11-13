import { ConsentSettingsButton, Link, ThemeImage, useStorefront } from '@dripfunnel/storefront-core/theme'
import { clsx } from 'clsx'
import { oneLine } from './contact'
import base from '../styles/base.module.css'

/** Show the "Cookie settings" button in the bar (it reopens core's consent banner). */
const COOKIE_BUTTON = true
/** The logo's file in src/theme/media/ and its natural ratio (2077 x 369). */
const LOGO_FILE = 'dripfunnel-white-logo.png'
const LOGO_RATIO = 2077 / 369

/**
 * The thin bar at the very foot of every page: copyright on the left; Cookie settings, a divider, "Powered by" and the
 * DripFunnel logo on the right. It sits inside the page's <footer> as its last child, so it shares the footer's
 * background (var(--ink)) and never declares one of its own. `className` places it in a footer that is not the main one.
 *
 * The copyright line is common.footer.company with the store's address from Settings; its year is written in that
 * content, as a theme may not read the clock. The logo goes through core's
 * <Link>, the only link a theme may render; it opens a new tab in the studio, the same tab on the live site.
 */
export const FooterBar = ({ className }: { className?: string }) => {
  const { store, t } = useStorefront()
  const address = oneLine(store.address)
  return (
    <div className={clsx(base.bottomBar, className)}>
      <div className={clsx(base.wrap, base.baseInner)}>
        <p className={base.copyright}>{address ? t('common.footer.company', { address }) : t('common.footer.companyOnly')}</p>
        <div className={base.baseEnd}>
          {COOKIE_BUTTON ? (
            <>
              <ConsentSettingsButton t={t} className={base.cookies} />
              <span className={base.divider} aria-hidden="true" />
            </>
          ) : null}
          <span className={base.poweredRow}>
            <span className={base.powered}>{t('common.footer.poweredBy')}</span>
            <Link href={t('common.footer.poweredUrl')} className={base.brandLink}>
              <ThemeImage src={LOGO_FILE} alt={t('common.footer.poweredLogo')} ratio={LOGO_RATIO} sizes="104px" className={base.brandLogo} />
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}
