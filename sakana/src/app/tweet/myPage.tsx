'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  content: z
    .string()
    .min(2, {
      message: "2文字以上入力してください。",
    })
    .max(160, {
      message: "160文字以内で入力してください。",
    }),
  nickname: z
    .string()
    .min(2, {
      message: "2文字以上入力してください。",
    })
    .max(50, {
      message: "50文字以内で入力してください。",
    }),
})

interface TweetData {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  nickname: string | null;
}

function TweetList() {
  const [tweets, setTweets] = useState<TweetData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTweets() {
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
      <h2 className="text-xl font-bold text-white">最新のツイート</h2>
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

export default function Tweet() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      nickname: "",
    },
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!session?.user?.id) {
      toast({
        title: "エラー",
        description: "ユーザーIDが見つかりません。",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/tweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: data.content,
          nickname: data.nickname,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        toast({
          title: "成功",
          description: "ツイートが投稿されました。",
        })
        form.reset({ nickname: data.nickname, content: "" })
      } else {
        throw new Error(result.error || 'Unknown error occurred')
      }
    } catch (error) {
      console.error('Failed to create tweet:', error)
      toast({
        title: "エラー",
        description: `ツイートの投稿に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="読み込み中" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <section className="p-4">
      <div className="space-y-8">
        <h1 className="text-2xl font-bold mb-4 md:mb-10 text-white">ツイートする</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    ニックネーム
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="ニックネームを入力してください" {...field} />
                  </FormControl>
                  <FormDescription>
                    ニックネームは公開されます。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">本文</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="何かツイートしてください"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    本文は公開されます。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="success" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  投稿中...
                </>
              ) : (
                'ツイート！'
              )}
            </Button>
          </form>
        </Form>

        <TweetList />
      </div>
    </section>
  )
}