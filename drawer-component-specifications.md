# 📋 Drawer Component API Specifications

## 🔧 **Component Interfaces**

### DrawerMenu (Main Component)
```typescript
interface DrawerMenuProps {
  /** Controls drawer open/closed state */
  isOpen: boolean;
  
  /** Callback when drawer should close */
  onClose: () => void;
  
  /** Current pathname for active nav state */
  currentPath: string;
  
  /** Optional className for custom styling */
  className?: string;
  
  /** Optional custom width override */
  width?: number;
}

interface DrawerMenuRef {
  /** Programmatically close the drawer */
  close: () => void;
  
  /** Focus the close button */
  focus: () => void;
}
```

### DrawerNavigation (Navigation Items)
```typescript
interface DrawerNavigationProps {
  /** Current active path */
  currentPath: string;
  
  /** Callback when navigation occurs */
  onNavigate: (href: string) => void;
  
  /** Navigation items to render */
  items: NavigationItem[];
  
  /** Animation delay offset */
  startDelay?: number;
}

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  badge?: string | number;
}
```

### DrawerActions (Action Buttons)
```typescript
interface DrawerActionsProps {
  /** Animation delay offset */
  startDelay?: number;
  
  /** Custom resume download URL */
  resumeUrl?: string;
  
  /** Loading state callback */
  onDownloadStart?: () => void;
  
  /** Success callback */
  onDownloadSuccess?: () => void;
  
  /** Error callback */
  onDownloadError?: (error: Error) => void;
}
```

### DrawerFooter (Brand Footer)
```typescript
interface DrawerFooterProps {
  /** Animation delay offset */
  startDelay?: number;
  
  /** Show social links */
  showSocials?: boolean;
  
  /** Custom copyright text */
  copyrightText?: string;
  
  /** Custom brand name */
  brandName?: string;
}
```

## 🎨 **Styling Specifications**

### CSS Custom Properties
```css
:root {
  /* Drawer Dimensions */
  --drawer-max-width: 400px;
  --drawer-header-height: 60px;
  --drawer-footer-height: 40px;
  --drawer-nav-item-height: 56px;
  --drawer-action-height: 60px;
  
  /* Animation Durations */
  --drawer-open-duration: 300ms;
  --drawer-close-duration: 250ms;
  --drawer-backdrop-duration: 200ms;
  --drawer-stagger-delay: 50ms;
  
  /* Z-Index Layers */
  --drawer-backdrop-z: 40;
  --drawer-panel-z: 50;
  
  /* Colors (matching theme) */
  --drawer-bg: rgba(255, 255, 255, 0.08);
  --drawer-bg-dark: rgba(0, 0, 0, 0.12);
  --drawer-border: rgba(255, 255, 255, 0.1);
  --drawer-border-dark: rgba(255, 255, 255, 0.05);
  --drawer-backdrop: rgba(0, 0, 0, 0.6);
}
```

### Responsive Classes
```css
/* Mobile First Approach */
.drawer-panel {
  @apply w-full h-full;
}

/* Tablet & Desktop */
@media (min-width: 768px) {
  .drawer-panel {
    @apply w-[400px] max-w-[90vw] h-full;
  }
}

/* Large Screens */
@media (min-width: 1024px) {
  .drawer-panel {
    @apply w-[400px] max-w-[30vw];
  }
}
```

## 🔄 **State Management**

### useDrawer Hook
```typescript
interface DrawerState {
  isOpen: boolean;
  isAnimating: boolean;
  isClosing: boolean;
}

interface DrawerActions {
  open: () => void;
  close: () => void;
  toggle: () => void;
  setAnimating: (animating: boolean) => void;
}

interface DrawerConfig {
  closeOnRouteChange: boolean;
  closeOnOutsideClick: boolean;
  closeOnEscape: boolean;
  enableSwipeGestures: boolean;
  lockBodyScroll: boolean;
}

function useDrawer(config: Partial<DrawerConfig> = {}): DrawerState & DrawerActions {
  // Implementation manages:
  // - Animation states
  // - Body scroll locking
  // - Keyboard event listeners
  // - Route change detection
  // - Touch gesture handling
}
```

### Global State Integration
```typescript
// Optional: Redux/Zustand integration
interface AppState {
  drawer: {
    isOpen: boolean;
    lastOpenedAt: number;
    userPreferences: {
      animationSpeed: 'fast' | 'normal' | 'slow';
      closeOnNavigation: boolean;
    };
  };
}

// Actions
const drawerSlice = {
  openDrawer: () => void,
  closeDrawer: () => void,
  setPreferences: (prefs: UserPreferences) => void,
};
```

## 🎯 **Animation System**

### Framer Motion Variants
```typescript
// Main drawer panel animation
export const drawerVariants: Variants = {
  closed: {
    x: '100%',
    transition: {
      type: 'tween',
      duration: 0.25,
      ease: [0.4, 0, 0.6, 1], // Ease-in
    },
  },
  open: {
    x: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 200,
      mass: 0.8,
    },
  },
};

// Backdrop/overlay animation
export const overlayVariants: Variants = {
  closed: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
  open: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
};

// Container for staggered children
export const containerVariants: Variants = {
  closed: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1, // Reverse order when closing
    },
  },
  open: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// Individual items (nav, actions, footer)
export const itemVariants: Variants = {
  closed: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.15 },
  },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2 },
  },
};
```

