import { useEffect, useState, type CSSProperties } from 'react'
import { createRoot } from 'react-dom/client'
import { highlight } from 'sugar-high'
import { scale } from 'optica'
import { Scroll } from 'overflow-scroll-fade'
import { Configuration } from './Configuration'
import logo from './logo.png'

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

const checkeredBackground = (color: string): CSSProperties => ({
  backgroundImage: `linear-gradient(45deg, ${color} 25%, transparent 25%), linear-gradient(-45deg, ${color} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${color} 75%), linear-gradient(-45deg, transparent 75%, ${color} 75%)`,
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
})

const headingStyles = (as: 'h1' | 'h2' | 'h3'): CSSProperties => ({
  margin: 0,
  fontSize: as === 'h1' ? scale(36) : scale(24),
})

function Heading({
  as = 'h1',
  style,
  ...props
}: JSX.IntrinsicElements['h1' | 'h2' | 'h3'] & { as?: 'h1' | 'h2' | 'h3' }) {
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
    <Scroll>
      <div
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          padding: scale(20),
          background: Color.blue.ultralight,
          borderRadius: scale(20),
          fontFamily: 'monospace',
          whiteSpace: 'pre',
          fontSize: scale(16),
          lineHeight: scale(22),
        }}
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

function App() {
  const [frame, setFrame] = useState(0)

  colorIndex = 0

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prevFrame) => prevFrame + 1)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

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
      <img
        style={{ maxWidth: scale(400), width: '100%', alignSelf: 'center' }}
        src={logo}
        alt="masua Logo"
      />
      <Heading>overflow-scroll-fade</Heading>
      <Paragraph>
        Add a gradient-based dynamic fade effect to elements with scrollable overflow.
      </Paragraph>
      <Heading as="h2">Usage</Heading>
      <Code>{`import { Scroll } from 'overflow-scroll-fade'

const MyGrid = () => (
  <Scroll>
    <p>overflow-scroll-fade</p>
    <p>overflow-scroll-fade</p>
  </Scroll>
)`}</Code>
      <Heading as="h2">Examples</Heading>
      <Scroll style={{ maxWidth: 360 }} overflowStyle={{ gap: scale(10) }}>
        <Box />
        <Box />
        <Box />
        <Box />
        <Box />
        <Box />
      </Scroll>
      <Heading as="h3">Vertical</Heading>
      <Scroll
        style={{ maxHeight: 160 }}
        direction="vertical"
        overflowStyle={{ gap: scale(10), flexDirection: 'column' }}
      >
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
        <Scroll style={{}} color="lightgray" overflowStyle={{ gap: scale(10) }}>
          <Box />
          <Box />
          <Box />
          <Box />
          <Box />
          <Box />
        </Scroll>
      </div>
      <Heading as="h3">No overflow</Heading>
      <Scroll style={{ alignSelf: 'flex-start' }} overflowStyle={{ gap: scale(10) }}>
        <Box />
        <Box />
      </Scroll>
      <Heading as="h3">Dynamic Content Size</Heading>
      <Scroll style={{ maxWidth: 360 }} overflowStyle={{ gap: scale(10) }}>
        <Box />
        <Box />
        <div style={{ display: frame % 2 === 1 ? 'flex' : 'none', gap: scale(10) }}>
          <Box />
          <Box />
          <Box />
          <Box />
        </div>
      </Scroll>
      <Scroll style={{ maxWidth: 360 }} overflowStyle={{ gap: scale(10) }}>
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
      </Scroll>
      <Heading as="h2">Configuration</Heading>
      <Configuration />
      <Heading as="h2">How does it work?</Heading>
      <Paragraph>
        In order to achieve this effect the plugin will add two wrapper elements around the
        children. The outer one is a relatively positioned container that is used to position the
        fades. The inner one holds the overflow and is scrollable. To avoid adding another wrapper
        and because they need to reference the scroll element the fade elements are positioned on
        the same level as the children. When there is no overflow no fade elements will be rendered.
        In browsers where scroll-timeline isn't supported only the inner scroll element will be
        rendered with the children inside. In this case when custom styles for{' '}
        <InlineCode>style</InlineCode> or <InlineCode>overflowStyle</InlineCode> will be merged onto
        the scroll element.
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
      <Heading as="h2">Development Playground</Heading>
      <Scroll style={{ maxWidth: 300 }} overflowStyle={{ gap: scale(10) }}>
        <div
          style={{
            width: 1000,
            height: 50,
            ...checkeredBackground(Color.boxes[0]),
            flex: '0 0 auto',
          }}
        />
      </Scroll>
      <Scroll direction="vertical" style={{ maxHeight: 100 }} overflowStyle={{ gap: scale(20) }}>
        <div
          style={{
            width: 200,
            height: 300,
            ...checkeredBackground(Color.boxes[1]),
            flex: '0 0 auto',
          }}
        />
      </Scroll>
    </div>
  )
}

createRoot(document.body as HTMLElement).render(<App />)
