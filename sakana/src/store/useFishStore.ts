import { create } from 'zustand'

type Fish = {
  id: number
  name: string
  description: string | null
  waterType: 'FRESHWATER' | 'SALTWATER' | 'BRACKISH'
  species: string
  createdAt: Date
  updatedAt: Date
}

type WaterTypeFilter = 'ALL' | 'FRESHWATER' | 'SALTWATER' | 'BRACKISH'

type FishStore = {
  fishList: Fish[]
  filteredFishList: Fish[]
  waterTypeFilter: WaterTypeFilter
  setFishList: (fishList: Fish[]) => void
  setWaterTypeFilter: (filter: WaterTypeFilter) => void
}

export const useFishStore = create<FishStore>((set, get) => ({
  fishList: [],
  filteredFishList: [],
  waterTypeFilter: 'ALL',
  setFishList: (fishList) => {
    set({ fishList, filteredFishList: fishList })
  },
  setWaterTypeFilter: (filter) => {
    const { fishList } = get()
    const filteredFishList = filter === 'ALL' 
      ? fishList 
      : fishList.filter(fish => fish.waterType === filter)
    set({ waterTypeFilter: filter, filteredFishList })
  }
}))