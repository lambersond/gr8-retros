'use client'

import { useState } from 'react'
import Image from 'next/image'

export function Avatar({
  alt,
  src,
  className = 'rounded-full mt-0.5 min-w-5.5 min-h-5.5',
}: Readonly<{
  alt: string
  src?: string | null
  className?: string
}>) {
  const [srcState, setSrcState] = useState(src || '/no-image.jpg')

  return (
    <Image
      src={srcState}
      alt={alt}
      width={22}
      height={22}
      className={className}
      onError={() => setSrcState('/no-image.jpg')}
    />
  )
}
