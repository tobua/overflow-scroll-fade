import type { CSSProperties, JSX, ReactNode } from 'react'
import type { FadeDirection } from './types'

type ArrowIcon = 'arrow-rounded' | 'pointer-rounded' | 'arrow' | 'pointer'
type ArrowPosition = 'center' | 'end' | 'start'

export interface ArrowProps {
  position: ArrowPosition
  icon: ArrowIcon
  color: string
  image?: string
  markup?: JSX.Element | ReactNode
}

export const defaultArrowProps: ArrowProps = {
  position: 'center',
  icon: 'arrow-rounded',
  color: '#000000',
}

const directionToRotation = {
  left: 180,
  right: 0,
  top: 270,
  bottom: 90,
}

export function Arrow({ icon, color, markup, image, direction }: ArrowProps & { direction: FadeDirection }) {
  const style: CSSProperties = {
    width: 12,
    height: 12,
    display: 'block',
    transform: `rotate(${directionToRotation[direction]}deg)`,
    pointerEvents: 'none',
  }

  if (image) {
    return <img style={style} src={image} alt={`indicate arrow ${direction}`} />
  }

  if (markup) {
    return <span style={style}>{markup}</span>
  }

  if (icon === 'arrow-rounded') {
    return (
      <svg style={style} viewBox="0 0 120 120" stroke={color}>
        <title>Arrow rounded icon</title>
        <line strokeWidth={20} strokeLinecap="round" x1="10" y1="60" x2="110" y2="60" />
        <line strokeWidth={20} strokeLinecap="round" x1="108.213" y1="57.3553" x2="61.5442" y2="10.6863" />
        <line strokeWidth={20} strokeLinecap="round" x1="61.5442" y1="109.213" x2="108.213" y2="62.5442" />
      </svg>
    )
  }

  if (icon === 'pointer-rounded') {
    return (
      <svg style={style} viewBox="0 0 120 120" stroke={color}>
        <title>Pointer rounded icon</title>
        <line strokeWidth={20} strokeLinecap="round" x1="43.1421" y1="11" x2="91.2254" y2="59.0833" />
        <line strokeWidth={20} strokeLinecap="round" x1="91.2254" y1="60.1421" x2="43.1421" y2="108.225" />
      </svg>
    )
  }

  if (icon === 'arrow') {
    return (
      <svg style={style} viewBox="0 0 120 120" stroke={color}>
        <title>Arrow icon</title>
        <line strokeWidth={20} x1="0" y1="60" x2="120" y2="60" />
        <line strokeWidth={20} x1="62.9289" y1="112.929" x2="113.284" y2="62.5736" />
        <line strokeWidth={20} x1="113.284" y1="57.4264" x2="62.929" y2="7.07109" />
      </svg>
    )
  }

  return (
    <svg style={style} viewBox="0 0 120 120" stroke={color}>
      <title>Basic pointer icon</title>
      <line strokeWidth={20} x1="37.0711" y1="6.92893" x2="96.8923" y2="66.7502" />
      <line strokeWidth={20} x1="96.468" y1="53.0711" x2="37.0711" y2="112.468" />
    </svg>
  )
}

export const getArrowPosition = (arrow: Partial<ArrowProps>) => {
  const position = arrow.position ?? 'center'

  if (position === 'center') {
    return position
  }

  return `flex-${position}`
}
