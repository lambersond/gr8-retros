import { DocsNav } from '@/components/pages/docs'

export default function DocsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='max-h-[calc(100vh_-_--spacing(16))] min-h-[calc(100vh_-_--spacing(16))] text-text-primary bg-page'>
      <div className='flex h-full max-w-[1440px] border-b border-border-light mx-auto'>
        <DocsNav />
        <main className='flex-1 overflow-y-auto p-8 pt-0'>{children}</main>
      </div>
    </div>
  )
}
