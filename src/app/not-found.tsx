// app/not-found.tsx
import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='text-black flex flex-col items-center justify-center h-screen gap-4 -mt-20'>
      <p className='text-2xl'>Page Not Found</p>
      <div className='relative'>
        <Image
          src='/not-found.png'
          alt='Page Not Found'
          width={320}
          height={320}
          className='object-cover [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]"'
        />

        <Link
          className='absolute top-38 left-0 right-0 text-center text-link bg-amber-400 w-75/100 mx-auto py-1.5 rounded-md hover:underline font-semibold italic hover:bg-amber-500 hover:shadow-lg hover:not-italic transition-all'
          href='/'
        >
          Return Home
        </Link>
        <div className='absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-page to-transparent' />
      </div>
    </div>
  )
}
