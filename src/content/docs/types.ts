import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'

export type DocArticle = {
  title: string
  slug: string
  icon: LucideIcon
}

export type DocSection = {
  title: string
  items: DocArticle[]
}

export type DocRegistry = Record<string, ComponentType>
