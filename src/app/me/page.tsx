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
      <div className='relative max-w-2xl mx-auto px-4 py-14 flex flex-col gap-5'>
        <Suspense fallback={<Skeleton />}>
          <MyInfo myInfo={userInfo} />
        </Suspense>
        <Suspense fallback={<Skeleton />}>
          <MyBoards myBoards={userBoards} userInfo={userInfo} />
        </Suspense>
        <Suspense fallback={<Skeleton />}>
          <MyActionItems myActionItems={userActionItems} />
        </Suspense>
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div
      className='rounded-2xl bg-white p-6 animate-pulse'
      style={{ border: '1px solid rgba(0,0,0,0.06)' }}
    >
      <div className='h-4 w-32 rounded bg-slate-200 mb-4' />
      <div className='h-3 w-full rounded bg-slate-100 mb-2' />
      <div className='h-3 w-3/4 rounded bg-slate-100' />
    </div>
  )
}
