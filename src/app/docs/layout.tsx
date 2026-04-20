import { DocsNav } from '@/components/pages/docs'

export default function DocsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='max-h-[calc(100vh_-_--spacing(23))] min-h-[calc(100vh_-_--spacing(23))] text-text-primary bg-page'>
      <div className='flex h-full border-b w-full border-border-light justify-center'>
        <DocsNav />
        <main className='flex-1 overflow-y-auto p-8 pt-0'>{children}</main>
      </div>
    </div>
  )
}
