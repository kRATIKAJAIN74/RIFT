# 📱 Quick Responsive Design Reference

## Hamburger Menu Locations

```
LandingPage:  [☰] Menu → Shows user info + logout
UploadPage:   [☰] Menu → Shows user info + logout
SigninPage:   No hamburger (single form, already mobile-optimized)
SignupPage:   No hamburger (single form, already mobile-optimized)
```

## Layout Changes by Screen Size

### 📱 Mobile (< 640px)

- **Navigation**: Hamburger menu only
- **Stats Grid**: 2 columns
- **Drug Selection**: 2 columns
- **Hero Text**: `text-3xl`
- **Logo Title**: Hidden (logo only)

### 📱 Small Tablet (640px - 767px)

- **Navigation**: Still hamburger
- **Stats Grid**: 2 columns
- **Drug Selection**: 2 columns
- **Hero Text**: `text-4xl`
- **Logo Title**: Visible

### 💻 Tablet (768px - 1023px)

- **Navigation**: Full nav (no hamburger)
- **Stats Grid**: 2 columns
- **Drug Selection**: 2 columns
- **Hero Text**: `text-5xl`
- **User Info**: Truncated

### 🖥️ Desktop (1024px+)

- **Navigation**: Full nav with all details
- **Stats Grid**: 4 columns
- **Drug Selection**: 3 columns
- **Hero Text**: `text-6xl` (XL: `text-7xl`)
- **User Info**: Full display

## Critical Responsive Classes

### Text Scaling

```jsx
// Hero heading
text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl

// Body text
text-sm sm:text-base md:text-lg

// Small labels
text-xs sm:text-sm
```

### Container Spacing

```jsx
// Horizontal padding
px-3 sm:px-4    // Tight mobile → Standard tablet
px-4 sm:px-6    // Standard mobile → Wider tablet

// Vertical padding
py-3 sm:py-4    // Compact mobile → Standard tablet
py-6 sm:py-8    // Standard mobile → Spacious tablet
```

### Grid Layouts

```jsx
// Stats cards (2 col mobile → 4 col desktop)
grid-cols-2 lg:grid-cols-4

// Drug buttons (2 col mobile → 3 col desktop)
grid-cols-2 lg:grid-cols-3
```

### Navigation Display

```jsx
// Desktop navigation (hide on mobile)
hidden md:flex

// Mobile menu button (hide on desktop)
flex md:hidden
```

## Testing Checklist

### ✅ Mobile (375px)

- [ ] Hamburger menu works
- [ ] All text readable
- [ ] No horizontal scroll
- [ ] Buttons easily tappable
- [ ] Forms fit screen

### ✅ Tablet (768px)

- [ ] Navigation switches to desktop
- [ ] Grids look balanced
- [ ] Images/videos scale
- [ ] Spacing appropriate

### ✅ Desktop (1920px)

- [ ] Full navigation visible
- [ ] Content not too wide (max-w-7xl)
- [ ] Stats in 4 columns
- [ ] All details shown

## Common Breakpoint Values

```
Mobile:       < 640px   (iPhone SE: 375px, most phones: 360-414px)
Tablet:       640-1023px (iPad: 768px, iPad Pro: 1024px)
Desktop:      ≥ 1024px   (Laptops: 1366/1440px, Desktop: 1920px)
Large:        ≥ 1280px   (4K: 3840px)
```

## Quick Fixes

### If text too small on mobile:

```jsx
// Change from
text-sm

// To
text-base sm:text-sm
```

### If button too cramped on mobile:

```jsx
// Change from
px-4 py-2

// To
px-6 py-3 sm:px-4 sm:py-2
```

### If menu not hiding on desktop:

```jsx
// Ensure you have
className = "hidden md:block"; // For desktop-only
className = "md:hidden"; // For mobile-only
```

## Key Files Modified

1. `frontend/src/pages/LandingPage.jsx` - Hamburger nav + responsive hero
2. `frontend/src/pages/UploadPage.jsx` - Hamburger nav + responsive forms + assistant chat
3. `frontend/src/pages/SigninPage.jsx` - Responsive auth form
4. `frontend/src/pages/SignupPage.jsx` - Responsive auth form
5. `frontend/src/components/Footer.jsx` - Responsive footer text

## Assistant Chat Responsive Features

### Button Position & Size

```jsx
// Mobile: Bottom-right with smaller padding
bottom-4 right-4 p-3 (icon: 20px)

// Desktop: More spacing
bottom-8 right-8 p-4 (icon: 24px)
```

### Panel Layout

```jsx
// Mobile: Full width with margins
inset-x-4 bottom-20        // 16px from sides
max-h-[70vh]               // 70% of viewport height

// Desktop: Fixed width
w-96 bottom-24 right-8     // 384px width
max-h-96                   // 384px height
```

### Message Bubbles

```jsx
// Mobile: Wider messages
max-w-[85%]               // 85% of container

// Desktop: Standard width
max-w-xs                  // 320px max
```

## Build Command

```bash
cd frontend
npm run build
```

## Dev Server (Test Responsive)

```bash
cd frontend
npm run dev
# Then use Chrome DevTools Device Mode (Ctrl+Shift+M)
```

---

**Note**: All responsive breakpoints follow Tailwind CSS defaults. Mobile-first approach means base styles target smallest screens first.
