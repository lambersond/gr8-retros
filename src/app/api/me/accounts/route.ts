import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/clients/prisma'

export async function GET() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const accounts = await prisma.account.findMany({
    where: { userId },
    select: { provider: true, providerAccountId: true, createdAt: true },
  })

  return NextResponse.json(accounts)
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { provider, providerAccountId } = await req.json()

  if (!provider || !providerAccountId) {
    return NextResponse.json(
      { error: 'provider and providerAccountId are required' },
      { status: 400 },
    )
  }

  // Prevent unlinking the last account
  const accountCount = await prisma.account.count({ where: { userId } })
  if (accountCount <= 1) {
    return NextResponse.json(
      { error: 'Cannot unlink your only sign-in method' },
      { status: 400 },
    )
  }

  await prisma.account.delete({
    where: {
      // eslint-disable-next-line camelcase
      provider_providerAccountId: { provider, providerAccountId },
    },
  })

  return NextResponse.json({ success: true })
}
