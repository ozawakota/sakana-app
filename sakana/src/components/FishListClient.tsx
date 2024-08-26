'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getWaterTypeJapanese } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useFishStore } from '@/store/useFishStore'
import { ChevronRight, RefreshCw } from 'lucide-react'

type Fish = {
  id: number
  name: string
  description: string | null
  waterType: 'FRESHWATER' | 'SALTWATER' | 'BRACKISH'
  species: string
  createdAt: Date
  updatedAt: Date
}

type FishListClientProps = {
  initialFishList: Fish[]
}

const speciesList = [
  "サケ科", "アユ科", "コイ科", "タイ科", "サバ科", "カレイ科", "ナマズ科", "スズキ科", "フグ科", "ウナギ科", "カサゴ科", "ボラ科", "イシダイ科", "その他"
]

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-label="魚のリストを読み込み中">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="flex flex-col">
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
          <CardFooter className="mt-auto">
            <Skeleton className="h-9 w-24" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function FilterSection({ waterTypeFilter, alphabetFilter, speciesFilter, setWaterTypeFilter, setAlphabetFilter, setSpeciesFilter, resetFilters }) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label htmlFor="water-type-filter" className="block text-sm font-medium text-white mb-1">生息地</label>
          <Select onValueChange={(value: any) => setWaterTypeFilter(value)} value={waterTypeFilter}>
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
          <Select onValueChange={(value: any) => setAlphabetFilter(value)} value={alphabetFilter}>
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
          <Select onValueChange={(value: any) => setSpeciesFilter(value)} value={speciesFilter}>
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

export default function FishListClient({ initialFishList }: FishListClientProps) {
  const { filteredFishList, waterTypeFilter, alphabetFilter, speciesFilter, setFishList, setWaterTypeFilter, setAlphabetFilter, setSpeciesFilter, resetFilters } = useFishStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (initialFishList && initialFishList.length > 0) {
      setFishList(initialFishList)
      setIsLoading(false)
    }
  }, [initialFishList, setFishList])

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

      {(!filteredFishList || filteredFishList.length === 0) ? (
        <div className="text-center py-8" role="alert">
          <p className="text-lg font-semibold text-gray-600">魚が見つかりません。</p>
          <p className="text-sm text-gray-500 mt-2">検索条件を変更してみてください。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="魚のリスト">
          {filteredFishList.map((fish) => (
            <Card key={fish.id} className="flex flex-col" role="listitem">
              <CardHeader>
                <CardTitle>{fish.name}</CardTitle>
                <CardDescription>{getWaterTypeJapanese(fish.waterType)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3">{fish.description}</p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button asChild variant="outline" className="w-full group hover:bg-blue-500 hover:text-white transition-colors duration-300">
                  <Link href={`/fish/${fish.id}`} className="flex items-center justify-center">
                    詳細を見る
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    <span className="sr-only">{fish.name}の詳細</span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}