'use client'

import { useId, useState, type ReactNode } from 'react'
import { clsx } from 'clsx'
import { Icon } from '../Icon'
import base from '../../styles/base.module.css'

/**
 * Progressive disclosure (PDF p24): a section that folds on narrow screens, its button inside the section's heading.
 * With `wide`, it stands open from 1100px: the button steps aside and the same heading shows as plain text.
 */
export const Fold = ({
  title,
  children,
  wide = false,
  first = false,
  level = 2,
  id,
  className,
}: {
  title: ReactNode
  children: ReactNode
  wide?: boolean
  first?: boolean
  level?: 2 | 3
  id?: string
  className?: string
}) => {
  const [open, setOpen] = useState(first)
  const own = useId()
  const panel = `${id ?? own}-panel`
  const button = (
    <button type="button" className={base.foldButton} aria-expanded={open} aria-controls={panel} onClick={() => setOpen(!open)}>
      {title}
      <span className={open ? base.foldTurnOpen : base.foldTurn}>
        <Icon name="plus" />
      </span>
    </button>
  )
  return (
    <section id={id} className={clsx(base.fold, wide && base.foldWide, className)}>
      {level === 2 ? <h2 className={base.foldHead}>{button}</h2> : <h3 className={base.foldHead}>{button}</h3>}
      <div id={panel} className={open ? base.foldPanelOpen : base.foldPanel}>
        {wide ? level === 2 ? <h2 className={base.foldHeading}>{title}</h2> : <h3 className={base.foldHeading}>{title}</h3> : null}
        {children}
      </div>
    </section>
  )
}
