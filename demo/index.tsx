import { scale } from 'optica'
import { Scroll } from 'overflow-scroll-fade'
import { type CSSProperties, type JSX, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { highlight } from 'sugar-high'
import logo from '../logo.png'
import { ArrowConfiguration, Configuration } from './ConfigurationTable'
import './types' // Declarations for png image.

document.body.style.display = 'flex'
document.body.style.justifyContent = 'center'
document.body.style.margin = '0'
document.body.style.padding = '5vmin'

const appStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'normal',
  width: '100%',
  fontFamily: 'sans-serif',
  maxWidth: 1000,
  justifyContent: 'space-between',
  gap: scale(20),
}

const Color = {
  blue: {
    ultralight: '#c3deff',
    light: '#77b5ff',
    regular: '#0075ff',
    dark: '#0075ff',
  },
  boxes: ['#0075ff', '#ff002e', '#00ba6c', '#eb00ff', '#ffb800', '#09d3c7'],
}

const headingStyles = (as: 'h1' | 'h2' | 'h3'): CSSProperties => ({
  margin: 0,
  fontSize: as === 'h1' ? scale(36) : scale(24),
})

function Heading({ as = 'h1', style, ...props }: JSX.IntrinsicElements['h1' | 'h2' | 'h3'] & { as?: 'h1' | 'h2' | 'h3' }) {
  const Component = as
  return <Component {...props} style={{ ...headingStyles(as), ...style }} />
}

const inlineCodeStyles: CSSProperties = {
  background: Color.blue.ultralight,
  borderRadius: scale(5),
  paddingLeft: scale(4),
  paddingRight: scale(4),
  paddingBottom: 2,
  paddingTop: 1,
  fontSize: scale(14),
  fontFamily: 'monospace',
}

function InlineCode({ style, ...props }: JSX.IntrinsicElements['span']) {
  return <span {...props} style={{ ...inlineCodeStyles, ...style }} />
}

const paragraphStyles: CSSProperties = {
  margin: 0,
  fontSize: scale(18),
  lineHeight: scale(24),
}

function Paragraph({ style, ...props }: JSX.IntrinsicElements['p']) {
  return <p {...props} style={{ ...paragraphStyles, ...style }} />
}

function Code({ children }: { children: string }) {
  return (
    <Scroll overflowStyle={{ borderRadius: scale(20) }}>
      <div
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          padding: scale(20),
          background: Color.blue.ultralight,
          fontFamily: 'monospace',
          whiteSpace: 'pre',
          fontSize: scale(16),
          lineHeight: scale(22),
        }}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Safe, as generated from static code on the client.
        dangerouslySetInnerHTML={{ __html: highlight(children) }}
      />
    </Scroll>
  )
}

let colorIndex = 0

const boxStyles = (size: number, sizeFactor = 40): CSSProperties => {
  const color = Color.boxes[colorIndex++ % 6]

  return {
    display: 'flex',
    width: scale(100),
    height: scale(size * sizeFactor),
    background: color,
    borderRadius: scale(10),
    flex: '0 0 auto', // TODO shouldn't be necessary.
    animation: 'fadeIn 300ms ease-in-out',
    opacity: 1,
  }
}

function Box({ size = 1 }) {
  return <div style={boxStyles(size)} />
}

function DynamicContent({ children }) {
  const [frame, setFrame] = useState(0)

  colorIndex = 0

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prevFrame) => prevFrame + 1)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return children(frame)
}

