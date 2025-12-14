'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Cookies from 'js-cookie'
import { noop } from 'lodash'
import {
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
  useSession,
} from 'next-auth/react'
import { v7 as uuidv7 } from 'uuid'
import { useFeatureFlags } from './use-feature-flags'
import { COOKIE_KEY_USER_ID, COOKIE_KEY_USER_NAME } from '@/constants'
import { generateUsername } from '@/utils/username-generator'

type AnonymousUser = { id: string; name: string }

function getOrCreateAnonymousUser(): AnonymousUser {
  let id = Cookies.get(COOKIE_KEY_USER_ID)
  let name = Cookies.get(COOKIE_KEY_USER_NAME)

  if (!id) {
    id = uuidv7()
    Cookies.set(COOKIE_KEY_USER_ID, id)
  }

  if (!name) {
    name = generateUsername()
    Cookies.set(COOKIE_KEY_USER_NAME, name)
  }

  return { id, name }
}

export function useAuth() {
  const { data: session, status } = useSession()
  const {
    flags: { isAuthEnabled },
  } = useFeatureFlags()

  const [anonymousUser, setAnonymousUser] = useState<AnonymousUser | undefined>(
    () => {
      if (globalThis.window === undefined) return
      return getOrCreateAnonymousUser()
    },
  )

  useEffect(() => {
    if (globalThis.window === undefined) return

    const authedId = session?.user?.id
    const authedName = session?.user?.name

    if (authedId) {
      if (Cookies.get(COOKIE_KEY_USER_ID) !== authedId) {
        Cookies.set(COOKIE_KEY_USER_ID, authedId)
      }
      if (authedName && Cookies.get(COOKIE_KEY_USER_NAME) !== authedName) {
        Cookies.set(COOKIE_KEY_USER_NAME, authedName)
      }
      setAnonymousUser(undefined)
      return
    }

    setAnonymousUser(prev => prev ?? getOrCreateAnonymousUser())
  }, [session?.user?.id, session?.user?.name])

  const signOut = useCallback(async () => {
    if (globalThis.window !== undefined) {
      const newName = generateUsername()
      Cookies.set(COOKIE_KEY_USER_NAME, newName)

      setAnonymousUser(prev => {
        const id = prev?.id ?? Cookies.get(COOKIE_KEY_USER_ID) ?? uuidv7()
        Cookies.set(COOKIE_KEY_USER_ID, id)
        return { id, name: newName }
      })
    }

    await nextAuthSignOut()
  }, [])

  const effective = useMemo(() => {
    const isAuthenticated = status === 'authenticated' && !!session?.user?.id

    const id = isAuthenticated ? session.user!.id : (anonymousUser?.id ?? '')
    const name =
      (isAuthenticated ? session.user!.name : anonymousUser?.name) ??
      'Anonymous User'

    return { isAuthenticated, id, name }
  }, [anonymousUser?.id, anonymousUser?.name, session, status])

  const user = useMemo(() => {
    const authed = !!session?.user?.id

    return {
      id: effective.id,
      name: effective.name,
      email: session?.user?.email ?? '',
      image: session?.user?.image ?? '',
      isGoogleLinked: authed,
      isPatreonLinked: false,
    }
  }, [
    effective.id,
    effective.name,
    session?.user?.email,
    session?.user?.id,
    session?.user?.image,
  ])

  const apiEnabled = useMemo(() => {
    return {
      isLoading: status === 'loading',
      isAuthenticated: effective.isAuthenticated,
      isEnabled: true,
      session,
      signIn: nextAuthSignIn,
      signOut,
      status,
      user,
    }
  }, [effective.isAuthenticated, session, signOut, status, user])

  const apiDisabled = useMemo(() => {
    return {
      isAuthenticated: false,
      isLoading: false,
      isEnabled: false,
      session: {},
      signIn: noop,
      signOut: noop,
      user,
      status,
    }
  }, [status, user])

  return isAuthEnabled ? apiEnabled : apiDisabled
}
