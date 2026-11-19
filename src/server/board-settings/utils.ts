/**
 * Adds the settings implied by a patch: turning Facilitator Mode on also turns
 * Facilitate Session on, so re-enabling the feature never leaves it half off
 * from an earlier session.
 */
export function withImpliedSettings(
  patch: Record<string, unknown>,
): Record<string, unknown> {
  if (patch.isFacilitatorModeEnabled === true) {
    return { ...patch, isFacilitateSessionEnabled: true }
  }
  return patch
}
