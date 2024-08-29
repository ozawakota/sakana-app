// store/useFishStore.ts

import { create } from 'zustand'
import { FishStore, WaterType, AlphabetFilter } from '../types/store'
import { FishModel } from '../types/model'

export const useFishStore = create<FishStore>((set, get) => ({
  fishList: [],
  filteredFishList: [],
  waterTypeFilter: 'ALL',
  alphabetFilter: 'ALL',
  speciesFilter: 'ALL',

  setFishList: (fishList: FishModel[]) => set({ fishList, filteredFishList: fishList }),

  setWaterTypeFilter: (filter: WaterType) => {
    set({ waterTypeFilter: filter })
    get().applyFilters()
  },

  setAlphabetFilter: (filter: AlphabetFilter) => {
    set({ alphabetFilter: filter })
    get().applyFilters()
  },

  setSpeciesFilter: (filter: string) => {
    set({ speciesFilter: filter })
    get().applyFilters()
  },

  resetFilters: () => {
    set({
      waterTypeFilter: 'ALL',
      alphabetFilter: 'ALL',
      speciesFilter: 'ALL'
    })
    get().applyFilters()
  },

  applyFilters: () => {
    const { fishList, waterTypeFilter, alphabetFilter, speciesFilter } = get()
    let filtered = fishList

    if (waterTypeFilter !== 'ALL') {
      filtered = filtered.filter(fish => fish.waterType === waterTypeFilter)
    }

    if (alphabetFilter !== 'ALL') {
      filtered = filtered.filter(fish => fish.name.startsWith(alphabetFilter))
    }

    if (speciesFilter !== 'ALL') {
      filtered = filtered.filter(fish => fish.species === speciesFilter)
    }

    set({ filteredFishList: filtered })
  }
}))