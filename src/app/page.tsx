import Image from 'next/image'
import { CreateRetroButton } from '@/components/create-retro-button'

export default function HomePage() {
  return (
    <div className='bg-slate-100 h-full'>
      {/* Hero Section */}
      <section className='flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-16'>
        <div className='max-w-5xl w-full flex flex-col-reverse md:flex-row items-center justify-center gap-8'>
          {/* Left: Text content */}
          <div className='flex-1 text-center md:text-left'>
            <h1 className='text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4'>
              Run better retros in seconds.
            </h1>
            <p className='text-lg text-slate-600 mb-8'>
              Start a collaborative retrospective board with one click. Capture
              feedback, upvote ideas, and define action items — all in real
              time.
            </p>
            <div className='flex flex-col items-center gap-3'>
              <CreateRetroButton />
              <p className='text-xs text-slate-500'>
                Generates a unique board URL you can share instantly.
              </p>
            </div>
          </div>

          {/* Right: Preview image */}
          <div className='flex-1 relative w-full max-w-[600px] aspect-[16/10] rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-white'>
            <Image
              src='/preview.png'
              alt='Gr8 Retros preview'
              fill
              sizes='(max-width: 768px) 100vw, 600px'
              className='object-cover'
              priority
            />
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className='bg-white py-10 border-t border-slate-200'>
        <div className='max-w-5xl mx-auto px-4 grid gap-6 sm:grid-cols-3'>
          <FeatureItem title='Fast & lightweight'>
            Create and share a retro in seconds. No bloated UI, no setup.
          </FeatureItem>
          <FeatureItem title='Collaborate easily'>
            Add, upvote, and discuss items live with your team.
          </FeatureItem>
          <FeatureItem title='Actionable outcomes'>
            Track and resolve action items right from your board.
          </FeatureItem>
        </div>
      </section>
    </div>
  )
}

function FeatureItem({
  title,
  children,
}: Readonly<{
  title: string
  children: React.ReactNode
}>) {
  return (
    <div className='rounded-2xl bg-white/80 border border-slate-200 px-4 py-3 shadow-sm'>
      <h3 className='text-sm font-semibold text-slate-900 mb-1'>{title}</h3>
      <p className='text-xs text-slate-600 leading-relaxed'>{children}</p>
    </div>
  )
}
