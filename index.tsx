import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Arrow, type ArrowProps, defaultArrowProps, getArrowPosition } from './arrow'
import type { FadeDirection, Props, ScrollDirection } from './types'

const supportsScrollTimeline = 'scrollTimeline' in document.documentElement.style

const wrapperStyles: React.CSSProperties = {
  position: 'relative',
}

const overflowStyles = (direction: ScrollDirection): React.CSSProperties => ({
  display: 'flex',
  overflow: 'auto',
  height: direction === 'vertical' ? '100%' : 'auto',
  scrollTimelineName: '--indicate-scroll-element',
  scrollTimelineAxis: direction === 'horizontal' ? 'x' : 'y',
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

function setScrollTimelineAnimation(
  element: HTMLDivElement,
  fade: HTMLButtonElement,
  direction: FadeDirection,
  scrollDirection: ScrollDirection,
) {
  const scrollHeight = element.scrollHeight - element.clientHeight
  const scrollWidth = element.scrollWidth - element.clientWidth
  const horizontalPercentage = scrollWidth / element.clientWidth / 100
  const verticalPercentage = scrollHeight / element.clientHeight / 100

  const isHorizontal = direction === 'left' || direction === 'right'

  if (isHorizontal && (scrollWidth < 1 || horizontalPercentage === Number.POSITIVE_INFINITY)) {
    return
  }

  if (!isHorizontal && (scrollHeight < 1 || verticalPercentage === Number.POSITIVE_INFINITY)) {
    return
  }

  const scrollTimeline = new ScrollTimeline({
    source: element,
    axis: scrollDirection === 'horizontal' ? 'inline' : 'block',
  })

  const start = direction === 'left' || direction === 'top'
  fade.animate(
    {
      opacity: start ? [0, 0, 1] : [1, 1, 0],
      visibility: start ? ['hidden', 'visible', 'visible'] : ['visible', 'visible', 'hidden'],
      offset: start
        ? [0, direction === 'top' ? verticalPercentage : horizontalPercentage, 1]
        : [0, direction === 'bottom' ? 1 - verticalPercentage : 1 - horizontalPercentage, 1],
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
  direction: ScrollDirection,
  hasOverflow: boolean,
  setHasOverflow: React.Dispatch<React.SetStateAction<boolean>>,
) {
  if (element) {
    if (direction === 'horizontal') {
      const nextState = element.scrollWidth > element.clientWidth
      if (nextState !== hasOverflow) {
        setHasOverflow(nextState)
      }
    } else {
      const nextState = element.scrollHeight > element.clientHeight
      if (nextState !== hasOverflow) {
        setHasOverflow(nextState)
      }
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
  scrollDirection,
  style,
  color,
  arrow,
  ref,
  element,
}: {
  direction: FadeDirection
  scrollDirection: ScrollDirection
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
      setScrollTimelineAnimation(element, ref.current, direction, scrollDirection)
    }
  }, [ref, direction, scrollDirection, element])

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
  direction = 'horizontal',
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
  const [hasOverflow, setHasOverflow] = useState(false)
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

    checkOverflow(element, direction, hasOverflow, setHasOverflow)

    const resizeObserver = new ResizeObserver(() => {
      checkOverflow(element, direction, hasOverflow, setHasOverflow)
    })

    const observer = new MutationObserver(() => {
      checkOverflow(element, direction, hasOverflow, setHasOverflow)
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
  }, [hasOverflow, direction])

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
          ...overflowStyles(direction),
          ...overflowStyle,
        }}
      >
        {children}
        {hasOverflow && (
          <>
            {direction === 'vertical' && (
              <Fade
                ref={fadeTopRef}
                element={scrollRef.current}
                style={indicatorStyle}
                color={color}
                direction="top"
                scrollDirection={direction}
                arrow={arrow}
              />
            )}
            {direction === 'horizontal' && (
              <Fade
                ref={fadeRightRef}
                element={scrollRef.current}
                style={indicatorStyle}
                color={color}
                direction="right"
                scrollDirection={direction}
                arrow={arrow}
              />
            )}
            {direction === 'vertical' && (
              <Fade
                ref={fadeBottomRef}
                element={scrollRef.current}
                style={indicatorStyle}
                color={color}
                direction="bottom"
                scrollDirection={direction}
                arrow={arrow}
              />
            )}
            {direction === 'horizontal' && (
              <Fade
                ref={fadeLeftRef}
                element={scrollRef.current}
                style={indicatorStyle}
                color={color}
                direction="left"
                scrollDirection={direction}
                arrow={arrow}
              />
            )}
          </>
        )}
      </div>
    </Component>
  )
}
