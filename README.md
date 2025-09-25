# @thibault.sh/hooks

A collection of performant React hooks for common use cases. Built with TypeScript.

## Installation

```bash
npm install @thibaultsh/hooks
```

## Features

### State Management
- `useLocalStorageState` - Persist state in localStorage
- `useSessionStorageState` - Session storage state management
- `useCookieState` - Cookie state management
- `useQueryParamsState` - URL query parameters state

### UI/Interaction
- `useClickOutside` - Detect clicks outside elements
- `useHover` - Track element hover state
- `useKeyPress` - Keyboard input handling
- `useKeyCombo` - Keyboard shortcuts
- `useLongPress` - Long press detection

### Layout/Viewport
- `useMediaQuery` - Responsive design helper
- `useWindowSize` - Window dimensions tracking
- `useScrollPosition` - Scroll position tracking
- `useContainerScroll` - Container scroll management
- `useElementSize` - Element size observer
- `useIntersectionObserver` - Viewport intersection
- `useResizeObserver` - Element resize detection

### Utility
- `useAsync` - Async operation wrapper
- `useDebounce` - Value debouncing
- `useThrottle` - Action throttling
- `useInterval` - Interval handling
- `useEventListener` - Event subscription

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