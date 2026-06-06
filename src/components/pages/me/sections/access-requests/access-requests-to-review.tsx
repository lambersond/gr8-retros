import { AccessRequestReviewList } from './access-request-review-list'
import type { AccessRequestsToReviewProps } from './types'

export async function AccessRequestsToReview({
  requests,
}: Readonly<AccessRequestsToReviewProps>) {
  const data = await requests
  if (!data || data.length === 0) return
  return <AccessRequestReviewList requests={data} />
}
