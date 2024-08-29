import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth//auth'


const prisma = new PrismaClient()

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { content, nickname } = await request.json()

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const tweet = await prisma.tweet.create({
      data: {
        content,
        nickname,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true, tweet }, { status: 201 })
  } catch (error) {
    console.error('Failed to create tweet:', error)
    return NextResponse.json({ error: 'Failed to create tweet' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}