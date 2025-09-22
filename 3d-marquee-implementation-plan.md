# 3D Marquee Implementation Plan for HeroSection Background

## Overview
Replace the current aurora background in HeroSection.tsx with an Aceternity UI-inspired 3D Marquee component that displays images in a dynamic 3D grid layout.

## Component Architecture

### Main Components to Create

1. **ThreeDMarquee Component** (`src/components/ui/3d-marquee.tsx`)
   - Main container component for the 3D marquee effect
   - Props interface:
     ```typescript
     interface ThreeDMarqueeProps {
       images: string[];
       className?: string;
       pauseOnHover?: boolean;
       direction?: "up" | "down" | "left" | "right";
     }
     ```

2. **GridLineHorizontal Component** (`src/components/ui/grid-line-horizontal.tsx`)
   - Creates horizontal grid lines for the 3D perspective effect
   - Props interface:
     ```typescript
     interface GridLineHorizontalProps {
       className?: string;
       offset?: string;
     }
     ```

3. **GridLineVertical Component** (`src/components/ui/grid-line-vertical.tsx`)
   - Creates vertical grid lines for the 3D perspective effect
   - Props interface:
     ```typescript
     interface GridLineVerticalProps {
       className?: string;
       offset?: string;
     }
     ```

## Implementation Details

### 1. Placeholder Images
Using existing images from public folder:
- `/icon-512x512.png` - Main logo
- `/logo-1024.png` - Alternative logo
- `/og-image.png` - Social image
- `/window.svg` - Window icon
- `/file.svg` - File icon
- `/globe.svg` - Globe icon

### 2. 3D Marquee Structure
```
ThreeDMarquee
├── Container (perspective transform)
├── Grid Lines (horizontal/vertical)
├── Image Rows (multiple rows with different speeds)
│   ├── Row 1 (moves left)
│   ├── Row 2 (moves right)
│   ├── Row 3 (moves left)
│   └── Row 4 (moves right)
└── Overlay Effects (gradients for fading edges)
```

### 3. Animation System
- Use Framer Motion for smooth animations
- Different animation speeds for each row (parallax effect)
- Infinite loop animations using `repeat: Infinity`
- Transform3D for perspective effects
- CSS transforms for 3D positioning

### 4. Visual Effects
- CSS perspective for 3D depth
- Gradient overlays for edge fading
- Backdrop blur for text readability
- Opacity variations for depth perception
- Rotation and scale transforms for 3D appearance

### 5. Integration Strategy

#### Current HeroSection Structure:
```jsx
<section className="relative flex items-center justify-center h-full py-4 sm:py-8 lg:py-12">
  {/* Current background elements */}
  <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
  <div className="absolute inset-0 backdrop-blur-md bg-white/10"></div>
  
  {/* Content */}
  <div className="relative z-10">...</div>
</section>
```

#### New Structure:
```jsx
<section className="relative flex items-center justify-center h-full py-4 sm:py-8 lg:py-12">
  {/* 3D Marquee Background */}
  <ThreeDMarquee
    images={images}
    className="absolute inset-0 z-0"
    direction="up"
  />
  
  {/* Enhanced overlay for text readability */}
  <div className="absolute inset-0 bg-black/20 dark:bg-black/40 z-[1]"></div>
  <div className="absolute inset-0 backdrop-blur-sm z-[2]"></div>
  
  {/* Content (higher z-index) */}
  <div className="relative z-10">...</div>
</section>
```

## CSS Requirements

### 3D Transform Utilities
```css
.perspective-1000 {
  perspective: 1000px;
}

.transform-3d {
  transform-style: preserve-3d;
}

.rotate-x-12 {
  transform: rotateX(12deg);
}
```

### Animation Keyframes
```css
@keyframes marquee-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}

@keyframes marquee-right {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(0); }
}
```

## Performance Considerations

1. **Image Optimization**
   - Use Next.js Image component for optimized loading
   - Implement lazy loading for off-screen images
   - Preload critical images

2. **Animation Performance**
   - Use `transform` instead of changing layout properties
   - Enable hardware acceleration with `will-change: transform`
   - Limit the number of simultaneously animating elements

3. **Memory Management**
   - Recycle image elements instead of creating new ones
   - Implement intersection observer for visibility-based animations

## Responsive Design

### Breakpoints Strategy
- Mobile (< 640px): Single column, slower animations
- Tablet (640px - 1024px): Two columns, medium speeds
- Desktop (1024px+): Full grid layout, all animation speeds

### Accessibility
- Respect `prefers-reduced-motion` user preference
- Provide fallback static background for motion-sensitive users
- Ensure sufficient contrast for overlaid text

## Testing Strategy

1. **Visual Testing**
   - Test across different screen sizes
   - Verify text readability on all backgrounds
   - Check animation smoothness

2. **Performance Testing**
   - Monitor FPS during animations
   - Test memory usage with dev tools
   - Verify load times with slow connections

3. **Compatibility Testing**
   - Test on different browsers (Chrome, Firefox, Safari, Edge)
   - Verify mobile device performance
   - Check for any layout shifts

## Future Customization Options

1. **Dynamic Content**
   - Connect to Firebase for dynamic image loading
   - Add support for project thumbnails
   - Implement content rotation based on time/user preferences

2. **Enhanced Effects**
   - Add particle effects overlays
   - Implement hover interactions
   - Add sound effects (optional)

3. **User Controls**
   - Play/pause animation controls
   - Speed adjustment
   - Theme-based image sets

## File Structure
```
src/components/ui/
├── 3d-marquee.tsx           # Main marquee component
├── grid-line-horizontal.tsx # Horizontal grid lines
├── grid-line-vertical.tsx   # Vertical grid lines
└── marquee-utils.ts         # Utility functions

src/components/home/
└── HeroSection.tsx          # Updated hero section

src/app/globals.css          # Updated with new animations
```

## Next Steps

1. Create the component files in Code mode
2. Add required CSS animations to globals.css
3. Update HeroSection.tsx to use the new 3D marquee
4. Test and optimize performance
5. Document usage and customization options