import { atom } from "jotai"
import { atomWithReset } from 'jotai/utils'

export interface DrawAction {
  type: 'draw' | 'reset'
  points: { x: number; y: number }[]
}

export const drawActionsAtom = atomWithReset<DrawAction[]>([])
export const redoStackAtom = atom<DrawAction[]>([])