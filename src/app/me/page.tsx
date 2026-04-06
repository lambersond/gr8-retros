import { Suspense } from 'react'
import { auth } from '@/auth'
import { MyActionItems, MyBoards, MyInfo } from '@/components/pages/me'
import { userService } from '@/server/user'

export default async function Me() {
  const session = await auth()

  if (!session?.user) {
    return (
      <div className='max-h-[calc(100vh_-_--spacing(23))] min-h-[calc(100vh_-_--spacing(23))] text-text-primary bg-page'>
        <div className='flex items-center justify-center h-full'>
          <p className='text-center text-text-secondary'>
            Please log in to view your profile.
          </p>
        </div>
      </div>
    )
  }

  const userInfo = userService.getUserInfo(session.user.id)
  const userBoards = userService.getUserBoards(session.user.id)
  const userActionItems = userService.getUserActionItems(session.user.id)

  return (
    <div className='max-h-[calc(100vh_-_--spacing(23))] min-h-[calc(100vh_-_--spacing(23))] text-text-primary bg-page overflow-y-auto'>
      <div className='relative max-w-[1440px] mx-auto px-4 py-14 flex flex-col gap-5'>
        <Suspense fallback={<Skeleton />}>
          <MyInfo myInfo={userInfo} />
        </Suspense>
        <div className='flex flex-col lg:flex-row gap-5'>
          <div className='lg:flex-[1]'>
            <Suspense fallback={<Skeleton />}>
              <MyBoards myBoards={userBoards} userInfo={userInfo} />
            </Suspense>
          </div>
          <div className='lg:flex-[2]'>
            <Suspense fallback={<Skeleton />}>
              <MyActionItems myActionItems={userActionItems} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div className='rounded-2xl bg-paper p-6 animate-pulse border border-border-light'>
      <div className='h-4 w-32 rounded bg-hover mb-4' />
      <div className='h-3 w-full rounded bg-hover/60 mb-2' />
      <div className='h-3 w-3/4 rounded bg-hover/60' />
    </div>
  )
}
