import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from "@/components/ui/button"
import FishListClient from '@/components/FishListClient'
import TweetListClient from '@/components/TweetListClient'
import FishSquares from '@/components/FishSquares'
import FishListPaginated from '@/components/FishListPaginated'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/auth'
import type { Metadata } from 'next'
import { TweetModel } from '@/types/model'

export const metadata: Metadata = {
  title: '魚図鑑 | 日本の魚類を探索しよう',
  description: '日本の海や川に生息する魚たちの情報をご覧いただけます。魚図鑑で日本の豊かな水生生物を探索しましょう。',
}

async function getFishList() {
  try {
    const fish = await prisma.fish.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    return fish
  } catch (error) {
    console.error('Failed to fetch fish list:', error)
    throw new Error('Failed to fetch fish list')
  }
}

async function getTweetList(): Promise<TweetModel[]> {
  try {
    const tweets = await prisma.tweet.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      take: 10,
    })

    return tweets.map(tweet => ({
      ...tweet,
      createdAt: tweet.createdAt.toISOString(),
      updatedAt: tweet.updatedAt.toISOString(),
      user: {
        name: tweet.user.name,
        image: tweet.user.image,
      },
    }))
  } catch (error) {
    console.error('Failed to fetch tweet list:', error)
    throw new Error('Failed to fetch tweet list')
  }
}

// 無限スクロールバージョンの処理 ３件ずつ

export default async function Home() {
  const fishList = await getFishList()
  const tweetList = await getTweetList()
  const session = await getServerSession(authOptions)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">魚図鑑</h1>
      <p className="text-xl text-center mb-8">日本の海や川に生息する魚たちの情報をご覧いただけます。</p>
      <div className="mb-8 text-center">
        {session ? (
          <div className="space-x-4">
            <Button asChild>
              <Link href="/register-fish">新しい魚を登録する</Link>
            </Button>
          </div>
        ) : (
          <Button asChild>
            <Link href="/auth/signin">ログインして魚を登録する</Link>
          </Button>
        )}
      </div>
      <h2 className="text-3xl font-bold mb-6 text-white mt-16">魚一覧</h2>
      <FishListClient initialFishList={fishList} showDeleteButton={false} />
      <h2 className="text-3xl font-bold mb-6 text-white mt-16">投稿一覧</h2>
      <TweetListClient initialTweetList={tweetList} />
      <h2 className="text-3xl font-bold mb-6 text-white mt-16">魚一覧(無限スクロールバージョン)</h2>
      <div className="mt-16">
        <FishListPaginated initialFishList={fishList} />
      </div>
    </div>
  )
}