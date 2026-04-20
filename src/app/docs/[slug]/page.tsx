import { DocsContent } from '@/components/pages/docs'

export default async function DocsArticlePage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params

  return <DocsContent slug={slug} />
}
