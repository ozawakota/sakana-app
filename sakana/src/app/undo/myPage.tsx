'use client'

import { atom, useAtom, useAtomValue } from "jotai"
import { withUndo } from "jotai-history"
import { memo, useRef, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Undo2, Redo2 } from "lucide-react"

interface DrawAction {
  type: 'draw'
  points: { x: number; y: number }[]
}

const drawActionsAtom = atom<DrawAction[]>([])
const undoDrawActionsAtom = withUndo(drawActionsAtom, 10)

let renderCount = 0
const UndoRedoControls = memo(() => {
  console.log("rerender:", ++renderCount)
  const { undo, redo, canUndo, canRedo } = useAtomValue(undoDrawActionsAtom)
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

export default function UndoApp() {
  const [drawActions, setDrawActions] = useAtom(drawActionsAtom)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([])
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null)

  const CANVAS_WIDTH = 400
  const CANVAS_HEIGHT = 400

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctxRef.current = ctx
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Load background image
    const img = new Image()
    img.src = 'https://placehold.jp/50x50.png'
    img.onload = () => {
      setBackgroundImage(img)
    }
  }, [])

  useEffect(() => {
    redrawCanvas()
  }, [drawActions, backgroundImage])

  const redrawCanvas = useCallback(() => {
    const ctx = ctxRef.current
    const canvas = canvasRef.current
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background image
    if (backgroundImage) {
      const x = (canvas.width - backgroundImage.width) / 2
      const y = (canvas.height - backgroundImage.height) / 2
      ctx.drawImage(backgroundImage, x, y)
    }

    drawActions.forEach(action => {
      ctx.beginPath()
      action.points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y)
        } else {
          ctx.lineTo(point.x, point.y)
        }
      })
      ctx.stroke()
    })
  }, [drawActions, backgroundImage])

  const getCanvasCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }, [])

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoordinates(e)
    setIsDrawing(true)
    setCurrentStroke([{ x, y }])

    const ctx = ctxRef.current
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }, [getCanvasCoordinates])

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const { x, y } = getCanvasCoordinates(e)
    setCurrentStroke(prev => [...prev, { x, y }])

    const ctx = ctxRef.current
    if (ctx) {
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }, [isDrawing, getCanvasCoordinates])

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false)
      setDrawActions(prev => [...prev, { type: 'draw', points: currentStroke }])
      setCurrentStroke([])
    }
  }, [isDrawing, currentStroke, setDrawActions])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="relative w-full" style={{ paddingBottom: '100%' }}>
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="absolute top-0 left-0 w-full h-full border border-gray-300 rounded-md shadow-sm bg-white cursor-crosshair"
            aria-label="描画キャンバス"
          />
        </div>
        <UndoRedoControls />
      </div>
    </div>
  )
}