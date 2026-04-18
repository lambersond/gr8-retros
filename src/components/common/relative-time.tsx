'use client'

import { useEffect, useState } from 'react'
import { formatDistanceToNow, differenceInSeconds } from 'date-fns'

function getRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true, includeSeconds: true })
}

export function RelativeTime({
  date,
  className,
}: Readonly<{ date: Date; className?: string }>) {
  const [text, setText] = useState(() => getRelativeTime(date))

  useEffect(() => {
    setText(getRelativeTime(date))

    const withinAMinute = differenceInSeconds(new Date(), date) < 60
    const interval = setInterval(
      () => setText(getRelativeTime(date)),
      withinAMinute ? 5000 : 60_000,
    )

    return () => clearInterval(interval)
  }, [date])

  return (
    <time dateTime={new Date(date).toISOString()} className={className}>
      {text}
    </time>
  )
}
