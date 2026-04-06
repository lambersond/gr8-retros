import type { Column } from '@/types'

type ThemeColumn = Omit<
  Column,
  'boardSettingsId' | 'id' | 'index' | 'createdAt' | 'updatedAt'
>

export type RetroTheme = {
  id: string
  name: string
  description: string
  columns: ThemeColumn[]
}

// ---------------------------------------------------------------------------
// Color palettes (Tailwind-inspired, light + dark)
// ---------------------------------------------------------------------------

const green = {
  lightBg: '#f0fdf4',
  lightBorder: '#bbf7d0',
  lightTitleBg: '#dcfce7',
  lightTitleText: '#15803d',
  darkBg: '#052e16',
  darkBorder: '#166534',
  darkTitleBg: '#14532d',
  darkTitleText: '#86efac',
}

const yellow = {
  lightBg: '#fefce8',
  lightBorder: '#fde68a',
  lightTitleBg: '#fef9c3',
  lightTitleText: '#a16207',
  darkBg: '#1c1400',
  darkBorder: '#854d0e',
  darkTitleBg: '#422006',
  darkTitleText: '#fde68a',
}

const red = {
  lightBg: '#fef2f2',
  lightBorder: '#fecaca',
  lightTitleBg: '#fee2e2',
  lightTitleText: '#b91c1c',
  darkBg: '#1c0a0a',
  darkBorder: '#991b1b',
  darkTitleBg: '#450a0a',
  darkTitleText: '#fca5a5',
}

const blue = {
  lightBg: '#eff6ff',
  lightBorder: '#bfdbfe',
  lightTitleBg: '#dbeafe',
  lightTitleText: '#1d4ed8',
  darkBg: '#030b1f',
  darkBorder: '#1e40af',
  darkTitleBg: '#172554',
  darkTitleText: '#93c5fd',
}

const purple = {
  lightBg: '#f5f3ff',
  lightBorder: '#c4b5fd',
  lightTitleBg: '#ede9fe',
  lightTitleText: '#6d28d9',
  darkBg: '#0f0720',
  darkBorder: '#5b21b6',
  darkTitleBg: '#2e1065',
  darkTitleText: '#a78bfa',
}

const rose = {
  lightBg: '#fff1f2',
  lightBorder: '#fecdd3',
  lightTitleBg: '#ffe4e6',
  lightTitleText: '#be123c',
  darkBg: '#1c0a10',
  darkBorder: '#9f1239',
  darkTitleBg: '#4c0519',
  darkTitleText: '#fda4af',
}

const teal = {
  lightBg: '#f0fdfa',
  lightBorder: '#99f6e4',
  lightTitleBg: '#ccfbf1',
  lightTitleText: '#0f766e',
  darkBg: '#042f2e',
  darkBorder: '#115e59',
  darkTitleBg: '#134e4a',
  darkTitleText: '#5eead4',
}

const orange = {
  lightBg: '#fff7ed',
  lightBorder: '#fed7aa',
  lightTitleBg: '#ffedd5',
  lightTitleText: '#c2410c',
  darkBg: '#1c0f00',
  darkBorder: '#9a3412',
  darkTitleBg: '#431407',
  darkTitleText: '#fdba74',
}

const slate = {
  lightBg: '#f8fafc',
  lightBorder: '#cbd5e1',
  lightTitleBg: '#e2e8f0',
  lightTitleText: '#475569',
  darkBg: '#0f1729',
  darkBorder: '#334155',
  darkTitleBg: '#1e293b',
  darkTitleText: '#94a3b8',
}

const indigo = {
  lightBg: '#eef2ff',
  lightBorder: '#a5b4fc',
  lightTitleBg: '#e0e7ff',
  lightTitleText: '#4338ca',
  darkBg: '#070b20',
  darkBorder: '#3730a3',
  darkTitleBg: '#1e1b4b',
  darkTitleText: '#a5b4fc',
}

const sky = {
  lightBg: '#f0f9ff',
  lightBorder: '#bae6fd',
  lightTitleBg: '#e0f2fe',
  lightTitleText: '#0369a1',
  darkBg: '#031525',
  darkBorder: '#075985',
  darkTitleBg: '#0c4a6e',
  darkTitleText: '#7dd3fc',
}

