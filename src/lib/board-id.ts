/**
 * Board ids are the decoded, human-readable board name (e.g. "Customer Success
 * Retro"). Dynamic route params can reach the server still percent-encoded
 * (e.g. "Customer%20Success%20Retro") depending on the Next.js layer, which —
 * if used verbatim against the DB — creates duplicate sessions (one encoded,
 * one not), shows encoded text in the header, and causes `retroSessionId` FK
 * violations when adding cards.
 *
 * Normalize every board id at the DB boundary to the decoded canonical form.
 * Idempotent: decoding an already-decoded name is a no-op, and the try/catch
 * keeps names containing a literal '%' safe.
 */
export function decodeBoardId(boardId: string): string {
  try {
    return decodeURIComponent(boardId)
  } catch {
    return boardId
  }
}
