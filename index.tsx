import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Arrow, type ArrowProps, defaultArrowProps, getArrowPosition } from './arrow'
import type { FadeDirection, Props, ScrollDirection } from './types'

// @ts-ignore Non-Standard API
const supportsScrollTimeline = 'scrollTimeline' in document.documentElement.style && typeof ScrollTimeline !== 'undefined'

const wrapperStyles: React.CSSProperties = {
  position: 'relative',
}

const overflowStyles = (_direction?: ScrollDirection): React.CSSProperties => ({
  display: 'flex',
  overflow: 'auto',
  height: '100%',
})

const fadeStyles = (direction: FadeDirection, horizontal: boolean, color: string): React.CSSProperties => ({
  display: 'flex',
  position: 'absolute',
  outline: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  height: horizontal ? '100%' : 20,
  width: horizontal ? 20 : '100%',
  background: `linear-gradient(to ${direction}, rgba(255, 255, 255, 0), ${color})`,
  left: direction === 'left' ? 0 : 'auto',
  right: direction === 'right' ? 0 : 'auto',
  top: direction === 'top' ? 0 : 'auto',
  bottom: direction === 'bottom' ? 0 : 'auto',
  opacity: direction === 'left' || direction === 'top' ? 0 : 1,
  visibility: direction === 'left' || direction === 'top' ? 'hidden' : 'visible',
})

function setScrollTimelineAnimation(element: HTMLDivElement, fade: HTMLButtonElement, direction: FadeDirection) {
  const isHorizontal = direction === 'left' || direction === 'right'
  const values = {
    visible: isHorizontal ? element.clientWidth : element.clientHeight,
    full: isHorizontal ? element.scrollWidth : element.scrollHeight,
  }
  const visiblePercentage = 0.2 * (values.visible / values.full) // 20% of visible size for fade animation.

  // @ts-ignore Non-Standard API
  const scrollTimeline = new ScrollTimeline({
    source: element,
    axis: direction === 'left' || direction === 'right' ? 'inline' : 'block',
  })

  const start = direction === 'left' || direction === 'top'
  fade.animate(
    {
      opacity: start ? [0, 1, 1] : [1, 1, 0],
      visibility: start ? ['hidden', 'visible', 'visible'] : ['visible', 'visible', 'hidden'],
      offset: start ? [0, visiblePercentage, 1] : [0, 1 - visiblePercentage, 1],
    },
    {
      timeline: scrollTimeline,
      fill: 'both',
    },
  )
}

const scrollByDirection = {
  top: (container: HTMLDivElement) => ({
    top: container.scrollTop - container.scrollHeight * 0.2,
  }),
  right: (container: HTMLDivElement) => ({
    left: container.scrollLeft + container.scrollWidth * 0.2,
  }),
  bottom: (container: HTMLDivElement) => ({
    top: container.scrollTop + container.scrollHeight * 0.2,
  }),
  left: (container: HTMLDivElement) => ({
    left: container.scrollLeft - container.scrollWidth * 0.2,
  }),
}

function checkOverflow(
  element: HTMLDivElement,
  overflowDirections: { horizontal: boolean; vertical: boolean },
  setOverflowDirections: React.Dispatch<React.SetStateAction<{ horizontal: boolean; vertical: boolean }>>,
) {
  const directions = { horizontal: false, vertical: false }
  if (element) {
    directions.horizontal = element.scrollWidth > element.clientWidth
    directions.vertical = element.scrollHeight > element.clientHeight

    if (JSON.stringify(directions) !== JSON.stringify(overflowDirections)) {
      setOverflowDirections(directions)
    }
  }
}

function getUserNodes(element: HTMLDivElement) {
  let nodes = Array.from(element.childNodes) as Element[]

  // Remove our absolutely positioned elements added to show overflow.
  if (nodes.slice(-1)[0]?.tagName === 'BUTTON' && nodes.slice(-2)[0]?.tagName === 'BUTTON' && nodes.slice(-3)[0]?.tagName === 'STYLE') {
    nodes = nodes.slice(0, -3)
  }

  return nodes
}

function Fallback<T extends keyof React.JSX.IntrinsicElements = 'div'>({
  children,
  overflowStyle,
  style,
  fallbackStyle,
  as: Component = 'div' as T,
  ...props
}: Props<T>) {
  const styles = { display: 'flex', overflow: 'auto' }

  if (fallbackStyle) {
    Object.assign(styles, fallbackStyle)
  } else {
    Object.assign(styles, overflowStyle)
    Object.assign(styles, style)
  }

  return (
    // @ts-ignore only types from 'div' inferred for some reason.
    <Component style={styles} {...props}>
      {children}
    </Component>
  )
}

