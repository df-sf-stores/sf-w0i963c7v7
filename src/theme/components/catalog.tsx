// What the theme knows about each pack beyond the store's catalogue: its family colour, its shelf and its Telugu name.
// Names, prices, photos and stock always come from the store through core; this only dresses them.

export type Family = 'chilli' | 'ink' | 'mutton' | 'rasam' | 'sambar' | 'turmeric' | 'leaf' | 'indigo'
export type Shelf = 'blend' | 'single' | 'snack'

export type Slug =
  | 'garam-masala'
  | 'chicken-masala'
  | 'mutton-masala'
  | 'rasam-powder'
  | 'sambar-powder'
  | 'turmeric-powder'
  | 'coriander-powder'
  | 'guntur-chilli-powder'
  | 'papad'

type Pack = { family: Family; shelf: Shelf }

export const packs: Readonly<Record<Slug, Pack>> = {
  'garam-masala': { family: 'chilli', shelf: 'blend' },
  'chicken-masala': { family: 'ink', shelf: 'blend' },
  'mutton-masala': { family: 'mutton', shelf: 'blend' },
  'rasam-powder': { family: 'rasam', shelf: 'blend' },
  'sambar-powder': { family: 'sambar', shelf: 'blend' },
  'turmeric-powder': { family: 'turmeric', shelf: 'single' },
  'coriander-powder': { family: 'leaf', shelf: 'single' },
  'guntur-chilli-powder': { family: 'chilli', shelf: 'single' },
  'papad': { family: 'indigo', shelf: 'snack' },
}

export const slugs = Object.keys(packs) as Slug[]

/** The South Indian Starter box: the four packs it holds, bought together. */
export const starterBox: readonly Slug[] = ['sambar-powder', 'rasam-powder', 'turmeric-powder', 'guntur-chilli-powder']

/** The packs the home page and the cart's suggestions lead with. */
export const staples: readonly Slug[] = ['garam-masala', 'turmeric-powder', 'guntur-chilli-powder', 'sambar-powder']

/** The slug a product's address names (`/products/{slug}/`). */
export const slugOf = (href: string | null | undefined): string => {
  const parts = (href ?? '').split('/').filter(Boolean)
  const at = parts.indexOf('products')
  return at >= 0 ? (parts[at + 1] ?? '') : (parts[parts.length - 1] ?? '')
}

export const isSlug = (value: string): value is Slug => Object.hasOwn(packs, value)

/** The pack an address's slug names. The papad's slug carries the shop's name, so it is matched by its ending. */
const packKey = (slug: string): Slug | null => (isSlug(slug) ? slug : slug.endsWith('-papad') ? 'papad' : null)

export const packOf = (href: string | null | undefined): Pack & { slug: Slug | null } => {
  const slug = packKey(slugOf(href))
  return slug ? { slug, ...packs[slug] } : { slug: null, family: 'ink', shelf: 'blend' }
}

/** Each pack's words in content/en/catalog.json, keyed so every t() call names its key in full. */
export const teluguKey = {
  'garam-masala': 'catalog.telugu.garamMasala',
  'chicken-masala': 'catalog.telugu.chickenMasala',
  'mutton-masala': 'catalog.telugu.muttonMasala',
  'rasam-powder': 'catalog.telugu.rasamPowder',
  'sambar-powder': 'catalog.telugu.sambarPowder',
  'turmeric-powder': 'catalog.telugu.turmericPowder',
  'coriander-powder': 'catalog.telugu.corianderPowder',
  'guntur-chilli-powder': 'catalog.telugu.gunturChilliPowder',
  'papad': 'catalog.telugu.papad',
} as const

export const ingredientsKey = {
  'garam-masala': 'catalog.ingredients.garamMasala',
  'chicken-masala': 'catalog.ingredients.chickenMasala',
  'mutton-masala': 'catalog.ingredients.muttonMasala',
  'rasam-powder': 'catalog.ingredients.rasamPowder',
  'sambar-powder': 'catalog.ingredients.sambarPowder',
  'turmeric-powder': 'catalog.ingredients.turmericPowder',
  'coriander-powder': 'catalog.ingredients.corianderPowder',
  'guntur-chilli-powder': 'catalog.ingredients.gunturChilliPowder',
  'papad': 'catalog.ingredients.papad',
} as const

export const blurbKey = {
  'garam-masala': 'catalog.blurb.garamMasala',
  'chicken-masala': 'catalog.blurb.chickenMasala',
  'mutton-masala': 'catalog.blurb.muttonMasala',
  'rasam-powder': 'catalog.blurb.rasamPowder',
  'sambar-powder': 'catalog.blurb.sambarPowder',
  'turmeric-powder': 'catalog.blurb.turmericPowder',
  'coriander-powder': 'catalog.blurb.corianderPowder',
  'guntur-chilli-powder': 'catalog.blurb.gunturChilliPowder',
  'papad': 'catalog.blurb.papad',
} as const

export const shelfKey = { blend: 'catalog.shelf.blend', single: 'catalog.shelf.single', snack: 'catalog.shelf.snack' } as const

/** The theme's own cut-out pack, for the pack a store photo is still missing for (src/theme/media). */
export const cutOut: Partial<Record<Slug, 'blended_spice.png' | 'single-spices.png' | 'snacks.png'>> = {
  'garam-masala': 'blended_spice.png',
}
