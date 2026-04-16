import data from 'emoji-picker-react/dist/data/emojis-en.json'

type RawEmoji = { n: string[]; u: string; v?: string[]; a?: string }

type RawData = {
  emojis: Record<string, RawEmoji[]>
}

export type EmojiMatch = {
  char: string
  name: string
  keywords: string[]
}

const unifiedToChar = (unified: string): string =>
  unified
    .split('-')
    .map(cp => String.fromCodePoint(Number.parseInt(cp, 16)))
    .join('')

const EMOJIS: EmojiMatch[] = Object.values((data as RawData).emojis)
  .flat()
  .filter(e => e.n.length > 0)
  .map(e => ({
    char: unifiedToChar(e.u),
    name: e.n.at(-1)!,
    keywords: e.n,
  }))

/**
 * Search emojis by keyword query, scored by match quality.
 * Score: 0 = exact keyword, 1 = keyword starts-with, 2 = keyword contains.
 */
export function searchEmojis(query: string, limit = 8): EmojiMatch[] {
  if (!query) return []
  const q = query.toLowerCase()
  const scored: { emoji: EmojiMatch; score: number }[] = []

  for (const emoji of EMOJIS) {
    let best = Number.POSITIVE_INFINITY
    for (const kw of emoji.keywords) {
      if (kw === q) {
        best = 0
        break
      }
      if (kw.startsWith(q)) {
        best = Math.min(best, 1)
      } else if (kw.includes(q)) {
        best = Math.min(best, 2)
      }
    }
    if (best < Number.POSITIVE_INFINITY) scored.push({ emoji, score: best })
  }

  scored.sort((a, b) => a.score - b.score)
  return scored.slice(0, limit).map(s => s.emoji)
}

/**
 * Returns the emoji when exactly one entry has the query as an exact keyword.
 * Used to decide whether to auto-replace `:shortcode:` on closing colon.
 */
export function findUniqueMatch(query: string): EmojiMatch | undefined {
  if (!query) return undefined
  const q = query.toLowerCase()
  const exact = EMOJIS.filter(e => e.keywords.includes(q))
  return exact.length === 1 ? exact[0] : undefined
}