function Fade({
  direction,
  style,
  color,
  arrow,
  ref,
  element,
}: {
  direction: FadeDirection
  style?: React.CSSProperties
  color: string
  arrow: ArrowProps | boolean
  ref: React.RefObject<HTMLButtonElement | null>
  element: HTMLDivElement | null
}) {
  const horizontal = direction === 'left' || direction === 'right'
  const arrowConfiguration = typeof arrow === 'object' ? arrow : defaultArrowProps

  useEffect(() => {
    if (element && ref.current) {
      setScrollTimelineAnimation(element, ref.current, direction)
    }
  }, [ref, direction, element])

  return (
    <button
      ref={ref}
      aria-label={`Scroll to ${direction}`}
      type="button"
      style={{
        ...fadeStyles(direction, horizontal, color),
        ...style,
        alignItems: getArrowPosition(arrowConfiguration),
        justifyContent: getArrowPosition(arrowConfiguration),
      }}
      onClick={(event) => {
        const element = event.target as HTMLButtonElement
        const container = element.parentElement as HTMLDivElement
        container.scrollTo({
          behavior: 'smooth',
          ...scrollByDirection[direction](container),
        })
      }}
    >
      {arrow && <Arrow direction={direction} {...arrowConfiguration} />}
    </button>
  )
}

export function Scroll<T extends keyof React.JSX.IntrinsicElements = 'div'>({
  color = '#FFF',
  style = {},
  overflowStyle = {},
  indicatorStyle = {},
  fallbackStyle,
  children,
  arrow = false,
  as: Component = 'div' as T,
  ...props
}: Props<T>) {
  const [overflowDirections, setOverflowDirections] = useState({ horizontal: false, vertical: false })
  const scrollRef = useRef<HTMLDivElement>(null)
  const fadeTopRef = useRef<HTMLButtonElement>(null)
  const fadeRightRef = useRef<HTMLButtonElement>(null)
  const fadeBottomRef = useRef<HTMLButtonElement>(null)
  const fadeLeftRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const element = scrollRef.current
    if (!(supportsScrollTimeline && element)) {
      return
    }

    const userNodes = getUserNodes(element)

    checkOverflow(element, overflowDirections, setOverflowDirections)

    const resizeObserver = new ResizeObserver(() => {
      checkOverflow(element, overflowDirections, setOverflowDirections)
    })

    const observer = new MutationObserver(() => {
      checkOverflow(element, overflowDirections, setOverflowDirections)
    })

    // Observe if more children are rendered.
    observer.observe(element, { childList: true, subtree: true })

    // Observe if any of the children change their size.
    if (userNodes.length > 0) {
      for (const node of userNodes) {
        resizeObserver.observe(node)
      }
    }

    return () => {
      if (element) {
        resizeObserver.unobserve(element)
      }
    }
  }, [overflowDirections])

  if (!supportsScrollTimeline) {
    return (
      <Fallback style={style} overflowStyle={overflowStyle} fallbackStyle={fallbackStyle} as={Component} {...props}>
        {children}
      </Fallback>
    )
  }

  return (
    // @ts-ignore only types from 'div' inferred for some reason.
    <Component {...props} style={{ ...wrapperStyles, ...style }}>
      <div
        ref={scrollRef}
        style={{
          ...overflowStyles(),
          ...overflowStyle,
        }}
      >
        {children}
        {overflowDirections.vertical && (
          <>
            <Fade ref={fadeTopRef} element={scrollRef.current} style={indicatorStyle} color={color} direction="top" arrow={arrow} />
            <Fade ref={fadeBottomRef} element={scrollRef.current} style={indicatorStyle} color={color} direction="bottom" arrow={arrow} />
          </>
        )}
        {overflowDirections.horizontal && (
          <>
            <Fade ref={fadeRightRef} element={scrollRef.current} style={indicatorStyle} color={color} direction="right" arrow={arrow} />
            <Fade ref={fadeLeftRef} element={scrollRef.current} style={indicatorStyle} color={color} direction="left" arrow={arrow} />
          </>
        )}
      </div>
    </Component>
  )
}