### Animation Performance
```typescript
// Performance optimizations
const MotionConfig = {
  // Use GPU acceleration
  style: { willChange: 'transform' },
  
  // Reduce motion for accessibility
  reduce: window.matchMedia('(prefers-reduced-motion)').matches,
  
  // Layout optimization
  layout: false, // Avoid layout animations
  layoutId: undefined, // No shared layouts
};
```

## 📱 **Touch Gestures**

### Swipe-to-Close Implementation
```typescript
interface SwipeGestureConfig {
  threshold: number; // Minimum distance (px)
  velocity: number;  // Minimum velocity (px/ms)
  direction: 'horizontal' | 'vertical' | 'both';
}

const defaultSwipeConfig: SwipeGestureConfig = {
  threshold: 50,
  velocity: 0.3,
  direction: 'horizontal',
};

// Gesture handlers
const swipeHandlers = {
  onPanStart: (event, info) => {
    // Track start position
  },
  onPan: (event, info) => {
    // Update drag position (optional visual feedback)
  },
  onPanEnd: (event, info) => {
    // Determine if swipe should close drawer
    const { offset, velocity } = info;
    
    if (offset.x > threshold && velocity.x > minVelocity) {
      onClose();
    }
  },
};
```

## 🔐 **Accessibility Features**

### ARIA Attributes
```typescript
const accessibilityProps = {
  // Drawer panel
  role: 'dialog',
  'aria-modal': 'true',
  'aria-labelledby': 'drawer-title',
  'aria-describedby': 'drawer-description',
  
  // Navigation
  role: 'navigation',
  'aria-label': 'Main navigation',
  
  // Close button
  'aria-label': 'Close navigation menu',
  'aria-expanded': isOpen,
  'aria-controls': 'drawer-panel',
};
```

### Keyboard Navigation
```typescript
const keyboardHandlers = {
  // Close on Escape
  Escape: () => onClose(),
  
  // Tab navigation within drawer
  Tab: (event) => {
    // Trap focus within drawer
    trapFocus(event, drawerRef.current);
  },
  
  // Arrow key navigation (optional)
  ArrowDown: () => focusNext(),
  ArrowUp: () => focusPrevious(),
  Enter: () => activateItem(),
  Space: () => activateItem(),
};
```

### Focus Management
```typescript
interface FocusManager {
  // Store previous focus before opening
  previousFocus: HTMLElement | null;
  
  // Focus first interactive element
  focusFirst: () => void;
  
  // Focus last interactive element
  focusLast: () => void;
  
  // Restore focus when closing
  restoreFocus: () => void;
  
  // Trap focus within drawer
  trapFocus: (event: KeyboardEvent) => void;
}
```

## 🚀 **Performance Optimizations**

### Code Splitting
```typescript
// Lazy load drawer components
const DrawerMenu = lazy(() => import('./DrawerMenu'));
const DrawerContent = lazy(() => 
  import('./DrawerContent').then(module => ({
    default: module.DrawerContent
  }))
);

// Preload on hover (optional)
const preloadDrawer = () => {
  import('./DrawerMenu');
};
```

### Memoization Strategy
```typescript
// Memoize expensive components
const MemoizedDrawerNavigation = memo(DrawerNavigation, (prevProps, nextProps) => {
  return (
    prevProps.currentPath === nextProps.currentPath &&
    prevProps.items.length === nextProps.items.length
  );
});

// Memoize animation variants
const memoizedVariants = useMemo(() => ({
  drawerVariants,
  overlayVariants,
  containerVariants,
  itemVariants,
}), []);
```

### Bundle Size Impact
```typescript
// Estimated bundle sizes:
// - DrawerMenu component: ~3KB (gzipped)
// - Animation variants: ~0.5KB (gzipped)
// - Touch gestures: ~1KB (gzipped)
// - Accessibility features: ~0.5KB (gzipped)
// Total impact: ~5KB (gzipped)
```

## 🧪 **Testing Strategy**

### Unit Tests
```typescript
describe('DrawerMenu', () => {
  it('opens when isOpen prop is true', () => {});
  it('closes when onClose is called', () => {});
  it('traps focus when open', () => {});
  it('restores focus when closed', () => {});
  it('responds to keyboard events', () => {});
  it('handles swipe gestures', () => {});
});

describe('DrawerNavigation', () => {
  it('renders navigation items', () => {});
  it('highlights active route', () => {});
  it('calls onNavigate when item clicked', () => {});
  it('supports keyboard navigation', () => {});
});
```

### Integration Tests
```typescript
describe('Drawer Integration', () => {
  it('integrates with navbar hamburger button', () => {});
  it('closes on route navigation', () => {});
  it('prevents body scroll when open', () => {});
  it('works across different screen sizes', () => {});
});
```

### E2E Tests
```typescript
describe('Drawer User Flows', () => {
  it('user can open and navigate', () => {});
  it('user can download resume', () => {});
  it('user can close with various methods', () => {});
  it('works on touch devices', () => {});
});
```

This specification provides all the technical details needed for implementing the drawer components with proper TypeScript interfaces, styling guidelines, animation configurations, and testing strategies.