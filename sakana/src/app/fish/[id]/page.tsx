import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getWaterTypeJapanese } from "@/lib/utils"
import { Metadata, ResolvingMetadata } from 'next'
import FishDetailClient from './FishDetailClient'

type Props = {
  params: { id: string }
}

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

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const fish = await getFish(params.id)
 
  return {
    title: `${fish.name} | 魚一覧ページ`,
    description: `${fish.name}の詳細情報。生息地: ${getWaterTypeJapanese(fish.waterType)}、科目: ${fish.species}`,
    openGraph: {
      title: `${fish.name} | 魚一覧`,
      description: `${fish.name}の詳細情報。生息地: ${getWaterTypeJapanese(fish.waterType)}、科目: ${fish.species}`,
      type: 'article',
      images: [
        {
          url: '/placeholder.svg?height=630&width=1200',
          width: 1200,
          height: 630,
          alt: `${fish.name}の画像`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${fish.name} | 魚図鑑`,
      description: `${fish.name}の詳細情報。生息地: ${getWaterTypeJapanese(fish.waterType)}、科目: ${fish.species}`,
      images: ['/placeholder.svg?height=630&width=1200'],
    },
  }
}

export default async function FishDetailPage({ params }: Props) {
  const fish = await getFish(params.id)
  return <FishDetailClient fish={fish} />
}