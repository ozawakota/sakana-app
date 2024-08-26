'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { getWaterTypeJapanese } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

export default function FishListClient({ initialFishList }: FishListClientProps) {
  const { filteredFishList, waterTypeFilter, setFishList, setWaterTypeFilter } = useFishStore()

  useEffect(() => {
    if (initialFishList && initialFishList.length > 0) {
      setFishList(initialFishList)
    }
  }, [initialFishList, setFishList])

  if (!filteredFishList || filteredFishList.length === 0) {
    return <div>魚が見つかりません。</div>
  }

  return (
    <>
      <div className="mb-6">
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
    </>
  )
}