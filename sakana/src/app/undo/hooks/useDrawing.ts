import { useState, useCallback } from 'react'
import { useAtom } from 'jotai'
import { drawActionsAtom, redoStackAtom, DrawAction } from '../atoms/drawingAtoms'

export const useDrawing = (wsRef: React.RefObject<WebSocket>) => {
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([])
  const [drawActions, setDrawActions] = useAtom(drawActionsAtom)
  const [, setRedoStack] = useAtom(redoStackAtom)

  const getCanvasCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }, [])

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>, ctx: CanvasRenderingContext2D | null) => {
    const { x, y } = getCanvasCoordinates(e)
    setIsDrawing(true)
    setCurrentStroke([{ x, y }])

    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }, [getCanvasCoordinates])

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>, ctx: CanvasRenderingContext2D | null) => {
    if (!isDrawing) return

    const { x, y } = getCanvasCoordinates(e)
    setCurrentStroke(prev => [...prev, { x, y }])

    if (ctx) {
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }, [isDrawing, getCanvasCoordinates])

  const stopDrawing = useCallback(() => {
    if (isDrawing && currentStroke.length > 0) {
      setIsDrawing(false)
      const newAction: DrawAction = { type: 'draw', points: currentStroke }
      setDrawActions(prev => [...prev, newAction])
      setCurrentStroke([])
      setRedoStack([])
      wsRef.current?.send(JSON.stringify(newAction))
      
      console.log('New stroke added:', newAction)
      console.log('Current strokes:', drawActions)
      console.log('Points in this stroke:', currentStroke.length)
      console.log('Stroke coordinates:', currentStroke)
    }
  }, [isDrawing, currentStroke, setDrawActions, setRedoStack, wsRef, drawActions])

  return {
    isDrawing,
    currentStroke,
    startDrawing,
    draw,
    stopDrawing
  }
}