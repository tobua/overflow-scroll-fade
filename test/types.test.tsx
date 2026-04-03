import './setup-dom'
import { expect, test } from 'bun:test'
import { Scroll } from 'overflow-scroll-fade'

test('Returns correct clamp function values.', () => {
  expect(<Scroll style={{ maxWidth: 180 }} arrow={true} overflowStyle={{ gap: 10 }} />).toBeDefined()
  expect(
    <Scroll>
      <p>1</p>
      <p>2</p>
    </Scroll>,
  ).toBeDefined()
})
