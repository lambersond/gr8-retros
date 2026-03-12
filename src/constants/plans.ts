interface Plan {
  id: string
  label: string
  price: string
  priceNote?: string
  yearlyPrice?: string
  yearlyPriceNote?: string
  yearlySavings?: string
  tagline: string
  highlight?: boolean
  inheritLabel?: string // e.g. "Everything in Believer"
  accentColor: string // Tailwind border color class
  badgeColor: string // Tailwind badge bg + text classes
  buttonColor: string // Tailwind button bg + text classes
  checkColor: string // Tailwind check icon bg + text classes
  features: {
    label: string
    soon?: true
  }[]
}

export const PLANS: Plan[] = [
  {
    id: 'anonymous',
    label: 'Free',
    price: '$0',
    tagline: 'No account needed. Jump in.',
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
  {
    id: 'account',
    label: 'Account',
    price: '$0',
    tagline: 'Your boards, your space.',
    accentColor: 'border-sky-400',
    badgeColor: 'bg-sky-50 text-sky-700',
    buttonColor: 'bg-sky-600 hover:bg-sky-500 text-white',
    checkColor: 'bg-sky-50 text-sky-500',
    inheritLabel: 'Everything in Free',
    features: [
      { label: 'Own up to 3 boards' },
      { label: 'Create private boards' },
      { label: 'Add members & invite via link' },
      { label: 'Limit upvotes per user' },
      { label: 'Enable / disable voting' },
      { label: 'Restrict comments, actions, music & timer' },
      { label: 'Assign Member & Facilitator roles' },
      { label: 'Assign action items to members' },
      { label: 'Boards retained for 60 days' },
      { label: 'Cards retained for 14 days' },
    ],
  },
  {
    id: 'believer',
    label: 'Believer',
    price: '$1',
    priceNote: '/ mo',
    yearlyPrice: '$10',
    yearlyPriceNote: '/ yr',
    yearlySavings: 'Save $2',
    tagline: 'More power. More boards.',
    highlight: true,
    accentColor: 'border-amber-400',
    badgeColor: 'bg-amber-50 text-amber-700',
    buttonColor: 'bg-amber-500 hover:bg-amber-400 text-white',
    checkColor: 'bg-amber-50 text-amber-500',
    inheritLabel: 'Everything in Account',
    features: [
      { label: 'Own up to 10 boards' },
      { label: 'Assign admin roles' },
      { label: 'Board layout variants' },
      { label: 'Custom column header text' },
      { label: 'Group cards via drag-and-drop', soon: true },
      { label: 'Facilitator Mode', soon: true },
      { label: 'Boards retained for 180 days' },
      { label: 'Cards retained for 30 days' },
    ],
  },
  {
    id: 'supporter',
    label: 'Supporter',
    price: '$2',
    priceNote: '/ mo',
    yearlyPrice: '$20',
    yearlyPriceNote: '/ yr',
    yearlySavings: 'Save $4',
    tagline: 'AI-assisted. Longer memory.',
    accentColor: 'border-violet-400',
    badgeColor: 'bg-violet-50 text-violet-700',
    buttonColor: 'bg-violet-600 hover:bg-violet-500 text-white',
    checkColor: 'bg-violet-50 text-violet-500',
    inheritLabel: 'Everything in Believer',
    features: [
      { label: 'AI-generated grouped card names' },
      { label: 'Export board summary as PDF', soon: true },
      { label: 'Own up to 50 boards' },
      { label: 'Boards retained for 365 days' },
      { label: 'Cards retained for 90 days' },
    ],
  },
  {
    id: 'champion',
    label: 'Champion',
    price: '$15',
    priceNote: '/ mo',
    yearlyPrice: '$150',
    yearlyPriceNote: '/ yr',
    yearlySavings: 'Save $30',
    tagline: 'Unlimited. For teams.',
    accentColor: 'border-rose-400',
    badgeColor: 'bg-rose-50 text-rose-700',
    buttonColor: 'bg-rose-600 hover:bg-rose-500 text-white',
    checkColor: 'bg-rose-50 text-rose-500',
    inheritLabel: 'Everything in Supporter',
    features: [
      { label: 'Unlimited boards' },
      { label: 'Boards retained indefinitely' },
      { label: 'Cards retained indefinitely' },
      { label: 'Your own organization workspace' },
      { label: 'Invite teammates (Believer tier required)' },
    ],
  },
]
