import { memo, useCallback } from 'react'
import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { Button } from "@/components/ui/button"
import { Undo2, Redo2 } from "lucide-react"
import { drawActionsAtom, redoStackAtom } from '../atoms/drawingAtoms'

let renderCount = 0

export const UndoRedoControls = memo(() => {
  console.log("rerender:", ++renderCount)
  const [drawActions, setDrawActions] = useAtom(drawActionsAtom)
  const [redoStack, setRedoStack] = useAtom(redoStackAtom)
  const resetDrawActions = useResetAtom(drawActionsAtom)

  const undo = useCallback(() => {
    if (drawActions.length > 0) {
      const lastAction = drawActions[drawActions.length - 1]
      setDrawActions(prev => prev.slice(0, -1))
      setRedoStack(prev => [...prev, lastAction])
      console.log('Undo - Removed action:', lastAction)
      console.log('Current draw actions:', drawActions.slice(0, -1))
      console.log('Redo stack:', [...redoStack, lastAction])
    }
  }, [drawActions, setDrawActions, setRedoStack])

  const redo = useCallback(() => {
    if (redoStack.length > 0) {
      const actionToRedo = redoStack[redoStack.length - 1]
      setRedoStack(prev => prev.slice(0, -1))
      setDrawActions(prev => [...prev, actionToRedo])
      console.log('Redo - Added action:', actionToRedo)
      console.log('Current draw actions:', [...drawActions, actionToRedo])
      console.log('Redo stack:', redoStack.slice(0, -1))
    }
  }, [redoStack, setRedoStack, setDrawActions, drawActions])

  const canUndo = drawActions.length > 0
  const canRedo = redoStack.length > 0

  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={undo} 
        disabled={!canUndo}
        aria-label="元に戻す"
      >
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={redo} 
        disabled={!canRedo}
        aria-label="やり直す"
      >
        <Redo2 className="h-4 w-4" />
      </Button>
    </div>
  )
})
UndoRedoControls.displayName = "UndoRedoControls"