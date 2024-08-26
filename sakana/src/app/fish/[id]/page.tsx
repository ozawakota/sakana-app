
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getWaterTypeJapanese } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"


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
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{fish.name}</CardTitle>
          <CardDescription>
            <span className="font-semibold">生息地域:</span> {getWaterTypeJapanese(fish.waterType)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">説明</h2>
              <p>{fish.description}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">科目</h2>
              <p>{fish.species}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">登録日</h2>
              <p>{new Date(fish.createdAt).toLocaleDateString('ja-JP')}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">最終更新日</h2>
              <p>{new Date(fish.updatedAt).toLocaleDateString('ja-JP')}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/fish-list">一覧に戻る</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}