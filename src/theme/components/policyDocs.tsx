// Each policy's words in content/en/policy.json, keyed so every t() call names its key in full.
// LEGAL REVIEW REQUIRED: the policy copy is placeholder text written from the design until counsel signs it off.

export type DocKind = 'refunds' | 'privacy' | 'terms' | 'shipping' | 'fssai'

export const docs = {
  refunds: {
    title: 'policy.refunds.title',
    updated: 'policy.refunds.updated',
    short: 'policy.refunds.short',
    sections: [
      { id: 'refunds-1', title: 'policy.refunds.s1Title', body: 'policy.refunds.s1Body' },
      { id: 'refunds-2', title: 'policy.refunds.s2Title', body: 'policy.refunds.s2Body' },
      { id: 'refunds-3', title: 'policy.refunds.s3Title', body: 'policy.refunds.s3Body' },
      { id: 'refunds-4', title: 'policy.refunds.s4Title', body: 'policy.refunds.s4Body' },
      { id: 'refunds-5', title: 'policy.refunds.s5Title', body: 'policy.refunds.s5Body' },
      { id: 'refunds-6', title: 'policy.refunds.s6Title', body: 'policy.refunds.s6Body' },
      { id: 'refunds-7', title: 'policy.refunds.s7Title', body: 'policy.refunds.s7Body' },
      { id: 'refunds-8', title: 'policy.refunds.s8Title', body: 'policy.refunds.s8Body' },
    ],
  },
  privacy: {
    title: 'policy.privacy.title',
    updated: 'policy.privacy.updated',
    short: 'policy.privacy.short',
    sections: [
      { id: 'privacy-1', title: 'policy.privacy.s1Title', body: 'policy.privacy.s1Body' },
      { id: 'privacy-2', title: 'policy.privacy.s2Title', body: 'policy.privacy.s2Body' },
      { id: 'privacy-3', title: 'policy.privacy.s3Title', body: 'policy.privacy.s3Body' },
      { id: 'privacy-4', title: 'policy.privacy.s4Title', body: 'policy.privacy.s4Body' },
      { id: 'privacy-5', title: 'policy.privacy.s5Title', body: 'policy.privacy.s5Body' },
      { id: 'privacy-6', title: 'policy.privacy.s6Title', body: 'policy.privacy.s6Body' },
    ],
  },
  terms: {
    title: 'policy.terms.title',
    updated: 'policy.terms.updated',
    short: 'policy.terms.short',
    sections: [
      { id: 'terms-1', title: 'policy.terms.s1Title', body: 'policy.terms.s1Body' },
      { id: 'terms-2', title: 'policy.terms.s2Title', body: 'policy.terms.s2Body' },
      { id: 'terms-3', title: 'policy.terms.s3Title', body: 'policy.terms.s3Body' },
      { id: 'terms-4', title: 'policy.terms.s4Title', body: 'policy.terms.s4Body' },
      { id: 'terms-5', title: 'policy.terms.s5Title', body: 'policy.terms.s5Body' },
      { id: 'terms-6', title: 'policy.terms.s6Title', body: 'policy.terms.s6Body' },
      { id: 'terms-7', title: 'policy.terms.s7Title', body: 'policy.terms.s7Body' },
    ],
  },
  shipping: {
    title: 'policy.shipping.title',
    updated: 'policy.shipping.updated',
    short: 'policy.shipping.short',
    sections: [
      { id: 'shipping-1', title: 'policy.shipping.s1Title', body: 'policy.shipping.s1Body' },
      { id: 'shipping-2', title: 'policy.shipping.s2Title', body: 'policy.shipping.s2Body' },
      { id: 'shipping-3', title: 'policy.shipping.s3Title', body: 'policy.shipping.s3Body' },
      { id: 'shipping-4', title: 'policy.shipping.s4Title', body: 'policy.shipping.s4Body' },
      { id: 'shipping-5', title: 'policy.shipping.s5Title', body: 'policy.shipping.s5Body' },
      { id: 'shipping-6', title: 'policy.shipping.s6Title', body: 'policy.shipping.s6Body' },
    ],
  },
  fssai: {
    title: 'policy.fssai.title',
    updated: 'policy.fssai.updated',
    short: 'policy.fssai.short',
    sections: [
      { id: 'fssai-1', title: 'policy.fssai.s1Title', body: 'policy.fssai.s1Body' },
      { id: 'fssai-2', title: 'policy.fssai.s2Title', body: 'policy.fssai.s2Body' },
      { id: 'fssai-3', title: 'policy.fssai.s3Title', body: 'policy.fssai.s3Body' },
      { id: 'fssai-4', title: 'policy.fssai.s4Title', body: 'policy.fssai.s4Body' },
      { id: 'fssai-5', title: 'policy.fssai.s5Title', body: 'policy.fssai.s5Body' },
      { id: 'fssai-6', title: 'policy.fssai.s6Title', body: 'policy.fssai.s6Body' },
    ],
  },
} as const

