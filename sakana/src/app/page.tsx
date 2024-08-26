
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getWaterTypeJapanese } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useFishStore } from '@/store/useFishStore'
import FishList from '@/app/fish-list/page'

async function getInitialFishList() {
  try {
    return await prisma.fish.findMany({
      orderBy: {
        name: 'asc',
      },
    })
  } catch (error) {
    console.error('Failed to fetch initial fish list:', error)
    return []
  }
}

// Server component for the home page
export default async function Home() {
  const initialFishList = await getInitialFishList()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">魚図鑑</h1>
      <p className="text-xl text-center mb-8">日本の海や川に生息する魚たちの情報をご覧いただけます。</p>
      {/* <div className="flex justify-center md:w-[900px] mx-auto gap-[50px]">
          <Button variant="success">Save</Button>
          <Button variant="destructive">Delete</Button>
      </div> */}
      <div className="mb-8 text-center">
        <Button asChild>
          <Link href="/register-fish">新しい魚を登録する</Link>
        </Button>
      </div>

      <FishList initialFishList={initialFishList} />
    </div>
  )
}