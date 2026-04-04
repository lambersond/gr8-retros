export interface PlanFeature {
  label: string
  soon?: true
}

export type PlanId =
  | 'anonymous'
  | 'account'
  | 'supporter'
  | 'believer'
  | 'champion'

export type CtaType = 'home' | 'google-signin' | 'checkout'

export interface Plan {
  id: PlanId
  label: string
  price: string
  priceNote?: string
  yearlyPrice?: string
  yearlyPriceNote?: string
  yearlySavings?: string
  tagline: string
  highlight?: boolean
  cta: CtaType
  ctaLabel: string
  stripeLinks?: {
    monthly: { test: string; live: string }
    yearly: { test: string; live: string }
  }
  inheritLabel?: string // e.g. "Everything in Account"
  accentColor: string // Tailwind border color class
  badgeColor: string // Tailwind badge bg + text classes
  buttonColor: string // Tailwind button bg + text classes
  checkColor: string // Tailwind check icon bg + text classes
  features: PlanFeature[]
}

export const PLANS = new Map<PlanId, Plan>([
  [
    'anonymous',
    {
      id: 'anonymous',
      label: 'Free',
      price: '$0',
      tagline: 'No account needed. Jump in.',
      cta: 'home',
      ctaLabel: 'Start for free',
      accentColor: 'border-slate-300',
      badgeColor: 'bg-slate-100 text-slate-600',
      buttonColor: 'bg-slate-800 hover:bg-slate-700 text-white',
      checkColor: 'bg-slate-100 text-slate-500',
      features: [
        { label: 'Join & create public boards' },
        { label: 'Add & upvote cards' },
        { label: 'Add & complete action items' },
        { label: 'Mark cards as discussed' },
        { label: 'Edit / delete your own cards & comments' },
        { label: 'Add comments to cards' },
        { label: 'Export action items as PDF' },
        { label: 'Built-in timer' },
        { label: 'Background music' },
      ],
    },
  ],
  [
    'account',
    {
      id: 'account',
      label: 'Account',
      price: '$0',
      tagline: 'Your boards, your space.',
      cta: 'google-signin',
      ctaLabel: 'Get Started',
      inheritLabel: 'Everything in Free',
      accentColor: 'border-sky-400',
      badgeColor:
        'dark:bg-sky-700/30 bg-sky-100 text-sky-700 dark:text-sky-300',
      buttonColor: 'bg-sky-600 hover:bg-sky-500 text-white',
      checkColor: 'dark:bg-sky-700/30 bg-sky-50 text-sky-500',
      features: [
        { label: 'Own up to 3 boards' },
        { label: 'Create private boards' },
        { label: 'Add members & invite via link' },
        { label: 'Drag-and-drop between columns' },
        { label: 'Limit upvotes per user' },
        { label: 'Enable / disable voting' },
        { label: 'Restrict comments, actions, music & timer' },
        { label: 'Assign Member & Facilitator roles' },
        { label: 'Assign action items to members' },
        { label: 'Boards retained for 60 days' },
        { label: 'Cards retained for 14 days' },
      ],
    },
  ],
  [
    'supporter',
    {
      id: 'supporter',
      label: 'Supporter',
      price: '$3',
      priceNote: '/ mo',
      yearlyPrice: '$30',
      yearlyPriceNote: '/ yr',
      yearlySavings: 'Save $6',
      tagline: 'For teams ready to level up.',
      cta: 'checkout',
      ctaLabel: 'Get started',
      stripeLinks: {
        monthly: {
          test: 'https://buy.stripe.com/test_9B69AT3z0aTLasT1Il8k801',
          live: 'https://buy.stripe.com/9B69AT3z0aTLasT1Il8k801',
        },
        yearly: {
          test: 'https://buy.stripe.com/test_9B69AT3z0aTLasT1Il8k801',
          live: 'https://buy.stripe.com/dRm9AT2uW8LD44vdr38k802',
        },
      },
      inheritLabel: 'Everything in Account',
      accentColor: 'border-violet-400',
      badgeColor:
        'bg-violet-100 dark:bg-violet-700/30 text-violet-700 dark:text-violet-300',
      buttonColor: 'bg-violet-600 hover:bg-violet-500 text-white',
      checkColor: 'dark:bg-violet-700/30 bg-violet-50 text-violet-500',
      features: [
        { label: 'Own up to 10 boards' },
        { label: 'Custom board columns' },
        { label: 'Facilitator Mode', soon: true },
        { label: 'Group cards via drag-and-drop' },
        { label: 'Export as PDF' },
        { label: 'Boards retained for 180 days' },
        { label: 'Cards retained for 30 days' },
      ],
    },
  ],
  [
    'believer',
    {
      id: 'believer',
      label: 'Believer',
      price: '$5',
      priceNote: '/ mo',
      yearlyPrice: '$50',
      yearlyPriceNote: '/ yr',
      yearlySavings: 'Save $10',
      tagline: 'AI-powered insights for teams that ship.',
      cta: 'checkout',
      ctaLabel: 'Get started',
      stripeLinks: {
        monthly: {
          test: 'https://buy.stripe.com/test_3cI00j7Pg0f7asTaeR8k800',
          live: 'https://buy.stripe.com/dRm14n8Tk9PH30rcmZ8k803',
        },
        yearly: {
          test: 'https://buy.stripe.com/test_3cI00j7Pg0f7asTaeR8k800',
          live: 'https://buy.stripe.com/8x2aEXfhI2nf58z5YB8k804',
        },
      },
      highlight: true,
      inheritLabel: 'Everything in Supporter',
      accentColor: 'border-amber-400',
      badgeColor:
        'bg-amber-100 dark:bg-amber-700/30 text-amber-700 dark:text-amber-300',
      buttonColor: 'bg-amber-500 hover:bg-amber-400 text-white',
      checkColor: 'dark:bg-amber-700/30 bg-amber-50 text-amber-500',
      features: [
        { label: 'Own up to 50 boards' },
        { label: 'Assign admin roles' },
        { label: 'Board layout variants', soon: true },
        { label: 'AI-generated grouped card names', soon: true },
        { label: 'AI-generated summaries', soon: true },
        { label: 'Boards retained for 365 days' },
        { label: 'Cards retained for 90 days' },
      ],
    },
  ],
  // Uncomment when Champion features are ready
  // [
  //   'champion',
  //   {
  //     id: 'champion',
  //     label: 'Champion',
  //     price: '$42',
  //     priceNote: '/ mo',
  //     yearlyPrice: '$420',
  //     yearlyPriceNote: '/ yr',
  //     yearlySavings: 'Save $84',
  //     tagline: 'Your whole org, one shared space.',
  //     cta: 'checkout',
  //     ctaLabel: 'Get started',
  //     stripeLinks: {
  //       monthly: {
  //         test: 'https://buy.stripe.com/test_champion_monthly',
  //         live: 'https://buy.stripe.com/bJe6oH9Xo8LD6cD4Ux8k805',
  //       },
  //       yearly: {
  //         test: 'https://buy.stripe.com/test_champion_yearly',
  //         live: 'https://buy.stripe.com/4gM5kD1qS1jb6cDbiV8k806',
  //       },
  //     },
  //     inheritLabel: 'Everything in Believer',
  //     accentColor: 'border-rose-400',
  //     badgeColor: 'bg-rose-50 text-rose-700',
  //     buttonColor: 'bg-rose-600 hover:bg-rose-500 text-white',
  //     checkColor: 'bg-rose-50 text-rose-500',
  //     features: [
  //       { label: 'Unlimited boards' },
  //       { label: 'Boards retained indefinitely' },
  //       { label: 'Cards retained indefinitely' },
  //       { label: 'Your own organization workspace' },
  //       { label: 'Invite teammates (Believer tier required)' },
  //     ],
  //   },
  // ],
])

export function stripeLink(plan: Plan, yearly: boolean): string | undefined {
  const links = plan.stripeLinks
  if (!links) return undefined
  const period = yearly ? links.yearly : links.monthly
  return process.env.NODE_ENV === 'production' ? period.live : period.test
}
