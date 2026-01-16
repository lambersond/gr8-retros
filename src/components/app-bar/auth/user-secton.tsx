import Image from 'next/image'
import { Badge } from '@/components/common'
import type { UserSectionProps } from './types'

export function UserSection({
  user,
  isAuthenticated,
}: Readonly<UserSectionProps>) {
  if (!isAuthenticated) {
    return (
      <section>
        <div className='flex items-center gap-2'>{user.name}</div>
      </section>
    )
  }

  return (
    <section>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2 border-b border-border-light pb-2'>
          <Image
            src={user?.image}
            alt={user?.name}
            height={48}
            width={48}
            className='rounded-full'
          />
          <div className='flex flex-col justify-center'>
            <p className='font-bold text-lg'>{user.name}</p>
            <p className='text-sm text-text-secondary -mt-1'>{user.email}</p>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <p className='font-medium text-text-secondary text-sm'>
            Subscription
          </p>
          <Badge text={user.paymentTier} />
        </div>
      </div>
    </section>
  )
}
