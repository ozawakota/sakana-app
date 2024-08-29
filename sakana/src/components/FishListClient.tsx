'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getWaterTypeJapanese } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFishStore } from '@/store/useFishStore'
import { ChevronRight, RefreshCw, Trash2 } from 'lucide-react'
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

import { speciesList } from "@/lib/common"
import { FishModel } from '@/types/model'
import { WaterType, AlphabetFilter } from '@/types/store'
import { LoadingSkeleton } from './LoadingSkeleton'

type FilterSectionProps = {
  waterTypeFilter: WaterType
  alphabetFilter: AlphabetFilter
  speciesFilter: string
  setWaterTypeFilter: (value: WaterType) => void
  setAlphabetFilter: (value: AlphabetFilter) => void
  setSpeciesFilter: (value: string) => void
  resetFilters: () => void
}

type FishListClientProps = {
  initialFishList: FishModel[]
  showDeleteButton: boolean
}

function FilterSection({ 
  waterTypeFilter, 
  alphabetFilter, 
  speciesFilter, 
  setWaterTypeFilter, 
  setAlphabetFilter, 
  setSpeciesFilter, 
  resetFilters 
}: FilterSectionProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label htmlFor="water-type-filter" className="block text-sm font-medium text-white mb-1">生息地</label>
          <Select onValueChange={setWaterTypeFilter} value={waterTypeFilter}>
            <SelectTrigger id="water-type-filter" className="w-[180px]">
              <SelectValue placeholder="生息地で絞り込み" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">すべて</SelectItem>
              <SelectItem value="FRESHWATER">淡水</SelectItem>
              <SelectItem value="SALTWATER">海水</SelectItem>
              <SelectItem value="BRACKISH">汽水</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="alphabet-filter" className="block text-sm font-medium text-white mb-1">アイウエオ順</label>
          <Select onValueChange={setAlphabetFilter} value={alphabetFilter}>
            <SelectTrigger id="alphabet-filter" className="w-[180px]">
              <SelectValue placeholder="アイウエオ順で絞り込み" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">すべて</SelectItem>
              <SelectItem value="ア">ア行</SelectItem>
              <SelectItem value="カ">カ行</SelectItem>
              <SelectItem value="サ">サ行</SelectItem>
              <SelectItem value="タ">タ行</SelectItem>
              <SelectItem value="ナ">ナ行</SelectItem>
              <SelectItem value="ハ">ハ行</SelectItem>
              <SelectItem value="マ">マ行</SelectItem>
              <SelectItem value="ヤ">ヤ行</SelectItem>
              <SelectItem value="ラ">ラ行</SelectItem>
              <SelectItem value="ワ">ワ行</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="species-filter" className="block text-sm font-medium text-white mb-1">科目</label>
          <Select onValueChange={setSpeciesFilter} value={speciesFilter}>
            <SelectTrigger id="species-filter" className="w-[180px]">
              <SelectValue placeholder="科目で絞り込み" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">すべて</SelectItem>
              {speciesList.map((species) => (
                <SelectItem key={species} value={species}>{species}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={resetFilters} variant="alert" className="flex items-center text-black">
        <RefreshCw className="mr-2 h-4 w-4 text-black" />
        フィルターをリセット
      </Button>
    </div>
  )
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