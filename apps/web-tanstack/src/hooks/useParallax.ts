'use client'

import { useRef } from 'react'
import { useScroll, useTransform, type MotionValue } from 'framer-motion'

interface UseParallaxOptions {
  speed?: number
  offset?: [number, number]
  containerRef?: React.RefObject<HTMLElement | null>
}

interface UseParallaxResult {
  ref: React.RefObject<HTMLElement> | null
  y: MotionValue<number>
  scale: MotionValue<number>
  opacity: MotionValue<number>
}

export function useParallax(options: UseParallaxOptions = {}): UseParallaxResult {
  const { speed = 0.5, offset = [0, 1], containerRef } = options

  const ownRef = useRef<HTMLElement>(null!)
  const targetRef = containerRef ?? ownRef

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: [`start ${offset[0] * 100}%`, `end ${offset[1] * 100}%`],
  })

  const range = speed > 0 ? [-100 * speed, 100 * speed] : [100 * Math.abs(speed), -100 * Math.abs(speed)]

  const y = useTransform(scrollYProgress, [0, 1], range)
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.6])

  return {
    ref: containerRef ? null : ownRef,
    y,
    scale,
    opacity,
  }
}
