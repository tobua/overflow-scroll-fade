<p align="center">
  <img src="https://github.com/tobua/overflow-scroll-fade/raw/main/logo.png" alt="overflow-scroll-fade" width="300">
</p>

# overflow-scroll-fade

Add a gradient-based dynamic fade effect to elements with scrollable overflow.

- ⚛️ React JSX based
- 🔄 Automatically detects and supports horizontal and vertical overflow.
- ❗ Requires the [ScrollTimeline](https://caniuse.com/mdn-api_scrolltimeline) API
  - Currently works in Chrome, Edge and Opera
- ⚠️ Published as TypeScript and JSX see [this post on 𝕏](https://twitter.com/matthiasgiger/status/1766443368567971946) for the reasoning

> [!NOTE]  
> This library is a much simpler successor to [indicate](https://github.com/tobua/indicate) which has less restrictions and more features but uses older and more performance intensive techniques.

## Usage

```tsx
import { Scroll } from 'overflow-scroll-fade'

const MyScroll = () => (
  <Scroll>
    <p>overflow-scroll-fade</p>
    <p>overflow-scroll-fade</p>
  </Scroll>
)
```
