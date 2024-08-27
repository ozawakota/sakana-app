'use client'

import { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { FcGoogle } from 'react-icons/fc'
import { Loader2 } from 'lucide-react'

export default function SignIn() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      toast({
        title: "ログイン成功",
        description: "魚図鑑へようこそ！",
        duration: 3000,
      })
      router.push('/')
    }
  }, [status, router])

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      console.error('Google Sign-In error:', error)
      toast({
        title: "エラー",
        description: "Googleログイン中にエラーが発生しました。",
        variant: "destructive",
      })
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">読み込み中...</p>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  if (status === 'authenticated') {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ログイン</CardTitle>
          <CardDescription>魚図鑑にログインしてください</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Button
            onClick={handleGoogleSignIn}
            className="w-full max-w-xs flex items-center justify-center gap-2"
            variant="outline"
          >
            <FcGoogle className="w-5 h-5" />
            Googleでログイン
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}