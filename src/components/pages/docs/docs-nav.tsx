'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { docsNav } from '@/content/docs/config'

function NavLinks({
  activeSlug,
}: Readonly<{ activeSlug: string; wrapped?: boolean }>) {
  return (
    <nav className='flex flex-col gap-0.5 md:gap-6'>
      {docsNav.map(section => (
        <div key={section.title}>
          <h3 className='hidden md:block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2 px-3'>
            {section.title}
          </h3>
          <ul className='flex flex-col gap-0.5'>
            {section.items.map(item => {
              const isActive = activeSlug === item.slug
              const Icon = item.icon
              return (
                <li key={item.slug}>
                  <Link
                    href={`/docs/${item.slug}`}
                    className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-text-secondary hover:text-text-primary hover:bg-hover'
                    }`}
                  >
                    <Icon size={16} />
                    <p className='hidden md:block'>{item.title}</p>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export function DocsNav() {
  const pathname = usePathname()
  const activeSlug = pathname.split('/docs/')[1] ?? ''

  return (
    <div className='p-4 border-r border-border-light py-8 md:w-64 shrink-0'>
      <NavLinks activeSlug={activeSlug} wrapped />
    </div>
  )
}
