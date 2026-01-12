'use server'

export async function publishMessageToChannel(channelName: string, body: any) {
  return await fetch(
    `https://main.realtime.ably.net/channels/${channelName}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa(process.env.ABLY_API_KEY!),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  )
}
