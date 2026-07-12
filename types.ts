import type React from 'react'
import type { ArrowProps } from './arrow'

export type FadeDirection = 'top' | 'right' | 'bottom' | 'left'
export type ScrollDirection = 'horizontal' | 'vertical'

export type Props<T extends keyof React.JSX.IntrinsicElements = 'div'> = Omit<React.JSX.IntrinsicElements[T], 'direction' | 'color'> & {
  as?: T
  direction?: ScrollDirection
  color?: string
  overflowStyle?: React.CSSProperties
  indicatorStyle?: React.CSSProperties
  fallbackStyle?: React.CSSProperties
  arrow?: ArrowProps | boolean
}
