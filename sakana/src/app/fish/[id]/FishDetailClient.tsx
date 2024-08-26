'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getWaterTypeJapanese } from "@/lib/utils"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplet, Fish, CalendarDays, RefreshCw, ArrowLeft, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

type FishDetailClientProps = {
  fish: {
    id: number
    name: string
    description: string | null
    waterType: 'FRESHWATER' | 'SALTWATER' | 'BRACKISH'
    species: string
    createdAt: Date
    updatedAt: Date
  }
}

export default function FishDetailClient({ fish }: FishDetailClientProps) {
  const router = useRouter()

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/fish/${fish.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete fish')
      }

      toast({
        title: "削除完了",
        description: `${fish.name}のデータが正常に削除されました。`,
      })
      router.push('/fish-list')
    } catch (error) {
      console.error('Error deleting fish:', error)
      toast({
        title: "削除失敗",
        description: "魚の削除中にエラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-100 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto bg-white backdrop-blur-sm shadow-xl rounded-lg overflow-hidden">
        <div className="relative pb-48 overflow-hidden">
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-400 to-teal-500 animate-gradient-x"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Fish className="text-white w-32 h-32" />
          </div>
        </div>
        <CardContent className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">{fish.species}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{fish.name}</h1>
          <div className="flex items-center text-gray-700 mb-6">
            <Droplet className="mr-2 text-blue-500" />
            <span className="font-medium">生息地域:</span>
            <span className="ml-2">{getWaterTypeJapanese(fish.waterType)}</span>
          </div>
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">説明</h2>
            <p className="text-gray-600 leading-relaxed">{fish.description}</p>
          </div>
          <div className="mt-8 flex justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <CalendarDays className="mr-2 text-green-500" />
              <span>登録日: {new Date(fish.createdAt).toLocaleDateString('ja-JP')}</span>
            </div>
            <div className="flex items-center">
              <RefreshCw className="mr-2 text-green-500" />
              <span>最終更新日: {new Date(fish.updatedAt).toLocaleDateString('ja-JP')}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 px-8 py-4 flex justify-between">
          <Button asChild variant="outline" className="sm:w-auto">
            <Link href="/fish-list" className="flex items-center justify-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              魚一覧に戻る
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="sm:w-auto">
                <Trash2 className="mr-2 h-4 w-4" />
                削除
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                <AlertDialogDescription>
                  この操作は取り消せません。{fish.name}のデータが完全に削除されます。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>削除</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  )
}