# Navbar and Footer Full-Width Stretch Implementation Plan

## Current Issue
Both navbar and footer components use `max-w-7xl mx-auto` containers that constrain content width, making them appear contracted instead of stretching across the full screen width.

## Solution Overview
Remove max-width constraints and implement fluid content layout that adapts to screen size while maintaining proper spacing and readability.

## Implementation Details

### 1. Navbar Changes (`src/components/layout/Navbar.tsx`)

**Current problematic line (40):**
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

**Replace with:**
```tsx
<div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
```

**Changes:**
- Remove `max-w-7xl mx-auto` constraint
- Add `w-full` for full width
- Increase padding on larger screens (`xl:px-12 2xl:px-16`) for better content spacing on wide screens

### 2. Footer Changes (`src/components/layout/Footer.tsx`)

**Current problematic line (17):**
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

**Replace with:**
```tsx
<div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
```

**Changes:**
- Same approach as navbar
- Remove max-width constraint
- Add fluid padding system

### 3. Responsive Padding Strategy

The new padding system:
- `px-4` - Mobile (16px each side)
- `sm:px-6` - Small tablets (24px each side)
- `lg:px-8` - Large tablets/small desktop (32px each side)
- `xl:px-12` - Large desktop (48px each side)
- `2xl:px-16` - Extra large screens (64px each side)

This ensures content remains readable and well-spaced across all screen sizes without artificial width constraints.

### 4. Testing Considerations

- Mobile responsiveness (320px-768px)
- Tablet layouts (768px-1024px)
- Desktop layouts (1024px-1920px)
- Ultra-wide displays (1920px+)
- Content readability on all sizes
- Mobile menu functionality

### 5. Expected Outcome

- Navbar and footer backgrounds already stretch full width
- Content inside will now flow edge-to-edge with appropriate spacing
- No artificial width limits
- Better utilization of screen real estate
- Maintains accessibility and readability