'use client'

import { atom, useAtom, useAtomValue } from "jotai"
import { atomWithReset, useResetAtom } from 'jotai/utils'
import { memo, useRef, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Undo2, Redo2, Trash2 } from "lucide-react"

interface DrawAction {
  type: 'draw' | 'reset'
  points: { x: number; y: number }[]
}

const drawActionsAtom = atomWithReset<DrawAction[]>([])
const redoStackAtom = atom<DrawAction[]>([])

let renderCount = 0
const UndoRedoControls = memo(() => {
  console.log("rerender:", ++renderCount)
  const [drawActions, setDrawActions] = useAtom(drawActionsAtom)
  const [redoStack, setRedoStack] = useAtom(redoStackAtom)
  const resetDrawActions = useResetAtom(drawActionsAtom)

  const undo = useCallback(() => {
    if (drawActions.length > 0) {
      const lastAction = drawActions[drawActions.length - 1]
      setDrawActions(prev => prev.slice(0, -1))
      setRedoStack(prev => [...prev, lastAction])
    }
  }, [drawActions, setDrawActions, setRedoStack])

  const redo = useCallback(() => {
    if (redoStack.length > 0) {
      const actionToRedo = redoStack[redoStack.length - 1]
      setRedoStack(prev => prev.slice(0, -1))
      setDrawActions(prev => [...prev, actionToRedo])
    }
  }, [redoStack, setRedoStack, setDrawActions])

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

export default function UndoApp() {
  const [drawActions, setDrawActions] = useAtom(drawActionsAtom)
  const [redoStack, setRedoStack] = useAtom(redoStackAtom)
  const resetDrawActions = useResetAtom(drawActionsAtom)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const previewCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([])
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const CANVAS_WIDTH = 400
  const CANVAS_HEIGHT = 400
  const PREVIEW_SIZE = 200

  useEffect(() => {
    const canvas = canvasRef.current
    const previewCanvas = previewCanvasRef.current
    if (!canvas || !previewCanvas) return

    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    previewCanvas.width = PREVIEW_SIZE
    previewCanvas.height = PREVIEW_SIZE

    const ctx = canvas.getContext('2d')
    const previewCtx = previewCanvas.getContext('2d')
    if (!ctx || !previewCtx) return

    ctxRef.current = ctx
    previewCtxRef.current = previewCtx
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    previewCtx.strokeStyle = 'black'
    previewCtx.lineWidth = 1
    previewCtx.lineCap = 'round'
    previewCtx.lineJoin = 'round'

    // Load background image for main canvas only
    const img = new Image()
    img.src = 'https://placehold.jp/50x50.png'
    img.onload = () => {
      setBackgroundImage(img)
    }

    // WebSocket connection
    const ws = new WebSocket('ws://localhost:3000')
    wsRef.current = ws

    ws.onmessage = (event) => {
      const action = JSON.parse(event.data) as DrawAction
      if (action.type === 'reset') {
        resetDrawActions()
        setRedoStack([])
      } else {
        setDrawActions(prev => [...prev, action])
        setRedoStack([])
      }
    }

    return () => {
      ws.close()
    }
  }, [setDrawActions, resetDrawActions, setRedoStack])

  useEffect(() => {
    redrawCanvas()
    redrawPreviewCanvas()
  }, [drawActions, backgroundImage])

  const redrawCanvas = useCallback(() => {
    const ctx = ctxRef.current
    const canvas = canvasRef.current
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background image on main canvas
    if (backgroundImage) {
      const x = (canvas.width - backgroundImage.width) / 2
      const y = (canvas.height - backgroundImage.height) / 2
      ctx.drawImage(backgroundImage, x, y)
    }

    drawActions.forEach(action => {
      if (action.type === 'draw') {
        ctx.beginPath()
        action.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y)
          } else {
            ctx.lineTo(point.x, point.y)
          }
        })
        ctx.stroke()
      }
    })
  }, [drawActions, backgroundImage])

  const redrawPreviewCanvas = useCallback(() => {
    const ctx = previewCtxRef.current
    const canvas = previewCanvasRef.current
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const scale = PREVIEW_SIZE / CANVAS_WIDTH

    ctx.save()
    ctx.scale(scale, scale)

    // Apply anti-aliasing
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // Increase line width for preview
    ctx.lineWidth = 2 / scale

    drawActions.forEach(action => {
      if (action.type === 'draw') {
        ctx.beginPath()
        action.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y)
          } else {
            ctx.lineTo(point.x, point.y)
          }
        })
        ctx.stroke()
      }
    })

    ctx.restore()
  }, [drawActions])

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
    if (isDrawing && currentStroke.length > 0) {
      setIsDrawing(false)
      const newAction: DrawAction = { type: 'draw', points: currentStroke }
      setDrawActions(prev => [...prev, newAction])
      setCurrentStroke([])
      setRedoStack([])
      wsRef.current?.send(JSON.stringify(newAction))
    }
  }, [isDrawing, currentStroke, setDrawActions, setRedoStack])

  const handleReset = useCallback(() => {
    resetDrawActions()
    setRedoStack([])
    wsRef.current?.send(JSON.stringify({ type: 'reset', points: [] }))
  }, [resetDrawActions, setRedoStack])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold mb-2">プレビュー画面</h2>
        <div className="relative w-1/2 mx-auto" style={{ paddingBottom: '50%' }}>
          <canvas
            ref={previewCanvasRef}
            className="absolute top-0 left-0 w-full h-full border border-gray-300 rounded-md shadow-sm bg-white"
            aria-label="プレビューキャンバス"
          />
        </div>
        <h2 className="text-lg font-semibold mb-2">入力画面</h2>
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
        <div className="flex justify-between">
          <UndoRedoControls />
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            aria-label="全て消去"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}