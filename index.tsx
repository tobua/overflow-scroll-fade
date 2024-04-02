import {
  useRef,
  useState,
  useEffect,
  type CSSProperties,
  SetStateAction,
  Dispatch,
  ReactNode,
} from 'react'
import { FadeDirection, ScrollDirection } from './types'
import { Arrow, ArrowProps, defaultArrowProps, getArrowPosition } from './arrow'

type Props = JSX.IntrinsicElements['div'] & {
  direction?: ScrollDirection
  color?: string
  overflowStyle?: CSSProperties
  indicatorStyle?: CSSProperties
  fallbackStyle?: CSSProperties
}

const supportsScrollTimeline = 'scrollTimeline' in document.documentElement.style

const wrapperStyles: CSSProperties = {
  position: 'relative',
}

const overflowStyles = (direction: ScrollDirection): CSSProperties => ({
  display: 'flex',
  overflow: 'auto',
  height: direction === 'vertical' ? '100%' : 'auto',
  scrollTimelineName: '--indicate-scroll-element',
  scrollTimelineAxis: direction === 'horizontal' ? 'x' : 'y',
})

const fadeStyles = (
  direction: FadeDirection,
  horizontal: boolean,
  color: string,
): CSSProperties => ({
  display: 'flex',
  position: 'absolute',
  outline: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  height: horizontal ? '100%' : 20,
  width: horizontal ? 20 : '100%',
  background: `linear-gradient(to ${direction}, rgba(255, 255, 255, 0), ${color})`,
  animationTimeline: '--indicate-scroll-element',
  animationTimingFunction: 'linear',
  animationFillMode: 'forwards',
  animationName: `indicate-${direction}`,
  left: direction === 'left' ? 0 : 'auto',
  right: direction === 'right' ? 0 : 'auto',
  top: direction === 'top' ? 0 : 'auto',
  bottom: direction === 'bottom' ? 0 : 'auto',
  opacity: direction === 'left' || direction === 'top' ? 0 : 1,
  visibility: direction === 'left' || direction === 'top' ? 'hidden' : 'visible',
})

const keyframes = `@keyframes indicate-top {
  20% { opacity: 1; visibility: visible; }
  100% { opacity: 1; visibility: visible; }
}
@keyframes indicate-right {
  80% { opacity: 1; visibility: visible; }
  100% { opacity: 0; visibility: hidden; }
}
@keyframes indicate-bottom {
  80% { opacity: 1; visibility: visible; }
  100% { opacity: 0; visibility: hidden; }
}
@keyframes indicate-left {
  20% { opacity: 1; visibility: visible; }
  100% { opacity: 1; visibility: visible; }
}`

const scrollByDirection = {
  top: (container: HTMLDivElement) => ({ top: container.scrollTop - container.scrollHeight * 0.2 }),
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
  setHasOverflow: Dispatch<SetStateAction<boolean>>,
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
  if (
    nodes.at(-1).tagName === 'BUTTON' &&
    nodes.at(-2).tagName === 'BUTTON' &&
    nodes.at(-3).tagName === 'STYLE'
  ) {
    nodes = nodes.slice(0, -3)
  }
  return nodes
}

function Fallback({
  children,
  overflowStyle,
  style,
  fallbackStyle,
}: {
  children: ReactNode
  style: CSSProperties
  overflowStyle: CSSProperties
  fallbackStyle: CSSProperties
}) {
  const styles = { display: 'flex', overflow: 'auto' }

  if (fallbackStyle) {
    Object.assign(styles, fallbackStyle)
  } else {
    Object.assign(styles, overflowStyle)
    Object.assign(styles, style)
  }

  return <div style={styles}>{children}</div>
}

function Fade({
  direction,
  style,
  color,
  arrow,
}: {
  direction: FadeDirection
  style?: CSSProperties
  color: string
  arrow: ArrowProps | true
}) {
  const horizontal = direction === 'left' || direction === 'right'
  const arrowConfiguration = typeof arrow === 'object' ? arrow : defaultArrowProps

  return (
    <button
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

export function Scroll({
  direction = 'horizontal',
  color = '#FFF',
  style,
  overflowStyle,
  indicatorStyle,
  fallbackStyle,
  children,
  arrow,
  ...props
}: Props & { arrow?: ArrowProps | true }) {
  const [hasOverflow, setHasOverflow] = useState(false)
  const scrollRef = useRef<HTMLDivElement>()

  if (!supportsScrollTimeline) {
    return (
      <Fallback style={style} overflowStyle={overflowStyle} fallbackStyle={fallbackStyle}>
        {children}
      </Fallback>
    )
  }

  useEffect(() => {
    const element = scrollRef.current
    const userNodes = getUserNodes(element)

    checkOverflow(element, direction, hasOverflow, setHasOverflow)

    const resizeObserver = new ResizeObserver(() => {
      checkOverflow(element, direction, hasOverflow, setHasOverflow)
    })

    if (userNodes.length) {
      userNodes.forEach((node: Element) => resizeObserver.observe(node))
    }

    return () => {
      if (element) {
        resizeObserver.unobserve(element)
      }
    }
  }, [hasOverflow, children])

  return (
    <div {...props} style={{ ...wrapperStyles, ...style }}>
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
            <style>{keyframes}</style>
            {direction === 'vertical' && (
              <Fade style={indicatorStyle} color={color} direction="top" arrow={arrow} />
            )}
            {direction === 'horizontal' && (
              <Fade style={indicatorStyle} color={color} direction="right" arrow={arrow} />
            )}
            {direction === 'vertical' && (
              <Fade style={indicatorStyle} color={color} direction="bottom" arrow={arrow} />
            )}
            {direction === 'horizontal' && (
              <Fade style={indicatorStyle} color={color} direction="left" arrow={arrow} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
