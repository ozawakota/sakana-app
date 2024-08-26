import { prisma } from '@/lib/prisma'
import FishListClient from '@/components/FishListClient'
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
      <h1 className="text-3xl font-bold mb-6 text-white">魚一覧</h1>
      <FishListClient initialFishList={fishList} />
      <div className="mt-8">
        <Button asChild>
          <a href="/register-fish">新しい魚を登録</a>
        </Button>
      </div>
    </div>
  )
}