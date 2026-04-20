'use client'

import { Suspense } from 'react'
import { docsRegistry } from '@/content/docs/config'

export function DocsContent({ slug }: Readonly<{ slug: string }>) {
  const Article = docsRegistry[slug]

  if (!Article) {
    return (
      <div className='text-text-secondary pt-8'>
        <h1 className='text-2xl font-bold text-text-primary mb-2'>Not Found</h1>
        <p>The article you are looking for does not exist.</p>
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className='animate-pulse space-y-4 pt-8'>
          <div className='h-8 w-64 rounded bg-hover' />
          <div className='h-4 w-full rounded bg-hover/60' />
          <div className='h-4 w-3/4 rounded bg-hover/60' />
        </div>
      }
    >
      <article className='prose-docs'>
        <Article />
      </article>
    </Suspense>
  )
}
