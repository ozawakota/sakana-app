import React from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw } from 'lucide-react'
import { speciesList } from "@/lib/common"
import { WaterType, AlphabetFilter } from '@/types/store'

type FilterSectionProps = {
  waterTypeFilter: WaterType
  alphabetFilter: AlphabetFilter
  speciesFilter: string
  setWaterTypeFilter: (value: WaterType) => void
  setAlphabetFilter: (value: AlphabetFilter) => void
  setSpeciesFilter: (value: string) => void
  resetFilters: () => void
}

export function FilterSection({ 
  waterTypeFilter, 
  alphabetFilter, 
  speciesFilter, 
  setWaterTypeFilter, 
  setAlphabetFilter, 
  setSpeciesFilter, 
  resetFilters 
}: FilterSectionProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label htmlFor="water-type-filter" className="block text-sm font-medium text-white mb-1">生息地</label>
          <Select onValueChange={setWaterTypeFilter} value={waterTypeFilter}>
            <SelectTrigger id="water-type-filter" className="w-[180px]">
              <SelectValue placeholder="生息地で絞り込み" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">すべて</SelectItem>
              <SelectItem value="FRESHWATER">淡水</SelectItem>
              <SelectItem value="SALTWATER">海水</SelectItem>
              <SelectItem value="BRACKISH">汽水</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="alphabet-filter" className="block text-sm font-medium text-white mb-1">アイウエオ順</label>
          <Select onValueChange={setAlphabetFilter} value={alphabetFilter}>
            <SelectTrigger id="alphabet-filter" className="w-[180px]">
              <SelectValue placeholder="アイウエオ順で絞り込み" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">すべて</SelectItem>
              <SelectItem value="ア">ア行</SelectItem>
              <SelectItem value="カ">カ行</SelectItem>
              <SelectItem value="サ">サ行</SelectItem>
              <SelectItem value="タ">タ行</SelectItem>
              <SelectItem value="ナ">ナ行</SelectItem>
              <SelectItem value="ハ">ハ行</SelectItem>
              <SelectItem value="マ">マ行</SelectItem>
              <SelectItem value="ヤ">ヤ行</SelectItem>
              <SelectItem value="ラ">ラ行</SelectItem>
              <SelectItem value="ワ">ワ行</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="species-filter" className="block text-sm font-medium text-white mb-1">科目</label>
          <Select onValueChange={setSpeciesFilter} value={speciesFilter}>
            <SelectTrigger id="species-filter" className="w-[180px]">
              <SelectValue placeholder="科目で絞り込み" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">すべて</SelectItem>
              {speciesList.map((species) => (
                <SelectItem key={species} value={species}>{species}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={resetFilters} variant="alert" className="flex items-center text-black">
        <RefreshCw className="mr-2 h-4 w-4 text-black" />
        フィルターをリセット
      </Button>
    </div>
  )
}