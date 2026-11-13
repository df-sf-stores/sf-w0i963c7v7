'use client'

import { useId, useState } from 'react'
import { Link } from '@dripfunnel/storefront-core/theme'
import { Icon } from '../Icon'
import base from '../../styles/base.module.css'

/** One column of footer links: an accordion on phones, a plain column from 768px. */
export const FooterGroup = ({ title, links }: { title: string; links: readonly { href: string; label: string }[] }) => {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <nav className={base.footerGroup} aria-label={title}>
      <button type="button" className={base.footerToggle} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        <span className={base.label}>{title}</span>
        <span className={open ? base.foldTurnOpen : base.foldTurn}>
          <Icon name="plus" className={base.iconSmall} />
        </span>
      </button>
      <h2 className={`${base.label} ${base.footerHeading}`}>{title}</h2>
      <ul id={id} className={open ? base.footerLinksOpen : base.footerLinks}>
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className={base.footerLink}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
