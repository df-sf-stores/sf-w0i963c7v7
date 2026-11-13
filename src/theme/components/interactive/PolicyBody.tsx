'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useInView } from '@dripfunnel/storefront-core/theme'
import { Fold } from './Fold'
import base from '../../styles/base.module.css'
import story from '../../styles/story.module.css'

export type DocSection = { id: string; title: string; body: string }

const Watched = ({ onSeen, children }: { onSeen: (seen: boolean) => void; children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref)
  useEffect(() => onSeen(seen), [seen, onSeen])
  return <div ref={ref}>{children}</div>
}

/**
 * A policy's numbered sections (PDF p12, p21): accordions on phones; open from 1100px beside a sticky "On this page" list
 * that marks the section on screen.
 */
export const PolicyBody = ({ sections, tocLabel, lead, aside }: { sections: readonly DocSection[]; tocLabel: string; lead: ReactNode; aside: ReactNode }) => {
  const [seen, setSeen] = useState<readonly string[]>([])
  const current = sections.find((s) => seen.includes(s.id))?.id ?? sections[0]?.id
  const [mark] = useState(() => new Map<string, (v: boolean) => void>())
  const reporter = (id: string) => {
    const known = mark.get(id)
    if (known) return known
    const made = (v: boolean) => setSeen((prev) => (prev.includes(id) === v ? prev : v ? [...prev, id] : prev.filter((x) => x !== id)))
    mark.set(id, made)
    return made
  }
  return (
    <div className={story.policyGrid}>
      <aside className={story.toc}>
        <nav aria-label={tocLabel} className={story.tocNav}>
          <p className={base.label}>{tocLabel}</p>
          <ol className={story.tocList}>
            {sections.map((s, i) => (
              <li key={s.id} className={s.id === current ? story.tocOn : story.tocItem} aria-current={s.id === current ? 'location' : undefined}>
                <Link href={`#${s.id}`} className={story.tocLink}>
                  {`${String(i + 1)}. ${s.title}`}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        {aside}
      </aside>
      <div className={story.sections}>
        {lead}
        {sections.map((s, i) => (
          <Watched key={s.id} onSeen={reporter(s.id)}>
            <Fold wide first={i === 0} id={s.id} title={<span className={base.small}>{`${String(i + 1)}. ${s.title}`}</span>}>
              {s.body.split('\n').map((para) => (
                <p key={para} className={story.para}>
                  {para}
                </p>
              ))}
            </Fold>
          </Watched>
        ))}
      </div>
    </div>
  )
}
