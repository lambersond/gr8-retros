'use client'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { noop } from 'lodash'
import { useSession, signIn, signOut } from 'next-auth/react'
import { v7 as uuidv7 } from 'uuid'
import { useFeatureFlags } from './use-feature-flags'
import { COOKIE_KEY_USER_ID, COOKIE_KEY_USER_NAME } from '@/constants'
import { generateUsername } from '@/utils/username-generator'

type AnonymousUser = {
  id: string
  name: string
}

export function useAuth() {
  const { data: session, status } = useSession()
  const featureFlags = useFeatureFlags()
  const { isAuthEnabled } = featureFlags

  const [anonymousUser, setAnonymousUser] = useState<
    AnonymousUser | undefined
  >()

  useEffect(() => {
    // If logged in, sync cookies & clear anonymous user
    if (session?.user?.id) {
      Cookies.set(COOKIE_KEY_USER_ID, session.user.id)
      if (session.user.name) {
        Cookies.set(COOKIE_KEY_USER_NAME, session.user.name)
      }
      setAnonymousUser(undefined)
      return
    }

    // Anonymous flow: read or create cookies (client-only)
    let cookieUserId = Cookies.get(COOKIE_KEY_USER_ID)
    let cookieUserName = Cookies.get(COOKIE_KEY_USER_NAME)

    if (!cookieUserId) {
      cookieUserId = uuidv7()
      Cookies.set(COOKIE_KEY_USER_ID, cookieUserId)
    }

    if (!cookieUserName) {
      cookieUserName = generateUsername()
      Cookies.set(COOKIE_KEY_USER_NAME, cookieUserName)
    }

    setAnonymousUser({
      id: cookieUserId,
      name: cookieUserName,
    })
  }, [session?.user?.id, session?.user?.name])

  const effectiveId = session?.user?.id ?? anonymousUser?.id ?? ''
  const effectiveName =
    session?.user?.name ?? anonymousUser?.name ?? 'Anonymous User'

  const user = {
    id: effectiveId,
    name: effectiveName,
    email: session?.user?.email || 'unknown@email.com',
    image: session?.user?.image || '/no-image.jpg',
    isGoogleLinked: !!session?.user?.id,
    isPatreonLinked: false, // Extend when Patreon is integrated
  }

  return isAuthEnabled
    ? {
        isAuthenticated: status === 'authenticated',
        isEnabled: true,
        session,
        signIn,
        signOut,
        status,
        user,
      }
    : {
        isAuthenticated: false,
        isEnabled: false,
        session: {},
        signIn: noop,
        signOut: noop,
        user,
        status,
      }
}
