import { lazy } from 'react'
import { BookOpen, Hammer, Settings, SlidersHorizontal } from 'lucide-react'
import type { DocRegistry, DocSection } from './types'

/**
 * Navigation structure for the docs sidebar.
 * Add new sections and articles here — they'll appear in the nav automatically.
 */
export const docsNav: DocSection[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Getting Started', slug: 'getting-started', icon: BookOpen },
    ],
  },
  {
    title: 'Board',
    items: [
      { title: 'Board Settings', slug: 'board-settings', icon: Settings },
      {
        title: 'Board Controls',
        slug: 'board-controls',
        icon: SlidersHorizontal,
      },
      {
        title: 'Retro Actions',
        slug: 'retro-actions',
        icon: Hammer,
      },
    ],
  },
]

/**
 * Map each slug to its article component.
 * Components are lazy-loaded so they don't bloat the initial bundle.
 */
export const docsRegistry: DocRegistry = {
  'getting-started': lazy(() => import('./articles/getting-started')),
  'board-settings': lazy(() => import('./articles/board-settings')),
  'board-controls': lazy(() => import('./articles/board-controls')),
  'retro-actions': lazy(() => import('./articles/retro-actions')),
}

/** The slug to show when visiting /docs with no slug */
export const defaultSlug = 'getting-started'
