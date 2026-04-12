'use server'

import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'

const gateway = createOpenAI({
  baseURL: 'https://ai-gateway.vercel.sh/v1',
  apiKey: process.env.AI_GATEWAY_API_KEY,
})

type SummaryCard = {
  content: string
  column: string
  votes: number
  isDiscussed: boolean
  comments: string[]
  actionItems: { content: string; completed: boolean }[]
  groupLabel?: string
}

type SessionStats = {
  totalCards: number
  totalGroups: number
  totalDiscussed: number
  totalComments: number
  totalActionItems: number
  incompleteActionItems: number
  hadVoting: boolean
  totalVotes: number
}

export async function generateSessionSummary(
  cards: SummaryCard[],
  columnLabels: Record<string, string>,
  stats: SessionStats,
): Promise<string> {
  if (cards.length === 0) return ''

  const cardsByColumn: Record<string, SummaryCard[]> = {}
  for (const card of cards) {
    const label = columnLabels[card.column] ?? card.column
    if (!cardsByColumn[label]) cardsByColumn[label] = []
    cardsByColumn[label].push(card)
  }

  // Find most upvoted card
  const mostUpvoted = cards.toSorted((a, b) => b.votes - a.votes)[0]
  const mostUpvotedLine =
    mostUpvoted && mostUpvoted.votes > 0
      ? `Most upvoted item: "${mostUpvoted.content}" (${mostUpvoted.votes} upvotes)`
      : undefined

  const statsBlock = [
    '# Board Statistics',
    `- ${stats.totalCards} cards across ${Object.keys(cardsByColumn).length} columns`,
    `- ${stats.totalGroups} card groups`,
    `- ${stats.totalDiscussed} of ${stats.totalCards} cards discussed`,
    `- ${stats.totalComments} comments added`,
    `- ${stats.totalActionItems} action items (${stats.incompleteActionItems} still incomplete)`,
    stats.hadVoting ? `- ${stats.totalVotes} total votes cast` : undefined,
    mostUpvotedLine ? `- ${mostUpvotedLine}` : undefined,
  ]
    .filter(Boolean)
    .join('\n')

  const sections = Object.entries(cardsByColumn)
    .map(([column, columnCards]) => {
      const lines = columnCards.map(c => {
        let line = `- ${c.content} (${c.votes} upvotes${c.isDiscussed ? ', discussed' : ''})`
        if (c.groupLabel) line += ` [Group: ${c.groupLabel}]`
        if (c.comments.length > 0)
          line += `\n  Comments: ${c.comments.join('; ')}`
        if (c.actionItems.length > 0) {
          const aiList = c.actionItems
            .map(ai => (ai.completed ? ai.content + ' (done)' : ai.content))
            .join('; ')
          line += `\n  Action Items: ${aiList}`
        }
        return line
      })
      return `## ${column}\n${lines.join('\n')}`
    })
    .join('\n\n')

  try {
    const { text } = await generateText({
      model: gateway('openai/gpt-4o-mini'),
      system: `You are a retrospective facilitator summarizing a team retro session. Given the board data, produce a concise paragraph-style summary (under 2000 characters) that reads naturally. Cover:

1. What was discussed — the main themes and topics that emerged across categories.
2. Trends and patterns — recurring sentiments, areas with concentrated discussion, or imbalances across columns.
3. Highlights — call out the most upvoted item and, if voting occurred, the most voted-on item. Mention any standout cards or groups the team rallied around.
4. Action items — briefly summarize what the team committed to and what remains incomplete.

Write in flowing paragraphs, not bullet points. Use a professional but friendly tone. Do not repeat every card — synthesize and highlight what matters most.`,
      prompt: `${statsBlock}\n\n${sections}`,
    })

    return text.trim()
  } catch (error) {
    console.error('[AI Session Summary] Failed to generate summary:', error)
    return ''
  }
}
