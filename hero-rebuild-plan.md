# Single-Screen Hero Landing Page - Technical Plan

## Overview
Transform the current scrollable landing page into a single-screen (100vh) hero section while preserving existing functionality.

## Key Requirements
- ✅ Non-scrollable: Must fit within 100vh on all screen sizes
- ✅ Preserve Navbar and Footer functionality  
- ✅ Keep existing CTA buttons working (Download Resume, Visit Portfolio)
- ✅ Add third CTA button "See Projects" → `/projects`
- ✅ Remove "Scroll to explore" section
- ✅ Fully responsive design

## Technical Architecture

### Layout Structure
```
┌─────────────────────────────────────────┐
│ NAVBAR (64px fixed)                     │
├─────────────────────────────────────────┤
│ HERO SECTION (calc(100vh - 144px))      │
│   ├─ Welcome to                         │
│   ├─ GAURAV'S WORKSPACE (H1)            │
│   ├─ Subtitle paragraph                 │
│   ├─ [3 CTA Buttons]                    │
│   └─ [Stats Row]                        │
├─────────────────────────────────────────┤
│ FOOTER (~80px)                          │
└─────────────────────────────────────────┐
```

### Space Calculation
- **Total viewport**: 100vh
- **Navbar**: 64px (h-16)
- **Footer**: ~80px estimated
- **Available hero space**: `calc(100vh - 144px)`
- **Body overflow**: `hidden` to prevent scrollbars

### Component Changes

#### 1. Page Layout (`src/app/page.tsx`)
```typescript
// Remove ProjectSection
// Add overflow-hidden to container
// Single HeroSection only
```

#### 2. HeroSection (`src/components/home/HeroSection.tsx`)
```typescript
// Height: calc(100vh - 144px)
// Remove scroll indicator
// Add third CTA button
// Responsive typography with clamp()
// Improved mobile stacking
```

#### 3. CSS Updates (`src/app/globals.css`)
```css
// Add bg-grid-pattern class
// Add responsive typography utilities
// Ensure proper overflow handling
```

## Responsive Breakpoints

### Desktop (≥1280px)
- Hero content centered vertically and horizontally
- All 3 buttons inline
- Large typography (text-6xl)

### Tablet (≥768px)
- Reduced padding and font sizes
- Buttons inline if space permits
- Medium typography (text-5xl)

### Mobile (≤640px)
- Buttons stack vertically
- Stats may wrap to 2 rows
- Fluid typography with clamp()
- Minimum viable spacing

## Button Configuration
1. **Download Resume** - Primary blue button (existing)
2. **Visit Main Portfolio** - Outlined secondary button (existing)
3. **See Projects** - Outlined secondary button (NEW) → `/projects`

## Visual Enhancements
- Light gradient background preserved
- Subtle grid pattern overlay
- Soft fade-in animations
- Hover/press states
- No layout shifts during animations

## Implementation Steps
1. ✅ Analyze current layout and constraints
2. ✅ Update main page to remove scrollable sections
3. 🔄 Rebuild HeroSection for 100vh constraint
4. ⏳ Add third CTA button with routing
5. ⏳ Implement responsive design system
6. ⏳ Test across all viewport sizes
7. ⏳ Verify existing functionality preservation

## Success Criteria
- [ ] Page fits exactly in 100vh on all devices
- [ ] No scrollbars appear at any screen size
- [ ] All existing buttons/links work correctly
- [ ] "See Projects" links to `/projects` route
- [ ] Responsive design looks great on mobile/tablet/desktop
- [ ] Animations perform smoothly without layout shift
- [ ] Navbar and Footer remain unchanged and functional