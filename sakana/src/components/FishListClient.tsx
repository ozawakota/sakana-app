'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getWaterTypeJapanese } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useFishStore } from '@/store/useFishStore'

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

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

function FilterSection({ waterTypeFilter, alphabetFilter, setWaterTypeFilter, setAlphabetFilter }) {
  return (
    <div className="mb-6 flex flex-wrap gap-4">
      <div>
        <p className='text-white'>生息地</p>
        <Select onValueChange={(value: any) => setWaterTypeFilter(value)} value={waterTypeFilter}>
          <SelectTrigger className="w-[180px]">
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
        <p className='text-white'>アイウエオ順</p>
        <Select onValueChange={(value: any) => setAlphabetFilter(value)} value={alphabetFilter}>
          <SelectTrigger className="w-[180px]">
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

    </div>
  )
}

export default function FishListClient({ initialFishList }: FishListClientProps) {
  const { filteredFishList, waterTypeFilter, alphabetFilter, setFishList, setWaterTypeFilter, setAlphabetFilter } = useFishStore()
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
        setWaterTypeFilter={setWaterTypeFilter}
        setAlphabetFilter={setAlphabetFilter}
      />

      {(!filteredFishList || filteredFishList.length === 0) ? (
        <div className="text-center py-8">
          <p className="text-lg font-semibold text-gray-600">魚が見つかりません。</p>
          <p className="text-sm text-gray-500 mt-2">検索条件を変更してみてください。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFishList.map((fish) => (
            <Card key={fish.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{fish.name}</CardTitle>
                <CardDescription>{getWaterTypeJapanese(fish.waterType)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3">{fish.description}</p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button asChild variant="link">
                  <Link href={`/fish/${fish.id}`}>
                    詳細を見る
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