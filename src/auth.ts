import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import { providers } from './auth-providers'
import prisma from './clients/prisma'
import { BoardRole } from './types'

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
      if (user) {
        token.id = user.id
      }

      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string

      const userData = await prisma.user.findUnique({
        where: { id: token.id as string },
        select: {
          id: true,
          boards: {
            select: {
              settings: {
                select: { id: true, retroSessionId: true },
              },
              role: true,
            },
          },
        },
      })

      const boards: Record<string, { settingsId: string; role: BoardRole }> = {}

      if (userData?.boards) {
        for (const b of userData.boards) {
          boards[b.settings.retroSessionId] = {
            settingsId: b.settings.id,
            role: b.role,
          }
        }
      }
      session.user.boards = boards
      return session
    },
  },
})
