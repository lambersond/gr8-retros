import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { COOKIE_KEY_USER_ID } from '@/constants'

type User = {
  id: string
  name: string
}

type AuthenticatedHandlerWithContext<T = any> = (
  req: NextRequest,
  context: T,
  user: User,
) => Promise<NextResponse>

export function withUser<T = any>(handler: AuthenticatedHandlerWithContext<T>) {
  return async (req: NextRequest, context: T) => {
    const session = await auth()

    const cookie = await cookies()
    const cookieUserId = cookie.get('gr8retros.userId')?.value
    const cookieUserName = cookie.get('gr8retros.userName')?.value

    if (!session?.user?.id && !cookieUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return handler(req, context, {
      id: session?.user?.id || cookieUserId!,
      name: session?.user?.name || cookieUserName || 'Anonymous User',
    })
  }
}

export function isSelf(userId: string, resourceUserId: string) {
  return userId === resourceUserId
}

export const getSessionUserIdOrCookie = async () => {
  const session = await auth()
  const cookieStore = await cookies()

  return (
    session?.user?.id ||
    cookieStore.get(COOKIE_KEY_USER_ID)?.value ||
    'temp-user'
  )
}
