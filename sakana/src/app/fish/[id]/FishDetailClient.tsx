'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from "next-auth/react"
import { getWaterTypeJapanese } from "@/lib/utils"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplet, Fish, CalendarDays, RefreshCw, ArrowLeft, Trash2, Edit, LogOut } from 'lucide-react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

import { speciesList } from "@/lib/common"

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
  const { data: session, status } = useSession()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editedFish, setEditedFish] = useState(fish)

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

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/fish/${fish.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedFish),
      })

      if (!response.ok) {
        throw new Error('Failed to update fish')
      }

      toast({
        title: "更新完了",
        description: `${editedFish.name}のデータが正常に更新されました。`,
      })
      setIsEditModalOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error updating fish:', error)
      toast({
        title: "更新失敗",
        description: "魚の更新中にエラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      })
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
    toast({
      title: "ログアウト成功",
      description: "ログアウトしました。",
    })
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
          <div className="flex space-x-2">
            <Button asChild variant="outline">
              <Link href="/fish-list" className="flex items-center justify-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                魚一覧に戻る
              </Link>
            </Button>
            {status === "authenticated" && (
              <>
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center justify-center">
                      <Edit className="mr-2 h-4 w-4" />
                      編集
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[725px]">
                    <DialogHeader>
                      <DialogTitle>魚の情報を編集</DialogTitle>
                      <DialogDescription>
                        魚の詳細情報を更新します。完了したら保存ボタンをクリックしてください。
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            名前
                          </Label>
                          <Input
                            id="name"
                            value={editedFish.name}
                            onChange={(e) => setEditedFish({ ...editedFish, name: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="species" className="text-right">
                            種類
                          </Label>
                          <Select
                            value={editedFish.species}
                            onValueChange={(value) => setEditedFish({ ...editedFish, species: value })}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="種類を選択" />
                            </SelectTrigger>
                            <SelectContent>
                              {speciesList.map((species) => (
                                <SelectItem key={species} value={species}>
                                  {species}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="waterType" className="text-right">
                            生息地
                          </Label>
                          <Select
                            value={editedFish.waterType}
                            onValueChange={(value) => setEditedFish({ ...editedFish, waterType: value as 'FRESHWATER' | 'SALTWATER' | 'BRACKISH' })}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="生息地を選択" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FRESHWATER">淡水</SelectItem>
                              <SelectItem value="SALTWATER">海水</SelectItem>
                              <SelectItem value="BRACKISH">汽水</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            説明
                          </Label>
                          <Textarea
                            id="description"
                            value={editedFish.description || ''}
                            onChange={(e) => setEditedFish({ ...editedFish, description: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">保存</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
          {status === "authenticated" && (
            <>
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
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}