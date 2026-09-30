'use client'

import { ChangelogList } from './changelog-list'
import { useChangelog } from '@/providers/changelog'

export function Changelog() {
  const { ready, entries } = useChangelog()
  if (!ready || entries.length === 0) return
  return <ChangelogList />
}
