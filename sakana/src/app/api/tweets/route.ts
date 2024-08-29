import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth//auth'


const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const tweets = await prisma.tweet.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10, // Limit to 10 most recent tweets
      include: {
        user: {
          select: {
            nickname: true
          }
        }
      }
    })

    const formattedTweets = tweets.map(tweet => ({
      id: tweet.id,
      content: tweet.content,
      createdAt: tweet.createdAt,
      updatedAt: tweet.updatedAt,
      userId: tweet.userId,
      nickname: tweet.nickname || null
    }))

    return NextResponse.json(formattedTweets)
  } catch (error) {
    console.error('Failed to fetch tweets:', error)
    return NextResponse.json({ message: 'Failed to fetch tweets' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}