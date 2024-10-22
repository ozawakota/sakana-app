import { useRef, useEffect } from 'react'

interface UseCanvasProps {
  width: number
  height: number
  isPreview?: boolean
}

export const useCanvas = ({ width, height, isPreview = false }: UseCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctxRef.current = ctx
    ctx.strokeStyle = 'black'
    ctx.lineWidth = isPreview ? 1 : 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    if (isPreview) {
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
    }
  }, [width, height, isPreview])

  return { canvasRef, ctxRef }
}