import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import { providers } from './auth-providers'
import prisma from './clients/prisma'

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: providers(),
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: 'jwt',
    maxAge: +(process.env.AUTH_MAX_AGE as unknown as number) || 30 * 86_400,
    updateAge: 86_400,
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      return session
    },
  },
})
