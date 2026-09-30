// Raw shape returned by GET https://api.sleekplan.com/v1/updates (subset used).
export interface SleekplanUpdate {
  changelog_id: number
  title: string
  description?: string
  description_html?: string
  created: string
  announcement?: boolean
}

// Trimmed shape rendered on the /me page.
export interface ChangelogUpdate {
  id: number
  title: string
  date: string
  excerpt: string
}
