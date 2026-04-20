import Discord from 'next-auth/providers/discord'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

export const providers = () => {
  const providers = []

  if (isTrue(process.env.AUTH_GOOGLE_ENABLED)) {
    providers.push(Google({ allowDangerousEmailAccountLinking: true }))
  }

  if (isTrue(process.env.AUTH_DISCORD_ENABLED)) {
    providers.push(Discord({ allowDangerousEmailAccountLinking: true }))
  }

  if (isTrue(process.env.AUTH_GITHUB_ENABLED)) {
    providers.push(GitHub({ allowDangerousEmailAccountLinking: true }))
  }
  return providers
}

const isTrue = (value?: string) => value?.toLowerCase() === 'true'
