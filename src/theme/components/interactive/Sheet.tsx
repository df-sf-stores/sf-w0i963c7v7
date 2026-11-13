'use client'

import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode, type RefObject } from 'react'
import { Icon } from '../Icon'
import base from '../../styles/base.module.css'

/**
 * A bottom sheet (PDF p24, "sheets, not dropdowns"): a drag handle, a backdrop that closes it, Escape that closes it, and
 * focus kept inside while it is open, then handed back to the control that opened it.
 */
export const Sheet = ({
  open,
  title,
  closeLabel,
  onClose,
  returnTo,
  footer,
  children,
}: {
  open: boolean
  title: string
  closeLabel: string
  onClose: () => void
  returnTo?: RefObject<HTMLButtonElement | null>
  footer?: ReactNode
  children: ReactNode
}) => {
  const heading = useId()
  const close = useRef<HTMLButtonElement>(null)
  const end = useRef<HTMLDivElement>(null)
  const wasOpen = useRef(false)
  useEffect(() => {
    if (open) close.current?.focus()
    else if (wasOpen.current) returnTo?.current?.focus()
    wasOpen.current = open
  }, [open, returnTo])
  if (!open) return null
  const keys = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Escape') return
    e.stopPropagation()
    onClose()
  }
  return (
    <>
      <div className={base.backdrop} onClick={onClose} aria-hidden="true" />
      <div className={base.sheet} role="dialog" aria-modal="true" aria-labelledby={heading} onKeyDown={keys}>
        <span className={base.guard} tabIndex={0} onFocus={() => end.current?.focus()} />
        <div className={base.handle} aria-hidden="true" />
        <div className={base.sheetHead}>
          <h2 id={heading} className={base.sheetTitle}>
            {title}
          </h2>
          <button ref={close} type="button" className={base.sheetIcon} onClick={onClose}>
            <Icon name="close" />
            <span className={base.hidden}>{closeLabel}</span>
          </button>
        </div>
        <div className={base.sheetBody}>{children}</div>
        {footer ? <div className={base.sheetFoot}>{footer}</div> : null}
        <div ref={end} tabIndex={-1} />
        <span className={base.guard} tabIndex={0} onFocus={() => close.current?.focus()} />
      </div>
    </>
  )
}
