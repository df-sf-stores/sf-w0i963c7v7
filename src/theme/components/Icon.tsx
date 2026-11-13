import base from '../styles/base.module.css'

export type IconName =
  | 'search'
  | 'user'
  | 'bag'
  | 'arrow'
  | 'back'
  | 'down'
  | 'check'
  | 'rotate'
  | 'leaf'
  | 'shield'
  | 'truck'
  | 'receipt'
  | 'lock'
  | 'star'
  | 'drag'
  | 'flame'
  | 'pin'
  | 'close'
  | 'menu'
  | 'plus'
  | 'minus'
  | 'phone'
  | 'filter'
  | 'heart'

const paths: Record<IconName, readonly string[]> = {
  search: ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'M20 20l-4-4'],
  user: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M4.5 20.5c1.3-3.7 4.1-5.5 7.5-5.5s6.2 1.8 7.5 5.5'],
  bag: ['M5 8h14l-1 13H6L5 8z', 'M9 8V6a3 3 0 0 1 6 0v2'],
  arrow: ['M4 12h15', 'M13 6l6 6-6 6'],
  back: ['M20 12H5', 'M11 6l-6 6 6 6'],
  down: ['M12 4v15', 'M6 13l6 6 6-6'],
  check: ['M4.5 12.5l5 5 10-11'],
  rotate: ['M20 11a8 8 0 1 0-2.3 5.7', 'M20 4v7h-7'],
  leaf: ['M5 19c0-8 5-14 15-14 0 10-6 15-14 15', 'M5 19l7-7'],
  shield: ['M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z'],
  truck: ['M3 6h11v10H3z', 'M14 10h4l3 3v3h-7', 'M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 'M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
  receipt: ['M6 3h12v18l-3-2-3 2-3-2-3 2V3z', 'M9 8h6', 'M9 12h6'],
  lock: ['M6 11h12v10H6z', 'M8.5 11V8a3.5 3.5 0 0 1 7 0v3'],
  star: ['M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8L12 3.5z'],
  drag: ['M8 6h.01', 'M8 12h.01', 'M8 18h.01', 'M16 6h.01', 'M16 12h.01', 'M16 18h.01'],
  flame: ['M12 21c-4 0-6.5-2.6-6.5-6.2 0-3.6 3-5.6 3.6-9.3 2.4 1.4 3.4 3.6 3.4 5.5 1-.7 1.6-1.9 1.7-3.2 2.3 1.8 4.3 4.3 4.3 7.2 0 3.5-2.6 6-6.5 6z'],
  pin: ['M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z', 'M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
  close: ['M6 6l12 12', 'M18 6L6 18'],
  menu: ['M3.5 7h17', 'M3.5 12h17', 'M3.5 17h11'],
  plus: ['M12 5v14', 'M5 12h14'],
  minus: ['M5 12h14'],
  phone: ['M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z'],
  filter: ['M4 6h16', 'M7 12h10', 'M10 18h4'],
  heart: ['M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z'],
}

/** A stroke-only icon on the 24px grid, at 1.7px; decorative, so a link or button around it names what it does. */
export const Icon = ({ name, className }: { name: IconName; className?: string }) => (
  <svg className={className ?? base.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    {paths[name].map((d) => (
      <path key={d} d={d} />
    ))}
  </svg>
)

/** Nested outlined diamonds, the brand's corner motif; thin and low in contrast, so it never competes with the type. */
export const Diamond = ({ className }: { className?: string }) => (
  <svg className={className ?? base.diamond} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
    <path d="M100 4L196 100 100 196 4 100z" />
    <path d="M100 34L166 100 100 166 34 100z" />
    <path d="M100 64L136 100 100 136 64 100z" />
  </svg>
)
