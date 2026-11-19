// Ably connection recovery across page loads. On unload the current
// connection's recovery key is saved to sessionStorage so the next page load in
// this tab resumes the same connection (keeping presence and message
// continuity) instead of opening a new one.

const RECOVERY_KEY = 'ably-recovery-key'
const SKIP_NEXT_SAVE_KEY = 'ably-recovery-skip-next-save'
const IDENTITY_RELOAD_KEY = 'ably-identity-reload'

const storage = () =>
  globalThis.window === undefined ? undefined : globalThis.sessionStorage

/** Reads and clears the saved recovery key; a key is only ever used once. */
export function takeRecoveryKey(): string | undefined {
  const key = storage()?.getItem(RECOVERY_KEY) ?? undefined
  storage()?.removeItem(RECOVERY_KEY)
  return key
}

/** Saves the recovery key on unload, unless it was discarded for this unload. */
export function saveRecoveryKey(key: string | null) {
  if (storage()?.getItem(SKIP_NEXT_SAVE_KEY)) {
    storage()?.removeItem(SKIP_NEXT_SAVE_KEY)
    return
  }
  if (key) storage()?.setItem(RECOVERY_KEY, key)
}

/**
 * Reloads the page on a brand-new Ably connection. A connection keeps the
 * clientId it was opened with for its whole life, so one carrying the wrong
 * identity can't be fixed in place, and recovering it would bring the wrong
 * identity straight back.
 *
 * Returns false (and does nothing) if this tab already reloaded for this
 * reason and the mismatch persists, so a server-side mismatch can't loop.
 */
export function reloadWithFreshConnection(): boolean {
  if (storage()?.getItem(IDENTITY_RELOAD_KEY)) return false

  storage()?.setItem(IDENTITY_RELOAD_KEY, '1')
  storage()?.removeItem(RECOVERY_KEY)
  storage()?.setItem(SKIP_NEXT_SAVE_KEY, '1')
  globalThis.location.reload()
  return true
}

/** Call once the connection's identity is confirmed correct. */
export function clearFreshConnectionReload() {
  storage()?.removeItem(IDENTITY_RELOAD_KEY)
}
