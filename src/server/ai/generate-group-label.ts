'use server'

import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'

const gateway = createOpenAI({
  baseURL: 'https://ai-gateway.vercel.sh/v1',
  apiKey: process.env.AI_GATEWAY_API_KEY,
})

export async function generateGroupLabel(
  cardContents: string[],
): Promise<string> {
  if (cardContents.length === 0) return ''

  try {
    const { text } = await generateText({
      model: gateway('meta/llama-3.3-70b'),
      system:
        'You generate concise group labels for retrospective board cards. Given a list of card titles, return a single short label that captures the common theme. The label must be under 225 characters. Return only the label text, nothing else.',
      prompt: cardContents.map((c, i) => `${i + 1}. ${c}`).join('\n'),
    })

    return text.trim().slice(0, 225) || ''
  } catch (error) {
    console.error('[AI Group Label] Failed to generate label:', error)
    return ''
  }
}
