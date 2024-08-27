import { prisma } from '@/lib/prisma'
import FishListClient from '@/components/FishListClient'
import { Button } from "@/components/ui/button"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Link from 'next/link'

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
  const session = await getServerSession(authOptions)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">魚一覧</h1>
      <div className="my-8">
        {session ? (
          <Button asChild>
            <Link href="/register-fish">新しい魚を登録</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/auth/signin">ログインして魚を登録</Link>
          </Button>
        )}
      </div>

      <FishListClient initialFishList={fishList} showDeleteButton={!!session} />
    </div>
  )
}