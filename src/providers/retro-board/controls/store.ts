import { useCallback, useRef, useSyncExternalStore } from 'react'

type Unsubscribe = () => void
type Listener = () => void

export type Store<T> = {
  getState: () => T
  getVersion: () => number
  subscribe: (listener: Listener) => Unsubscribe
}

function outsideProvider(name: string): never {
  throw new Error(`${name} must be used within BoardControlsProvider`)
}

export function createThrowingStore<T>(hookName: string): Store<T> {
  return {
    getState: () => outsideProvider(hookName),
    getVersion: () => outsideProvider(hookName),
    subscribe: () => outsideProvider(hookName),
  }
}

export function createStore<T>(
  initial: T,
): Store<T> & { setState: (next: T) => void } {
  let state = initial
  let version = 0
  const listeners = new Set<Listener>()

  return {
    getState: () => state,
    getVersion: () => version,
    setState: (next: T) => {
      state = next
      version += 1
      for (const l of listeners) l()
    },
    subscribe: (listener: Listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

export function useStoreSelector<T, S>(
  store: Store<T>,
  selector: (state: T) => S,
  isEqual: (a: S, b: S) => boolean = Object.is,
): S {
  const cacheRef = useRef<{
    version: number
    hasValue: boolean
    value: S
  }>({ version: -1, hasValue: false, value: undefined as unknown as S })

  const getSnapshot = useCallback((): S => {
    const nextVersion = store.getVersion()

    if (cacheRef.current.hasValue && cacheRef.current.version === nextVersion) {
      return cacheRef.current.value
    }

    const nextSelected = selector(store.getState())

    if (
      cacheRef.current.hasValue &&
      isEqual(cacheRef.current.value, nextSelected)
    ) {
      cacheRef.current.version = nextVersion
      return cacheRef.current.value
    }

    cacheRef.current = {
      version: nextVersion,
      hasValue: true,
      value: nextSelected,
    }
    return nextSelected
  }, [isEqual, selector, store])

  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot)
}
