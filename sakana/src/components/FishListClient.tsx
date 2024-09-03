'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getWaterTypeJapanese } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useFishStore } from '@/store/useFishStore'
import { ChevronRight, Trash2 } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"
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

import { FishModel } from '@/types/model'
import { LoadingSkeleton } from './LoadingSkeleton'
import { FilterSection } from './FilterSection'

type FishListClientProps = {
  initialFishList: FishModel[]
  showDeleteButton: boolean
}

export default function FishListClient({ initialFishList, showDeleteButton }: FishListClientProps) {
  const { 
    filteredFishList, 
    waterTypeFilter, 
    alphabetFilter, 
    speciesFilter, 
    setFishList, 
    setWaterTypeFilter, 
    setAlphabetFilter, 
    setSpeciesFilter, 
    resetFilters 
  } = useFishStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (initialFishList && initialFishList.length > 0) {
      setFishList(initialFishList)
      setIsLoading(false)
    }
  }, [initialFishList, setFishList])

  const handleDelete = async (id: number, name: string) => {
    try {
      const response = await fetch(`/api/fish/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('削除に失敗しました。')
      }

      setFishList(filteredFishList.filter(fish => fish.id !== id))
      toast({
        title: "削除完了",
        description: `${name}のデータが正常に削除されました。`,
      })
    } catch (error) {
      console.error('Error deleting fish:', error)
      toast({
        title: "削除失敗",
        description: "魚の削除中にエラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <>
      <FilterSection
        waterTypeFilter={waterTypeFilter}
        alphabetFilter={alphabetFilter}
        speciesFilter={speciesFilter}
        setWaterTypeFilter={setWaterTypeFilter}
        setAlphabetFilter={setAlphabetFilter}
        setSpeciesFilter={setSpeciesFilter}
        resetFilters={resetFilters}
      />

      {filteredFishList.length === 0 ? (
        <div className="text-center py-8" role="alert">
          <p className="text-lg font-semibold text-gray-600">魚が見つかりません。</p>
          <p className="text-sm text-gray-500 mt-2">検索条件を変更してみてください。</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6" role="list" aria-label="魚のリスト">
          {filteredFishList.map((fish) => (
            <Card key={fish.id} className="flex flex-col" role="listitem">
              <CardHeader>
                <CardTitle>{fish.name}</CardTitle>
                <CardDescription>{getWaterTypeJapanese(fish.waterType)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3">{fish.description}</p>
              </CardContent>
              <CardFooter className="mt-auto flex justify-between">
                <Button asChild variant="outline" className="flex-1 mr-2 group hover:bg-blue-500 hover:text-white transition-colors duration-300">
                  <Link href={`/fish/${fish.id}`} className="flex items-center justify-center">
                    詳細を見る
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    <span className="sr-only">{fish.name}の詳細</span>
                  </Link>
                </Button>
                {showDeleteButton && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">{fish.name}を削除</span>
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
                        <AlertDialogAction onClick={() => handleDelete(fish.id, fish.name)}>削除</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}