<p align="center">
  <img src="https://github.com/tobua/overflow-scroll-fade/raw/main/logo.png" alt="overflow-scroll-fade" width="300">
</p>

# overflow-scroll-fade

Add a gradient-based dynamic fade effect to elements with scrollable overflow.

- React JSX based
- Requires the [ScrollTimeline](https://caniuse.com/mdn-api_scrolltimeline) API
  - Works in Chrome, Edge and Opera
- Works with either horizontal or vertical overflow

> [!NOTE]  
> This library is a much simpler successor to [indicate](https://github.com/tobua/indicate) which has less restrictions and more features but uses older and more performance intensive techniques.

## Usage

```tsx
import { Scroll } from 'overflow-scroll-fade'

const MyScroll = () => (
  <Scroll direction="horizontal">
    <p>overflow-scroll-fade</p>
    <p>overflow-scroll-fade</p>
  </Scroll>
)
```
