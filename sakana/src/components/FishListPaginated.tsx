'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getWaterTypeJapanese } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, AlertTriangle, Loader2 } from 'lucide-react'
import { FishModel } from '@/types/model'
import { LoadingSkeleton } from './LoadingSkeleton'
import { ErrorBoundary } from './ErrorBoundary'

type FishListPaginatedProps = {
  initialFishList: FishModel[]
}

function FishListContent({ initialFishList }: FishListPaginatedProps) {
  const [fishList, setFishList] = useState<FishModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPaginationLoading, setIsPaginationLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  useEffect(() => {
    if (initialFishList && initialFishList.length > 0) {
      setFishList(initialFishList)
      setIsLoading(false)
    } else {
      setError('魚のリストの取得に失敗しました。')
    }
  }, [initialFishList])

  const indexOfLastFish = currentPage * itemsPerPage
  const indexOfFirstFish = indexOfLastFish - itemsPerPage
  const currentFishes = fishList.slice(indexOfFirstFish, indexOfLastFish)
  const totalPages = Math.ceil(fishList.length / itemsPerPage)

  const nextPage = () => {
    setIsPaginationLoading(true)
    setTimeout(() => {
      setCurrentPage(prev => Math.min(prev + 1, totalPages))
      setIsPaginationLoading(false)
    }, 500)
  }

  const prevPage = () => {
    setIsPaginationLoading(true)
    setTimeout(() => {
      setCurrentPage(prev => Math.max(prev - 1, 1))
      setIsPaginationLoading(false)
    }, 500)
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-8" role="alert">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
        <p className="mt-2 text-lg font-semibold text-gray-600">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          再読み込み
        </Button>
      </div>
    )
  }

  return (
    <>
      {fishList.length === 0 ? (
        <div className="text-center py-8" role="alert">
          <p className="text-lg font-semibold text-gray-600">魚が見つかりません。</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" role="list" aria-label="魚のリスト">
            {currentFishes.map((fish) => (
              <Card key={fish.id} className="flex flex-col" role="listitem">
                <CardHeader>
                  <CardTitle>{fish.name}</CardTitle>
                  <CardDescription>{getWaterTypeJapanese(fish.waterType)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-3">{fish.description}</p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button asChild variant="outline" className="w-full group hover:bg-blue-500 hover:text-white transition-colors duration-300" disabled={isPaginationLoading}>
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
          <div className="flex justify-between items-center mt-6">
            <Button
              onClick={prevPage}
              disabled={isPaginationLoading || currentPage === 1}
              className="flex items-center"
            >
              {isPaginationLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ChevronLeft className="mr-2 h-4 w-4" />
              )}
              戻る
            </Button>
            <span className="text-sm text-white">
              ページ {currentPage} / {totalPages}
            </span>
            <Button
              onClick={nextPage}
              disabled={isPaginationLoading || currentPage === totalPages}
              className="flex items-center"
            >
              次へ
              {isPaginationLoading ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              ) : (
                <ChevronRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
        </>
      )}
    </>
  )
}

export default function FishListPaginated(props: FishListPaginatedProps) {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <FishListContent {...props} />
    </ErrorBoundary>
  )
}

function ErrorFallback() {
  return (
    <div className="text-center py-8" role="alert">
      <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
      <p className="mt-2 text-lg font-semibold text-gray-600">予期せぬエラーが発生しました。</p>
      <Button onClick={() => window.location.reload()} className="mt-4">
        ページを再読み込み
      </Button>
    </div>
  )
}