function animateHeight() {
  const element = document.getElementById('animated-box')
  const startHeight = element.offsetHeight
  let startTime = 0
  const increase = startHeight < 200
  const duration = 3000
  const targetHeight = increase ? 250 : 50

  function step(timestamp: DOMHighResTimeStamp) {
    if (!startTime) {
      startTime = timestamp
    }
    const progress = timestamp - startTime

    if (increase) {
      const nextHeight = startHeight + (targetHeight - startHeight) * (progress / duration)

      if (nextHeight > targetHeight) {
        return
      }
      element.style.height = `${Math.min(nextHeight, targetHeight)}px`
    } else {
      const nextHeight = startHeight - (startHeight - targetHeight) * (progress / duration)
      if (nextHeight < targetHeight) {
        return
      }
      element.style.height = `${Math.max(nextHeight, targetHeight)}px`
    }

    if (progress < duration) {
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}

const buttonStyles: CSSProperties = {
  display: 'flex',
  background: Color.boxes[1],
  borderRadius: scale(10),
  position: 'absolute',
  top: 0,
  right: 0,
  border: 'none',
  outline: 'none',
  color: 'white',
  cursor: 'pointer',
}

function AddMoreContent() {
  return (
    <>
      <button type="button" onClick={() => animateHeight()} style={buttonStyles}>
        Add More
      </button>
      <div id="animated-box" style={boxStyles(1)} />
    </>
  )
}

function App() {
  colorIndex = 0

  return (
    <div style={appStyles}>
      <style>{`.sh__line {
  min-height: ${scale(22)};
}

:root {
  --sh-class: #2d5e9d;
  --sh-identifier: #354150;
  --sh-sign: #8996a3;
  --sh-property: #0550ae;
  --sh-entity: #249a97;
  --sh-jsxliterals: #6266d1;
  --sh-string: #00a99a;
  --sh-keyword: #f47067;
  --sh-comment: #a19595;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}`}</style>
      <img style={{ maxWidth: scale(400), width: '100%', alignSelf: 'center' }} src={logo} alt="masua Logo" />
      <Heading>overflow-scroll-fade</Heading>
      <Paragraph>Add a gradient-based dynamic fade effect to elements with scrollable overflow.</Paragraph>
      <Heading as="h2">Usage</Heading>
      <Code>{`import { Scroll } from 'overflow-scroll-fade'

const MyGrid = () => (
  <Scroll>
    <p>overflow-scroll-fade</p>
    <p>overflow-scroll-fade</p>
  </Scroll>
)`}</Code>
      <Heading as="h2">Examples</Heading>
      <Heading as="h3">Vertical & Horizontal</Heading>
      <Scroll as="main" style={{ maxHeight: 150, maxWidth: 340 }} overflowStyle={{ gap: scale(10), flexDirection: 'column' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div style={{ display: 'flex', gap: scale(10) }} key={i}>
            {Array.from({ length: 6 }).map((_, j) => (
              <Box key={j} />
            ))}
          </div>
        ))}
      </Scroll>
      <Heading as="h3">Horizontal</Heading>
      <Scroll style={{ maxWidth: 340 }} overflowStyle={{ gap: scale(10) }}>
        <Box />
        <Box />
        <Box />
        <Box />
        <Box />
        <Box />
      </Scroll>
      <Heading as="h3">Vertical</Heading>
      <Scroll as="main" style={{ maxHeight: 150 }} overflowStyle={{ gap: scale(10), flexDirection: 'column' }}>
        <Box />
        <Box />
        <Box />
        <Box />
        <Box />
        <Box />
      </Scroll>
      <Heading as="h3">Color</Heading>
      <div
        style={{
          background: 'lightgray',
          padding: scale(20),
          borderRadius: scale(10),
          overflow: 'hidden',
          maxWidth: 300,
        }}
      >
        <Scroll color="lightgray" overflowStyle={{ gap: scale(10) }}>
          <Box />
          <Box />
          <Box />
          <Box />
          <Box />
          <Box />
        </Scroll>
      </div>
      <Heading as="h3">Arrow</Heading>
      <div style={{ display: 'flex', gap: scale(20), flexWrap: 'wrap' }}>
        <Scroll style={{ maxWidth: 180 }} arrow={true} overflowStyle={{ gap: scale(10) }}>
          <Box />
          <Box />
          <Box />
          <Box />
          <Box />
          <Box />
        </Scroll>
        <div
          style={{
            background: 'lightgray',
            overflow: 'hidden',
            maxWidth: 180,
          }}
        >
          <Scroll
            color="lightgray"
            arrow={{ position: 'start', icon: 'pointer-rounded', color: 'white' }}
            overflowStyle={{ gap: scale(10) }}
          >
            <Box />
            <Box />
            <Box />
            <Box />
            <Box />
            <Box />
          </Scroll>
        </div>
      </div>
      <Heading as="h3">No overflow</Heading>
      <Scroll style={{ alignSelf: 'flex-start' }} overflowStyle={{ gap: scale(10) }}>
        <Box />
        <Box />
      </Scroll>
      <Heading as="h3">Tons of overflow</Heading>
      <Paragraph>Fade in takes a long time to appear.</Paragraph>
      <Scroll overflowStyle={{ gap: scale(10) }}>
        {Array.from({ length: 200 }).map((_, i) => (
          <Box key={i} />
        ))}
      </Scroll>
      <Heading as="h3">Dynamic Content Size</Heading>
      <Scroll style={{ maxWidth: 340 }} overflowStyle={{ gap: scale(10) }}>
        <DynamicContent>
          {(frame: number) => (
            <>
              <Box />
              <Box />
              <div style={{ display: frame % 2 === 1 ? 'flex' : 'none', gap: scale(10) }}>
                <Box />
                <Box />
                <Box />
                <Box />
              </div>
            </>
          )}
        </DynamicContent>
      </Scroll>
      <Scroll style={{ maxWidth: 340 }} overflowStyle={{ gap: scale(10) }}>
        <DynamicContent>
          {(frame: number) => (
            <>
              <Box />
              <Box />
              {frame % 2 === 1 && (
                <>
                  <Box />
                  <Box />
                  <Box />
                  <Box />
                </>
              )}
            </>
          )}
        </DynamicContent>
      </Scroll>
      <Scroll style={{ maxWidth: 340 }}>
        <DynamicContent>
          {(frame: number) => (
            <div style={{ display: 'flex', gap: scale(10) }}>
              <Box />
              <Box />
              <div style={{ display: 'flex', gap: scale(10) }}>
                {frame % 2 === 1 && (
                  <>
                    <Box />
                    <Box />
                    <Box />
                    <Box />
                  </>
                )}
              </div>
            </div>
          )}
        </DynamicContent>
      </Scroll>
      <Heading as="h3">Dynamic Vertical Content Size</Heading>
      <Scroll style={{ height: 200 }} overflowStyle={{ gap: scale(10), flexDirection: 'column' }}>
        <AddMoreContent />
      </Scroll>
      <Heading as="h2">Configuration</Heading>
      <Configuration />
      <Heading as="h3">Arrow Configuration</Heading>
      <ArrowConfiguration />
      <Heading as="h2">How does it work?</Heading>
      <Paragraph>
        In order to achieve this effect the plugin will add two wrapper elements around the children. The outer one is a relatively
        positioned container that is used to position the fades. The inner one holds the overflow and is scrollable. To avoid adding another
        wrapper and because they need to reference the scroll element the fade elements are positioned on the same level as the children.
        When there is no overflow no fade elements will be rendered. In browsers where scroll-timeline isn't supported only the inner scroll
        element will be rendered with the children inside. In this case when custom styles for <InlineCode>style</InlineCode> or{' '}
        <InlineCode>overflowStyle</InlineCode> will be merged onto the scroll element.
      </Paragraph>
      <Code>{`import { Scroll } from 'overflow-scroll-fade'

const MyGrid = (
  <Scroll>
    <p>first-child</p>
    <p>second-child</p>
  </Scroll>
)

const ResultingStructure = () => (
  <div style={{ position: 'relative' }}>
    <div>
      <p>first-child</p>
      <p>second-child</p>
      <button aria-label="Scroll to left" style={{ position: 'absolute', left: 0 }} />
      <button aria-label="Scroll to right" style={{ position: 'absolute', right: 0 }} />
    </div>
  </div>
)`}</Code>
    </div>
  )
}

createRoot(document.body as HTMLElement).render(<App />)
