'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Heart, Repeat2, Share2 } from "lucide-react"
// 型定義
import { Tweet } from '@/types/model'

type TweetListClientProps = {
  initialTweetList: Tweet[]
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="ツイートを読み込み中">
      {[...Array(3)].map((_, index) => (
        <Card key={index} className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
          <div className="flex items-start space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
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
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg" role="alert">
        <p className="text-2xl font-bold text-gray-800 dark:text-white mb-2">まだツイートがありません</p>
        <p className="text-lg text-gray-600 dark:text-gray-300">最初のツイートを投稿して、会話を始めましょう！</p>
      </div>
    )
  }

  return (
    <div className="space-y-6" role="list" aria-label="ツイート一覧">
      {tweets.map((tweet) => (
        <Card key={tweet.id} className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl" role="listitem">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12 rounded-full ring-2 ring-blue-500 dark:ring-blue-400">
              <AvatarImage src={tweet.user.image || '/default-avatar.png'} alt={tweet.nickname || tweet.user.name || '名無しさん'} />
              <AvatarFallback>{(tweet.nickname || tweet.user.name || '名無しさん').slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <p className="font-bold text-gray-900 dark:text-white">{tweet.nickname || tweet.user.name || '名無しさん'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">@{tweet.userId.slice(0, 8)}</p>
                <span className="text-sm text-gray-500 dark:text-gray-400">·</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(tweet.createdAt).toLocaleString()}</p>
              </div>
              <p className="mt-2 text-gray-800 dark:text-gray-200 text-lg leading-relaxed">{tweet.content}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}