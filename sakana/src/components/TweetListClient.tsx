// components/TweetListClient.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import Link from 'next/link'

type Tweet = {
  id: number
  content: string
  nickname: string | null
  createdAt: string
  user: {
    name: string | null
  }
}

type TweetListClientProps = {
  initialTweetList: Tweet[]
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-label="ツイートを読み込み中">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="flex flex-col">
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
          <CardFooter className="mt-auto">
            <Skeleton className="h-4 w-1/2" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default function TweetListClient({ initialTweetList }: TweetListClientProps) {
  const [tweets, setTweets] = useState<Tweet[]>(initialTweetList)
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    setTweets(initialTweetList)
  }, [initialTweetList])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (tweets.length === 0) {
    return (
      <div className="text-center py-8" role="alert">
        <p className="text-lg font-semibold text-gray-600">まだツイートがありません。</p>
        <p className="text-sm text-gray-500 mt-2">最初のツイートを投稿してみましょう！</p>

      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="ツイート一覧">
      {tweets.map((tweet) => (
        <Card key={tweet.id} className="flex flex-col" role="listitem">
          <CardHeader>
            <CardTitle>{tweet.nickname || '名無しさん'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 line-clamp-3">{tweet.content}</p>
          </CardContent>
          <CardFooter className="mt-auto">
            <p className="text-xs text-gray-500">
              {new Date(tweet.createdAt).toLocaleString()}
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}