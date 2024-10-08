'use client'

import { atom, useAtom, useAtomValue } from "jotai"
import { withUndo } from "jotai-history"
import { memo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Undo2, Redo2 } from "lucide-react"

const searchTextAtom = atom("")
const undoSearchTextAtom = withUndo(searchTextAtom, 10)

let renderCount = 0
const UndoRedoControls = memo(() => {
  console.log("rerender:", ++renderCount)
  const { undo, redo, canUndo, canRedo } = useAtomValue(undoSearchTextAtom)
  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={undo} 
        disabled={!canUndo}
        aria-label="Undo"
      >
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={redo} 
        disabled={!canRedo}
        aria-label="Redo"
      >
        <Redo2 className="h-4 w-4" />
      </Button>
    </div>
  )
})
UndoRedoControls.displayName = "UndoRedoControls"

export default function UndoApp() {
  const [searchText, setSearchText] = useAtom(searchTextAtom)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-4">
        <Input
          value={searchText}
          placeholder="Type to add search text"
          type="text"
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full"
        />
        <UndoRedoControls />
      </div>
    </div>
  )
}