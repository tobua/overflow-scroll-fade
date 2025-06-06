import { scale } from 'optica'
import type { CSSProperties } from 'react'
import { Color } from './style'

const wrapperStyles: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto auto auto auto',
  gap: scale(10),
  fontSize: scale(18),
  alignItems: 'center',
  background: Color.blue.ultralight,
  padding: scale(20),
  borderRadius: scale(20),
}

const headerStyles: CSSProperties = { fontWeight: 'bold' }

const Header = ({ children }: { children: string }) => <span style={headerStyles}>{children}</span>

const valueStyles: CSSProperties = { fontFamily: 'monospace', fontSize: scale(16) }

const Code = ({ children }: { children: string }) => <span style={valueStyles}>{children}</span>

export function Configuration() {
  return (
    <div style={wrapperStyles}>
      <Header>Property</Header>
      <Header>Default value</Header>
      <Header>Type</Header>
      <Header>Description</Header>
      <span>color</span>
      <Code>#FFF</Code>
      <Code>string</Code>
      <span>Color of the fade effect.</span>
      <span>arrow</span>
      <Code>false</Code>
      <Code>{'boolean | {}'}</Code>
      <span>Enable the arrow, see detailed configuration below.</span>
      <span>children</span>
      <span>required</span>
      <Code>ReactNode</Code>
      <span>Contents that might potentially overflow their container.</span>
      <span>style</span>
      <span>empty</span>
      <Code>CSSProperties</Code>
      <span>Styles applied to the container.</span>
      <span>overflowStyle</span>
      <span>empty</span>
      <Code>CSSProperties</Code>
      <span>Styles applied to the scrollable element.</span>
      <span>indicatorStyle</span>
      <span>empty</span>
      <Code>CSSProperties</Code>
      <span>Styles added to the overflow indicators.</span>
      <span>fallbackStyle</span>
      <span>empty</span>
      <Code>CSSProperties</Code>
      <span>Styles added to the container when scroll timeline isn't supported.</span>
      <span>as</span>
      <Code>'div'</Code>
      <Code>ElementType</Code>
      <span>Tag used for the container.</span>
      <span>...props</span>
      <span>empty</span>
      <Code>JSX.IntrinsicElements['div']</Code>
      <span>Arbitrary props passed on to the container.</span>
    </div>
  )
}

export function ArrowConfiguration() {
  return (
    <div style={wrapperStyles}>
      <Header>Property</Header>
      <Header>Default value</Header>
      <Header>Type</Header>
      <Header>Description</Header>
      <span>position</span>
      <Code>'center'</Code>
      <Code>'center' | 'end' | 'start'</Code>
      <span>Position of the arrow on the fade.</span>
      <span>icon</span>
      <Code>'arrow-rounded'</Code>
      <Code>'arrow-rounded' | 'pointer-rounded' | 'arrow' | 'pointer'</Code>
      <span>SVG icon to use for the arrow.</span>
      <span>color</span>
      <Code>'#000000'</Code>
      <Code>string</Code>
      <span>Color used for the arrow.</span>
    </div>
  )
}
