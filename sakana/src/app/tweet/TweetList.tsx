'use client'

import { useEffect, useState } from 'react'
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TweetData {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  nickname: string | null;
}

export default function TweetList() {
  const [tweets, setTweets] = useState<TweetData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTweets() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/tweets');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTweets(data);
      } catch (error) {
        console.error('Failed to fetch tweets:', error);
        toast({
          title: "エラー",
          description: "ツイートの取得に失敗しました。",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchTweets();
  }, []);

  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="ツイートを読み込み中" />;
  }

  return (
    <div className="space-y-4">
      {tweets.map((tweet) => (
        <Card key={tweet.id}>
          <CardHeader>
            <CardTitle>{tweet.nickname || '名無しさん'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{tweet.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(tweet.createdAt).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}