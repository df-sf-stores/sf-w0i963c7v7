// The store's contact details as Site settings hold them, shaped for display and for a call link. Never copied in.

/** "+919030022334" as "+91 90300 22334"; any other shape as the store wrote it. */
export const shownPhone = (phone: string): string => phone.replace(/^\+?91\s?(\d{5})\s?(\d{5})$/, '+91 $1 $2')

/** Only the digits and a leading plus, as a call link wants them. */
export const dialable = (phone: string): string => phone.replace(/[^\d+]/g, '')

/** The store's address on one line: street, city and postcode. */
export const oneLine = (address: { street?: string | null; city?: string | null; postal?: string | null } | null | undefined): string =>
  [address?.street, address?.city, address?.postal].filter(Boolean).join(', ')
