'use client'

import { useCallback, useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { Button } from "@/components/ui/button"
import { Trash2, Database } from "lucide-react"
import { drawActionsAtom, redoStackAtom, DrawAction } from '../atoms/drawingAtoms'
import { UndoRedoControls } from './UndoRedoControls'
import { Canvas } from './Canvas'
import { useWebSocket } from '../hooks/useWebSocket'
import { useDrawing } from '../hooks/useDrawing'
import { useIndexedDB } from '../hooks/useIndexedDB'

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 400

interface StrokeData {
  x: number;
  y: number;
  canvasWidth: number;
  canvasHeight: number;
  points: { x: number; y: number }[];
}

export default function UndoApp() {
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [drawActions, setDrawActions] = useAtom(drawActionsAtom)
  const resetDrawActions = useResetAtom(drawActionsAtom)
  const [redoStack, setRedoStack] = useAtom(redoStackAtom)

  // Extract testId and deliveryId from URL parameters
  const urlParams = new URLSearchParams(window.location.search)
  const testId = urlParams.get('testId') || null
  const deliveryId = urlParams.get('deliveryId') || null

  const wsRef = useWebSocket(setHasDrawn)
  const { startDrawing, draw, stopDrawing } = useDrawing(wsRef)
  const { saveStroke, getStroke, clearStrokes, deleteAllDatabases } = useIndexedDB({ testId, deliveryId })

  useEffect(() => {
    const loadStroke = async () => {
      const savedStroke = await getStroke()
      if (savedStroke) {
        setDrawActions([{ type: 'draw', points: [{ x: savedStroke.x, y: savedStroke.y }] }])
        setHasDrawn(true)
      }
    }
    loadStroke()
  }, [getStroke, setDrawActions])

  const handleStopDrawing = useCallback(async () => {
    const result = stopDrawing()
    
    console.log('====================================');
    console.log(result, "保存します");
    console.log('====================================');
    
    if (result && result.type === 'draw' && result.points.length > 0) {
      setDrawActions(prev => [...prev, result])
      const strokeData: StrokeData = {
        x: result.points[0].x,
        y: result.points[0].y,
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
        points: result.points
      }
      await saveStroke(strokeData)
    }
  }, [stopDrawing, saveStroke, setDrawActions])

  const handleReset = useCallback(async () => {
    resetDrawActions()
    setRedoStack([])
    setHasDrawn(false)
    await clearStrokes()
    wsRef.current?.send(JSON.stringify({ type: 'reset', points: [] }))
    
    console.log('Canvas reset')
    console.log('All strokes cleared')
    console.log('Redo stack cleared')
  }, [resetDrawActions, setRedoStack, wsRef, clearStrokes])

  const handleDeleteAllDatabases = useCallback(async () => {
    await deleteAllDatabases()
    resetDrawActions()
    setRedoStack([])
    setHasDrawn(false)
    console.log('All IndexedDB databases deleted')
  }, [deleteAllDatabases, resetDrawActions, setRedoStack])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold mb-2">入力画面</h2>
        <div className="relative w-full">
          <Canvas
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onMouseDown={(e) => startDrawing(e, null)}
            onMouseMove={(e) => draw(e, null)}
            onMouseUp={handleStopDrawing}
            onMouseLeave={handleStopDrawing}
            backgroundImage={backgroundImage}
            hasDrawn={hasDrawn}
          />
        </div>
        <div className="flex justify-between">
          <UndoRedoControls />
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              aria-label="全て消去"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDeleteAllDatabases}
              aria-label="全てのデータベースを削除"
            >
              <Database className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}