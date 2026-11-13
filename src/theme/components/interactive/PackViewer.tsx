'use client'

import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { Image, ThemeImage, useStorefront, type Photo } from '@dripfunnel/storefront-core/theme'
import { cutOut, teluguKey, type Slug } from '../catalog'
import { Diamond, Icon } from '../Icon'
import base from '../../styles/base.module.css'
import product from '../../styles/product.module.css'

/**
 * The PDP viewer (PDF p6, p15): the pack on its family colour. Dragging or swiping turns it, and past a third of a turn
 * moves to the next view; the arrow keys do the same, and FRONT / BACK / LEFT / RIGHT / TOP pick a view outright. The
 * views are the store's photos of the pack, in order, so a view appears once its photo is uploaded.
 */
export const PackViewer = ({ photos, name, slug, ground }: { photos: readonly Photo[]; name: string; slug: Slug | null; ground: string }) => {
  const { t } = useStorefront()
  const [shown, setShown] = useState(0)
  const stage = useRef<HTMLDivElement>(null)
  const from = useRef<number | null>(null)
  const turned = useRef(0)
  const viewNames = [t('shop.viewer.front'), t('shop.viewer.back'), t('shop.viewer.left'), t('shop.viewer.right'), t('shop.viewer.top')]
  const views = photos.slice(0, viewNames.length)
  const turn = (deg: number) => {
    turned.current = deg
    stage.current?.style.setProperty('--turn', `${deg}deg`)
  }
  const step = (by: number) => {
    if (views.length > 1) setShown((shown + by + views.length) % views.length)
    turn(0)
  }
  const down = (e: PointerEvent<HTMLDivElement>) => {
    from.current = e.clientX
    stage.current?.setPointerCapture(e.pointerId)
  }
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (from.current === null) return
    turn(Math.max(-60, Math.min(60, (e.clientX - from.current) / 3)))
  }
  const up = (e: PointerEvent<HTMLDivElement>) => {
    if (from.current === null) return
    from.current = null
    if (stage.current?.hasPointerCapture(e.pointerId)) stage.current.releasePointerCapture(e.pointerId)
    const deg = turned.current
    if (Math.abs(deg) > 30) step(deg < 0 ? 1 : -1)
    else turn(0)
  }
  const keys = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') step(1)
    else if (e.key === 'ArrowLeft') step(-1)
  }
  const photo = views[Math.min(shown, views.length - 1)]
  const own = slug ? cutOut[slug] : undefined
  const alt = t('shop.viewer.alt', { name, view: viewNames[shown] ?? viewNames[0] ?? '' })
  return (
    <div className={`${product.viewer} ${ground}`}>
      <p className={product.chip}>
        <Icon name="rotate" className={base.iconSmall} />
        {t('shop.viewer.chip')}
      </p>
      <div
        ref={stage}
        className={product.stage}
        tabIndex={0}
        role="group"
        aria-roledescription={t('shop.viewer.role')}
        aria-label={t('shop.viewer.label', { name })}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onKeyDown={keys}
      >
        <Diamond className={`${base.diamond} ${product.viewerDiamond}`} />
        <div className={product.packFrame}>
          {photo ? (
            <Image image={photo} alt={alt} ratio={0.75} sizes="(min-width: 1100px) 34vw, 78vw" />
          ) : own ? (
            <ThemeImage src={own} alt={alt} ratio={0.75} sizes="(min-width: 1100px) 34vw, 78vw" />
          ) : (
            <div className={product.noPack} role="img" aria-label={alt}>
              {slug ? (
                <span className={product.noPackTelugu} lang="te">
                  {t(teluguKey[slug])}
                </span>
              ) : null}
              <span className={base.label}>{t('catalog.card.weight')}</span>
            </div>
          )}
        </div>
      </div>
      <p className={product.hint}>
        <Icon name="drag" className={base.iconSmall} />
        {t('shop.viewer.hint')}
      </p>
      {views.length > 1 ? (
        <div className={product.views} role="group" aria-label={t('shop.viewer.views')}>
          {views.map((p, i) => (
            <button key={p.url} type="button" className={i === shown ? product.viewOn : product.view} aria-pressed={i === shown} onClick={() => setShown(i)}>
              {viewNames[i]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
