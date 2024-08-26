import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getWaterTypeJapanese } from "@/lib/utils";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"


async function getFishList() {
  try {
    const fish = await prisma.fish.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    return fish
  } catch (error) {
    console.error('Failed to fetch fish list:', error)
    throw new Error('Failed to fetch fish list')
  }
}

export default async function FishList() {
  const fishList = await getFishList()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">魚図鑑</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fishList.map((fish) => (
          <Card key={fish.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{fish.name}</CardTitle>
              <CardDescription>{getWaterTypeJapanese(fish.waterType)}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-3">{fish.description}</p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Link href={`/fish/${fish.id}`} className="text-blue-600 hover:underline">
                詳細を見る
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}