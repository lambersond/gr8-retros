import { redirect } from 'next/navigation'
import { defaultSlug } from '@/content/docs/config'

export default function DocsPage() {
  redirect(`/docs/${defaultSlug}`)
}
