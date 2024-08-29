// types/store.ts

import { FishModel } from './model'

export type WaterType = 'ALL' | 'FRESHWATER' | 'SALTWATER' | 'BRACKISH'
export type AlphabetFilter = 'ALL' | 'ア' | 'カ' | 'サ' | 'タ' | 'ナ' | 'ハ' | 'マ' | 'ヤ' | 'ラ' | 'ワ'

export interface FishStore {
  fishList: FishModel[]
  filteredFishList: FishModel[]
  waterTypeFilter: WaterType
  alphabetFilter: AlphabetFilter
  speciesFilter: string
  setFishList: (fishList: FishModel[]) => void
  setWaterTypeFilter: (filter: WaterType) => void
  setAlphabetFilter: (filter: AlphabetFilter) => void
  setSpeciesFilter: (filter: string) => void
  resetFilters: () => void
  applyFilters: () => void
}