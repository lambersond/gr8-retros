import type { LucideIcon } from 'lucide-react'
import type { ComponentType } from 'react'

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
