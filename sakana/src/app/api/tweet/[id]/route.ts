import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth//auth'


const prisma = new PrismaClient()

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tweetId = parseInt(params.id)

  if (isNaN(tweetId)) {
    return NextResponse.json({ error: 'Invalid tweet ID' }, { status: 400 })
  }

  try {
    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId },
    })

    if (!tweet) {
      return NextResponse.json({ error: 'Tweet not found' }, { status: 404 })
    }

    if (tweet.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.tweet.delete({
      where: { id: tweetId },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Failed to delete tweet:', error)
    return NextResponse.json({ error: 'Failed to delete tweet' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tweetId = parseInt(params.id)

  if (isNaN(tweetId)) {
    return NextResponse.json({ error: 'Invalid tweet ID' }, { status: 400 })
  }

  try {
    const { content, nickname } = await request.json()

    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId },
    })

    if (!tweet) {
      return NextResponse.json({ error: 'Tweet not found' }, { status: 404 })
    }

    if (tweet.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const updatedTweet = await prisma.tweet.update({
      where: { id: tweetId },
      data: { content, nickname, updatedAt: new Date() },
    })

    return NextResponse.json(updatedTweet)
  } catch (error) {
    console.error('Failed to update tweet:', error)
    return NextResponse.json({ error: 'Failed to update tweet' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}