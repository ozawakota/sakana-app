import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getWaterTypeJapanese } from "@/lib/utils"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplet, Fish, CalendarDays, RefreshCw, ArrowLeft } from 'lucide-react'

async function getFish(id: string) {
  try {
    const fish = await prisma.fish.findUnique({
      where: { id: parseInt(id) },
    })
    if (!fish) {
      notFound()
    }
    return fish
  } catch (error) {
    console.error('Failed to fetch fish:', error)
    throw new Error('Failed to fetch fish')
  }
}

export default async function FishDetail({ params }: { params: { id: string } }) {
  const fish = await getFish(params.id)

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
        <CardFooter className="bg-gray-50 px-8 py-4">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/fish-list" className="flex items-center justify-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              魚一覧に戻る
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}