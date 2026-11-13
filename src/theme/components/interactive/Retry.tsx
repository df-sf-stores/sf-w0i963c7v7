'use client'

import base from '../../styles/base.module.css'

export const Retry = ({ label, onRetry }: { label: string; onRetry: () => void }) => (
  <button type="button" className={base.secondary} onClick={onRetry}>
    {label}
  </button>
)
