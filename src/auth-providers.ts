import Google from 'next-auth/providers/google'

export const providers = () => {
  const providers = []

  if (isTrue(process.env.AUTH_GOOGLE_ENABLED)) {
    providers.push(Google)
  }

  return providers
}

const isTrue = (value?: string) => value?.toLowerCase() === 'true'
