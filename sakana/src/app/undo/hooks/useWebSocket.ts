import { useRef, useEffect } from 'react'
import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { DrawAction, drawActionsAtom, redoStackAtom } from '../atoms/drawingAtoms'

export const useWebSocket = (setHasDrawn: (value: boolean) => void) => {
  const wsRef = useRef<WebSocket | null>(null)
  const [, setDrawActions] = useAtom(drawActionsAtom)
  const [, setRedoStack] = useAtom(redoStackAtom)
  const resetDrawActions = useResetAtom(drawActionsAtom)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000')
    wsRef.current = ws

    ws.onmessage = (event) => {
      const action = JSON.parse(event.data) as DrawAction
      if (action.type === 'reset') {
        resetDrawActions()
        setRedoStack([])
        setHasDrawn(false)
      } else {
        setDrawActions(prev => [...prev, action])
        setRedoStack([])
        setHasDrawn(true)
      }
    }

    return () => {
      ws.close()
    }
  }, [setDrawActions, resetDrawActions, setRedoStack, setHasDrawn])

  return wsRef
}