import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { drawActionsAtom } from '../atoms/drawingAtoms'
import { useCanvas } from '../hooks/useCanvas'

interface CanvasProps {
  width: number
  height: number
  isPreview?: boolean
  onMouseDown?: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseMove?: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseUp?: () => void
  onMouseLeave?: () => void
  backgroundImage?: HTMLImageElement | null
  hasDrawn?: boolean
}

export const Canvas = ({
  width,
  height,
  isPreview = false,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  backgroundImage,
  hasDrawn = false
}: CanvasProps) => {
  const { canvasRef, ctxRef } = useCanvas({ width, height, isPreview })
  const [drawActions] = useAtom(drawActionsAtom)

  const redrawCanvas = () => {
    const ctx = ctxRef.current
    const canvas = canvasRef.current
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (backgroundImage && !hasDrawn) {
      const x = (canvas.width - backgroundImage.width) / 2
      const y = (canvas.height - backgroundImage.height) / 2
      ctx.drawImage(backgroundImage, x, y)
    }

    const scale = isPreview ? height / width : 1
    if (isPreview) {
      ctx.save()
      ctx.scale(scale, scale)
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

    if (isPreview) {
      ctx.restore()
    }
  }

  useEffect(() => {
    redrawCanvas()
  }, [drawActions, backgroundImage, hasDrawn])

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      className={`border border-gray-300 rounded-md shadow-sm bg-white ${
        isPreview ? '' : 'cursor-crosshair'
      }`}
      aria-label={isPreview ? "プレビューキャンバス" : "描画キャンバス"}
    />
  )
}