# @thibault.sh/hooks

A collection of performant React hooks for common use cases. Built with TypeScript.

## Installation

```bash
npm install @thibaultsh/hooks
```

## Features

### State Management
- [`useLocalStorageState`](https://thibault.sh/hooks/use-local-storage-state) - Persist state in localStorage
- [`useSessionStorageState`](https://thibault.sh/hooks/use-session-storage-state) - Session storage state management
- [`useCookieState`](https://thibault.sh/hooks/use-cookie-state) - Cookie state management
- [`useQueryParamsState`](https://thibault.sh/hooks/use-query-params-state) - URL query parameters state

### UI/Interaction
- [`useClickOutside`](https://thibault.sh/hooks/use-click-outside) - Detect clicks outside elements
- [`useHover`](https://thibault.sh/hooks/use-hover) - Track element hover state
- [`useKeyPress`](https://thibault.sh/hooks/use-key-press) - Keyboard input handling
- [`useKeyCombo`](https://thibault.sh/hooks/use-key-combo) - Keyboard shortcuts
- [`useLongPress`](https://thibault.sh/hooks/use-long-press) - Long press detection

### Layout/Viewport
- [`useMediaQuery`](https://thibault.sh/hooks/use-media-query) - Responsive design helper
- [`useWindowSize`](https://thibault.sh/hooks/use-window-size) - Window dimensions tracking
- [`useScrollPosition`](https://thibault.sh/hooks/use-scroll-position) - Scroll position tracking
- [`useContainerScroll`](https://thibault.sh/hooks/use-container-scroll) - Container scroll management
- [`useElementSize`](https://thibault.sh/hooks/use-element-size) - Element size observer
- [`useIntersectionObserver`](https://thibault.sh/hooks/use-intersection-observer) - Viewport intersection
- [`useResizeObserver`](https://thibault.sh/hooks/use-resize-observer) - Element resize detection

### Utility
- [`useAsync`](https://thibault.sh/hooks/use-async) - Async operation wrapper
- [`useCountdown`](https://thibault.sh/hooks/use-countdown) - Countdown timer to target date
- [`useDebounce`](https://thibault.sh/hooks/use-debounce) - Value debouncing
- [`useThrottle`](https://thibault.sh/hooks/use-throttle) - Action throttling
- [`useInterval`](https://thibault.sh/hooks/use-interval) - Interval handling
- [`useEventListener`](https://thibault.sh/hooks/use-event-listener) - Event subscription

## Usage

```tsx
import { useLocalStorageState, useMediaQuery } from '@thibault.sh/hooks';

function App() {
  const [theme, setTheme] = useLocalStorageState<'light' | 'dark'>('theme', 'light');
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button>
      {isMobile && <div>Mobile view</div>}
    </div>
  );
}
```

## Documentation

For detailed documentation, visit [thibault.sh/hooks](https://thibault.sh/hooks)

## License

MIT © [Thibault Mathian](https://thibault.sh)