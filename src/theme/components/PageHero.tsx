import type { ReactNode } from 'react'
import { Breadcrumbs, useStorefront, type Crumb } from '@dripfunnel/storefront-core/theme'
import { Diamond } from './Icon'
import base from '../styles/base.module.css'

/** An inner page's hero (PDF p14, p19, p20): crumbs, the one h1, its Telugu line and an intro, with the corner diamond. */
export const PageHero = ({
  title,
  telugu,
  intro,
  crumbs,
  tone = 'ink',
  children,
}: {
  title: string
  telugu?: string
  intro?: string | null
  crumbs?: readonly Crumb[]
  tone?: 'ink' | 'indigo'
  children?: ReactNode
}) => {
  const { t } = useStorefront()
  return (
    <section className={tone === 'indigo' ? base.pageHeroIndigo : base.pageHero}>
      <Diamond className={`${base.diamond} ${base.heroDiamond}`} />
      <div className={`${base.wrap} ${base.pageHeroInner}`}>
        <div className={base.pageHeroText}>
          {crumbs?.length ? <Breadcrumbs crumbs={crumbs} t={t} className={base.crumbs} /> : null}
          <h1 className={base.pageTitle}>{title}</h1>
          {telugu ? (
            <p className={base.pageHeroTelugu} lang="te">
              {telugu}
            </p>
          ) : null}
        </div>
        {intro || children ? (
          <div className={base.pageHeroText}>
            {intro ? <p className={base.pageHeroIntro}>{intro}</p> : null}
            {children}
          </div>
        ) : null}
      </div>
    </section>
  )
}
