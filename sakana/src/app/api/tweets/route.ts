import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const tweets = await prisma.tweet.findMany({
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
      nickname: tweet.nickname || tweet.user.nickname || null
    }))

    return NextResponse.json(formattedTweets)
  } catch (error) {
    console.error('Failed to fetch tweets:', error)
    return NextResponse.json({ message: 'Failed to fetch tweets' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}