const amber = {
  lightBg: '#fffbeb',
  lightBorder: '#fcd34d',
  lightTitleBg: '#fef3c7',
  lightTitleText: '#b45309',
  darkBg: '#1c1200',
  darkBorder: '#92400e',
  darkTitleBg: '#451a03',
  darkTitleText: '#fbbf24',
}

// ---------------------------------------------------------------------------
// Themes
// ---------------------------------------------------------------------------

export const RETRO_THEMES: RetroTheme[] = [
  {
    id: 'standard',
    name: 'Standard',
    description:
      'Classic retrospective: Went Well, Could Be Better, Frustrating, Shoutout',
    columns: [
      {
        columnType: 'GOOD',
        label: 'Went Well',
        tagline: 'What went well?',
        placeholder: 'We had plenty of muffins!',
        emoji: '😊',
        ...green,
      },
      {
        columnType: 'MEH',
        label: 'Could Be Better',
        tagline: 'What could be better?',
        placeholder: 'The muffins were a little stale.',
        emoji: '😐',
        ...yellow,
      },
      {
        columnType: 'BAD',
        label: 'Frustrating',
        tagline: 'What was frustrating?',
        placeholder: 'All the muffins were gone...',
        emoji: '😞',
        ...red,
      },
      {
        columnType: 'SHOUTOUT',
        label: 'Shoutout',
        tagline: 'What are we celebrating?',
        placeholder: 'Felderwin came through with the muffins!',
        emoji: '🎉',
        ...blue,
      },
    ],
  },
  {
    id: '4ls',
    name: '4 Ls',
    description: 'Liked, Learned, Lacked, Longed For',
    columns: [
      {
        columnType: 'LIKED',
        label: 'Liked',
        tagline: 'What did you like?',
        placeholder: 'The team collaboration was amazing!',
        emoji: '💚',
        ...green,
      },
      {
        columnType: 'LEARNED',
        label: 'Learned',
        tagline: 'What did you learn?',
        placeholder: 'We discovered a faster deployment process',
        emoji: '📘',
        ...blue,
      },
      {
        columnType: 'LACKED',
        label: 'Lacked',
        tagline: 'What was lacking?',
        placeholder: 'We needed better documentation',
        emoji: '🔍',
        ...orange,
      },
      {
        columnType: 'LONGED_FOR',
        label: 'Longed For',
        tagline: 'What did you wish for?',
        placeholder: 'Wish we had more time for code reviews',
        emoji: '🌟',
        ...purple,
      },
    ],
  },
  {
    id: 'agile-retro-notes',
    name: 'Agile Retrospective Notes',
    description: "What went well, What didn't go well, Action items",
    columns: [
      {
        columnType: 'WENT_WELL',
        label: 'Went Well',
        tagline: 'What went well this sprint?',
        placeholder: 'Sprint velocity improved by 20%',
        emoji: '✅',
        ...green,
      },
      {
        columnType: 'DID_NOT_GO_WELL',
        label: "Didn't Go Well",
        tagline: "What didn't go well?",
        placeholder: 'Too many meetings interrupted flow',
        emoji: '⚠️',
        ...red,
      },
      {
        columnType: 'ACTION_ITEMS',
        label: 'Action Items',
        tagline: 'What actions should we take?',
        placeholder: 'Schedule focus time blocks each day',
        emoji: '🎯',
        ...blue,
      },
    ],
  },
  {
    id: 'daki',
    name: 'DAKI',
    description: 'Drop, Add, Keep, Improve',
    columns: [
      {
        columnType: 'DROP',
        label: 'Drop',
        tagline: 'What should we stop doing?',
        placeholder: 'Long daily standup meetings',
        emoji: '🗑️',
        ...red,
      },
      {
        columnType: 'ADD',
        label: 'Add',
        tagline: 'What should we start doing?',
        placeholder: 'Pair programming sessions',
        emoji: '➕',
        ...green,
      },
      {
        columnType: 'KEEP',
        label: 'Keep',
        tagline: 'What should we keep doing?',
        placeholder: 'Our code review process',
        emoji: '👍',
        ...blue,
      },
      {
        columnType: 'IMPROVE',
        label: 'Improve',
        tagline: 'What should we improve?',
        placeholder: 'Sprint planning accuracy',
        emoji: '📈',
        ...yellow,
      },
    ],
  },
  {
    id: 'flap',
    name: 'FLAP',
    description:
      'Future direction, Lessons learned, Accomplishments, Problem areas',
    columns: [
      {
        columnType: 'FUTURE',
        label: 'Future Direction',
        tagline: 'Where are we headed?',
        placeholder: 'Migrate to microservices architecture',
        emoji: '🔮',
        ...purple,
      },
      {
        columnType: 'LESSONS',
        label: 'Lessons Learned',
        tagline: 'What did we learn?',
        placeholder: 'Testing early saves time later',
        emoji: '📖',
        ...blue,
      },
      {
        columnType: 'ACCOMPLISHMENTS',
        label: 'Accomplishments',
        tagline: 'What did we achieve?',
        placeholder: 'Delivered the new dashboard on time',
        emoji: '🏆',
        ...green,
      },
      {
        columnType: 'PROBLEMS',
        label: 'Problem Areas',
        tagline: 'Where are we struggling?',
        placeholder: 'Deployment pipeline is fragile',
        emoji: '🚧',
        ...red,
      },
    ],
  },
  {
    id: 'hot-air-balloon',
    name: 'Hot Air Balloon',
    description: 'Hot air, Sandbags, Storm clouds, Sunny skies',
    columns: [
      {
        columnType: 'HOT_AIR',
        label: 'Hot Air',
        tagline: "What's lifting us up?",
        placeholder: 'Great team morale and support!',
        emoji: '🔥',
        ...orange,
      },
      {
        columnType: 'SANDBAGS',
        label: 'Sandbags',
        tagline: "What's weighing us down?",
        placeholder: 'Technical debt in the auth module',
        emoji: '⚓',
        ...amber,
      },
      {
        columnType: 'STORM_CLOUDS',
        label: 'Storm Clouds',
        tagline: 'What risks or threats do we see?',
        placeholder: 'Upcoming deadline is tight',
        emoji: '⛈️',
        ...slate,
      },
      {
        columnType: 'SUNNY_SKIES',
        label: 'Sunny Skies',
        tagline: 'What opportunities lie ahead?',
        placeholder: 'New tools could speed things up',
        emoji: '☀️',
        ...sky,
      },
    ],
  },
  {
    id: 'mad-sad-glad',
    name: 'Mad, Sad, Glad',
    description: 'Mad, Sad, Glad',
    columns: [
      {
        columnType: 'MAD',
        label: 'Mad',
        tagline: 'What made you mad?',
        placeholder: 'Scope creep keeps happening',
        emoji: '😡',
        ...red,
      },
      {
        columnType: 'SAD',
        label: 'Sad',
        tagline: 'What made you sad?',
        placeholder: 'Lost momentum mid-sprint',
        emoji: '😢',
        ...blue,
      },
      {
        columnType: 'GLAD',
        label: 'Glad',
        tagline: 'What made you glad?',
        placeholder: 'New feature got great feedback!',
        emoji: '😄',
        ...green,
      },
    ],
  },
  {
    id: 'mountain-climber',
    name: 'Mountain Climber',
    description: 'Summit, Rocks, Backpack, Weather',
    columns: [
      {
        columnType: 'SUMMIT',
        label: 'Summit',
        tagline: 'What are our goals?',
        placeholder: 'Launch the product by end of quarter',
        emoji: '🏔️',
        ...indigo,
      },
      {
        columnType: 'ROCKS',
        label: 'Rocks',
        tagline: 'What obstacles are in our way?',
        placeholder: 'Dependencies on other teams',
        emoji: '🪨',
        ...red,
      },
      {
        columnType: 'BACKPACK',
        label: 'Backpack',
        tagline: 'What tools and resources do we have?',
        placeholder: 'Our CI/CD pipeline is solid',
        emoji: '🎒',
        ...teal,
      },
      {
        columnType: 'WEATHER',
        label: 'Weather',
        tagline: 'What external factors affect us?',
        placeholder: 'Market conditions are favorable',
        emoji: '🌤️',
        ...sky,
      },
    ],
  },
  {
    id: 'rose-thorn-bud',
    name: 'Rose, Thorn, Bud',
    description: 'Rose (positive), Thorn (negative), Bud (potential)',
    columns: [
      {
        columnType: 'ROSE',
        label: 'Rose',
        tagline: "What's going well?",
        placeholder: 'The design review process is working great',
        emoji: '🌹',
        ...rose,
      },
      {
        columnType: 'THORN',
        label: 'Thorn',
        tagline: "What's not going well?",
        placeholder: 'Onboarding new members takes too long',
        emoji: '🌵',
        ...red,
      },
      {
        columnType: 'BUD',
        label: 'Bud',
        tagline: 'What has potential?',
        placeholder: 'The new API shows lots of promise',
        emoji: '🌱',
        ...green,
      },
    ],
  },
  {
    id: 'sailboat',
    name: 'Sailboat',
    description: 'Wind, Anchor, Rocks, Island',
    columns: [
      {
        columnType: 'WIND',
        label: 'Wind',
        tagline: 'What propels us forward?',
        placeholder: 'Strong team communication',
        emoji: '💨',
        ...teal,
      },
      {
        columnType: 'ANCHOR',
        label: 'Anchor',
        tagline: 'What holds us back?',
        placeholder: 'Legacy code slowing us down',
        emoji: '⚓',
        ...amber,
      },
      {
        columnType: 'REEF',
        label: 'Rocks',
        tagline: 'What risks do we face?',
        placeholder: 'Security vulnerabilities need attention',
        emoji: '🪨',
        ...red,
      },
      {
        columnType: 'ISLAND',
        label: 'Island',
        tagline: "What's our destination?",
        placeholder: 'Achieve 99.9% uptime',
        emoji: '🏝️',
        ...green,
      },
    ],
  },
  {
    id: 'starfish',
    name: 'Starfish',
    description: 'Keep doing, More of, Less of, Stop doing, Start doing',
    columns: [
      {
        columnType: 'KEEP_DOING',
        label: 'Keep Doing',
        tagline: 'What should we keep doing?',
        placeholder: 'Daily async standups',
        emoji: '✅',
        ...green,
      },
      {
        columnType: 'MORE_OF',
        label: 'More Of',
        tagline: 'What should we do more of?',
        placeholder: 'Knowledge sharing sessions',
        emoji: '⬆️',
        ...blue,
      },
      {
        columnType: 'LESS_OF',
        label: 'Less Of',
        tagline: 'What should we do less of?',
        placeholder: 'Context switching between projects',
        emoji: '⬇️',
        ...yellow,
      },
      {
        columnType: 'STOP_DOING',
        label: 'Stop Doing',
        tagline: 'What should we stop doing?',
        placeholder: 'Skipping retrospectives',
        emoji: '🛑',
        ...red,
      },
      {
        columnType: 'START_DOING',
        label: 'Start Doing',
        tagline: 'What should we start doing?',
        placeholder: 'Automated regression testing',
        emoji: '🚀',
        ...purple,
      },
    ],
  },
  {
    id: 'start-stop-continue',
    name: 'Start, Stop, Continue',
    description: 'Start, Stop, Continue',
    columns: [
      {
        columnType: 'START',
        label: 'Start',
        tagline: 'What should we start doing?',
        placeholder: 'Writing ADRs for decisions',
        emoji: '🟢',
        ...green,
      },
      {
        columnType: 'STOP',
        label: 'Stop',
        tagline: 'What should we stop doing?',
        placeholder: 'Deploying on Fridays',
        emoji: '🔴',
        ...red,
      },
      {
        columnType: 'CONTINUE',
        label: 'Continue',
        tagline: 'What should we continue doing?',
        placeholder: 'Weekly team demos',
        emoji: '🔵',
        ...blue,
      },
    ],
  },
]
