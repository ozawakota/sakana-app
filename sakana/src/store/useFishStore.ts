import { create } from 'zustand'
import { prisma } from '@/lib/prisma'

type Fish = {
  id: number
  name: string
  description: string | null
  waterType: 'FRESHWATER' | 'SALTWATER' | 'BRACKISH'
  species: string
  createdAt: Date
  updatedAt: Date
}

type FishStore = {
  fishList: Fish[]
  isLoading: boolean
  error: string | null
  fetchFishList: () => Promise<void>
}

export const useFishStore = create<FishStore>((set) => ({
  fishList: [],
  isLoading: false,
  error: null,
  fetchFishList: async () => {
    set({ isLoading: true, error: null })
    try {
      const fish = await prisma.fish.findMany({
        orderBy: {
          name: 'asc',
        },
      })
      set({ fishList: fish, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch fish list:', error)
      set({ error: 'Failed to fetch fish list', isLoading: false })
    }
  },
}))