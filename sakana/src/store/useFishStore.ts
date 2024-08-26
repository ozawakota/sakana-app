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
type AlphabetFilter = 'ALL' | 'ア' | 'カ' | 'サ' | 'タ' | 'ナ' | 'ハ' | 'マ' | 'ヤ' | 'ラ' | 'ワ'

type FishStore = {
  fishList: Fish[]
  filteredFishList: Fish[]
  waterTypeFilter: WaterTypeFilter
  alphabetFilter: AlphabetFilter
  setFishList: (fishList: Fish[]) => void
  setWaterTypeFilter: (filter: WaterTypeFilter) => void
  setAlphabetFilter: (filter: AlphabetFilter) => void
  applyFilters: () => void
}

export const useFishStore = create<FishStore>((set, get) => ({
  fishList: [],
  filteredFishList: [],
  waterTypeFilter: 'ALL',
  alphabetFilter: 'ALL',
  setFishList: (fishList) => {
    set({ fishList, filteredFishList: fishList })
  },
  setWaterTypeFilter: (filter) => {
    set({ waterTypeFilter: filter })
    get().applyFilters()
  },
  setAlphabetFilter: (filter) => {
    set({ alphabetFilter: filter })
    get().applyFilters()
  },
  applyFilters: () => {
    const { fishList, waterTypeFilter, alphabetFilter } = get()
    let filtered = fishList

    if (waterTypeFilter !== 'ALL') {
      filtered = filtered.filter(fish => fish.waterType === waterTypeFilter)
    }

    if (alphabetFilter !== 'ALL') {
      filtered = filtered.filter(fish => {
        const firstChar = fish.name.charAt(0)
        const alphabetRanges: { [key: string]: [string, string] } = {
          'ア': ['ア', 'オ'], 'カ': ['カ', 'コ'], 'サ': ['サ', 'ソ'], 'タ': ['タ', 'ト'],
          'ナ': ['ナ', 'ノ'], 'ハ': ['ハ', 'ホ'], 'マ': ['マ', 'モ'], 'ヤ': ['ヤ', 'ヨ'],
          'ラ': ['ラ', 'ロ'], 'ワ': ['ワ', 'ン']
        }
        const [start, end] = alphabetRanges[alphabetFilter]
        return firstChar >= start && firstChar <= end
      })
    }

    set({ filteredFishList: filtered })
  }
}))