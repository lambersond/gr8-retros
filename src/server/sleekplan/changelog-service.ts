import type { ChangelogUpdate, SleekplanUpdate } from './types'

const SLEEKPLAN_UPDATES_URL = 'https://api.sleekplan.com/v1/updates'
const EXCERPT_MAX = 140

// Sleekplan changelog bodies are our own authored HTML/markdown. We only render
// a plain-text teaser inline (the full rich entry opens in Sleekplan's own
// panel), so strip tags/markup and collapse whitespace into a short excerpt.
function toExcerpt(update: SleekplanUpdate): string {
  const source = update.description_html ?? update.description ?? ''
  const text = source
    .replaceAll(/<[^>]+>/g, ' ')
    .replaceAll(/\s+/g, ' ')
    .trim()
  if (text.length <= EXCERPT_MAX) return text
  return `${text.slice(0, EXCERPT_MAX).trimEnd()}…`
}

/**
 * Fetches the latest published changelog entries from Sleekplan, server-side.
 * The API key is a server-only secret; if it is missing or the request fails we
 * return an empty list so the /me page degrades gracefully (the section hides).
 */
export async function getChangelogUpdates(
  limit = 5,
): Promise<ChangelogUpdate[]> {
  const key = process.env.SLEEKPLAN_API_KEY
  if (!key) return []

  try {
    const res = await fetch(
      `${SLEEKPLAN_UPDATES_URL}?status=published&per_page=${limit}`,
      {
        headers: { Authorization: `Bearer ${key}` },
        next: { revalidate: 3600 },
      },
    )

    if (!res.ok) {
      console.error(
        `Failed to fetch Sleekplan changelog: ${res.status} ${res.statusText}`,
      )
      return []
    }

    const json = (await res.json()) as {
      data?: { items?: SleekplanUpdate[] | Record<string, SleekplanUpdate> }
    }

    // The API may return items as an array or an id-keyed object; handle both.
    const rawItems = json.data?.items
    const items = Array.isArray(rawItems)
      ? rawItems
      : Object.values(rawItems ?? {})

    return items
      .map(item => ({
        id: item.changelog_id,
        title: item.title,
        date: item.created,
        excerpt: toExcerpt(item),
      }))
      .toSorted(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
  } catch (error) {
    console.error('Failed to fetch Sleekplan changelog:', error)
    return []
  }
}
