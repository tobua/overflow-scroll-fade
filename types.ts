import type { CSSProperties, JSX } from 'react'
import type { ArrowProps } from './arrow'

export type FadeDirection = 'top' | 'right' | 'bottom' | 'left'
export type ScrollDirection = 'horizontal' | 'vertical'

export type Props<T extends keyof JSX.IntrinsicElements = 'div'> = JSX.IntrinsicElements[T] & {
  as?: T
  direction?: ScrollDirection
  color?: string
  overflowStyle?: CSSProperties
  indicatorStyle?: CSSProperties
  fallbackStyle?: CSSProperties
  arrow?: ArrowProps | boolean
}
