export interface ReviewableAccessRequest {
  settingsId: string
  user: { id: string; name: string | null; image: string | null }
  settings: {
    retroSessionId: string
    retroSession: { name: string | null }
  }
}

export interface AccessRequestsToReviewProps {
  requests: Promise<ReviewableAccessRequest[]>
}

export interface AccessRequestReviewListProps {
  requests: ReviewableAccessRequest[]
}
