import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import base from '../styles/base.module.css'

/** An empty, missing or failed state: its heading (the page's h1 when `main`), a line, and what the shopper can do next. */
export const Notice = ({ title, lead, main = false, children }: { title: string; lead: string; main?: boolean; children?: ReactNode }) => (
  <div className={clsx(base.wrap, base.notice)}>
    {main ? <h1 className={base.section}>{title}</h1> : <h2 className={base.small}>{title}</h2>}
    <p className={base.noticeLead}>{lead}</p>
    {children ? <div className={base.noticeActions}>{children}</div> : null}
  </div>
)
