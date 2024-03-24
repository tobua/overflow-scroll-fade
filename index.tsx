import { useRef, useState, useEffect, type CSSProperties } from 'react'

type Direction = 'top' | 'right' | 'bottom' | 'left'

const wrapperStyles: CSSProperties = {
  position: 'relative',
}

const overflowStyles = (direction: 'horizontal' | 'vertical'): CSSProperties => ({
  display: 'flex',
  overflow: 'auto',
  height: direction === 'vertical' ? '100%' : 'auto',
  scrollTimelineName: '--indicate-scroll-element',
  scrollTimelineAxis: direction === 'horizontal' ? 'x' : 'y',
})

const fadeStyles = (direction: Direction, horizontal: boolean, color: string): CSSProperties => ({
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
})

const keyframes = `@keyframes indicate-top {
  20% { opacity: 1; }
  100% { opacity: 1; }
}
@keyframes indicate-right {
  80% { opacity: 1; }
  100% { opacity: 0; }
}
@keyframes indicate-bottom {
  80% { opacity: 1; }
  100% { opacity: 0; }
}
@keyframes indicate-left {
  20% { opacity: 1; }
  100% { opacity: 1; }
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

function Fade({
  direction,
  style,
  color,
}: {
  direction: Direction
  style?: CSSProperties
  color: string
}) {
  const horizontal = direction === 'left' || direction === 'right'

  return (
    <button
      aria-label={`Scroll to ${direction}`}
      type="button"
      style={{
        ...fadeStyles(direction, horizontal, color),
        ...style,
      }}
      onClick={(event) => {
        const element = event.target as HTMLButtonElement
        const container = element.parentElement as HTMLDivElement
        container.scrollTo({
          behavior: 'smooth',
          ...scrollByDirection[direction](container),
        })
      }}
    />
  )
}

export function Scroll({
  direction = 'horizontal',
  color = '#FFF',
  style,
  overflowStyle,
  indicatorStyle,
  children,
  ...props
}: JSX.IntrinsicElements['div'] & {
  direction?: 'horizontal' | 'vertical'
  color?: string
  overflowStyle?: CSSProperties
  indicatorStyle?: CSSProperties
}) {
  const [hasOverflow, setHasOverflow] = useState(false)
  const scrollRef = useRef<HTMLDivElement>()

  useEffect(() => {
    const element = scrollRef.current
    if (element) {
      if (direction === 'horizontal') {
        setHasOverflow(element.scrollWidth > element.clientWidth)
      } else {
        setHasOverflow(element.scrollHeight > element.clientHeight)
      }
    }
  }, [])

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
              <Fade style={indicatorStyle} color={color} direction="top" />
            )}
            {direction === 'horizontal' && (
              <Fade style={indicatorStyle} color={color} direction="right" />
            )}
            {direction === 'vertical' && (
              <Fade style={indicatorStyle} color={color} direction="bottom" />
            )}
            {direction === 'horizontal' && (
              <Fade style={indicatorStyle} color={color} direction="left" />
            )}
          </>
        )}
      </div>
    </div>
  )
}
