# 📐 Responsive Layout Visual Guide

## Navigation Behavior Across Breakpoints

```
┌──────────────────────────────────────────────────────────────────┐
│                    MOBILE (< 768px)                               │
├──────────────────────────────────────────────────────────────────┤
│  [PharmaGuard Logo]                    [🌙 Theme]  [☰ Menu]     │
│                                                                   │
│  ┌─────────────────────────────────────┐  ← Menu opens here     │
│  │  👤 John Doe                       │                          │
│  │     john@example.com                │                          │
│  │                                     │                          │
│  │  [Logout Button]                    │                          │
│  └─────────────────────────────────────┘                          │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                   DESKTOP (≥ 768px)                               │
├──────────────────────────────────────────────────────────────────┤
│  [Logo] PharmaGuard   [🌙] [👤 John Doe] [Logout]               │
│                            john@example.com                       │
└──────────────────────────────────────────────────────────────────┘
```

## Landing Page Hero Section

```
MOBILE (< 640px):
┌────────────────┐
│  RIFT 2026     │  ← Small badge
│                 │
│   Preventing    │  ← 3xl (30px)
│    Adverse      │
│ Drug Reactions  │
│                 │
│  AI-powered...  │  ← Small text
│                 │
│ [Start Analysis]│  ← Full width button
└────────────────┘

DESKTOP (≥ 1024px):
┌────────────────────────────────────────┐
│         RIFT 2026 Hackathon            │  ← Larger badge
│                                        │
│        Preventing Adverse              │  ← 6xl-7xl (60-72px)
│         Drug Reactions                 │
│                                        │
│  AI-powered pharmacogenomic analysis   │  ← Larger text
│  that predicts drug-specific risks...  │
│                                        │
│       [Start Analysis →]               │  ← Inline button
└────────────────────────────────────────┘
```

## Stats Grid Layout

```
MOBILE (< 1024px):                DESKTOP (≥ 1024px):
┌──────┬──────┐                  ┌─────┬─────┬─────┬─────┐
│  6   │ 100K+│                  │  6  │100K+│ 98% │ 5s  │
│Genes │Lives │                  │Genes│Lives│ Acc │Time │
├──────┼──────┤                  │     │     │     │     │
│ 98%  │  5s  │                  └─────┴─────┴─────┴─────┘
│ Acc  │ Time │
└──────┴──────┘

  2 columns                        4 columns
  More compact                     Horizontal spread
  Details hidden                   Full details
```

## Upload Page Drug Selection

```
MOBILE (< 1024px):               DESKTOP (≥ 1024px):
┌───────────┬───────────┐        ┌────────┬────────┬────────┐
│  CODEINE  │  WARFARIN │        │CODEINE │WARFARIN│CLOPID..│
├───────────┼───────────┤        ├────────┼────────┼────────┤
│CLOPIDOGREL│SIMVASTATIN│        │SIMVA...│AZATHIO.│FLUOROU.│
├───────────┼───────────┤        └────────┴────────┴────────┘
│AZATHIOPRIN│FLUOROURACL│
└───────────┴───────────┘         3 columns
                                  Wider buttons
  2 columns
  Stacked tighter
```

## File Upload Section

```
MOBILE:
┌───────────────────────┐
│                       │
│      [Upload Icon]    │  ← Smaller icon (48px)
│                       │
│   Drag and drop...    │  ← Smaller text
│                       │
│   [Select File]       │  ← Smaller button
│                       │
│  VCF v4.2 • Max 5MB   │
│                       │
└───────────────────────┘
    Compact padding

DESKTOP:
┌───────────────────────────────┐
│                               │
│                               │
│       [Upload Icon]           │  ← Larger icon (64px)
│                               │
│  Drag and drop your VCF...    │  ← Larger text
│                               │
│      [Select File]            │  ← Larger button
│                               │
│   VCF v4.2 format • Max 5 MB  │
│                               │
└───────────────────────────────┘
    Generous padding
```

## Auth Pages (Sign In / Sign Up)

```
MOBILE (< 640px):
┌─────────────────┐
│                 │
│   [Logo Icon]   │  ← 40px
│                 │
│  PharmaGuard    │  ← 24px
│  Sign in...     │
│                 │
│ ┌─────────────┐ │
│ │ Email       │ │  ← Full width
│ └─────────────┘ │
│ ┌─────────────┐ │
│ │ Password    │ │
│ └─────────────┘ │
│                 │
│ [Sign In]       │  ← Full width
│                 │
└─────────────────┘
  Tight padding

DESKTOP/TABLET (≥ 640px):
┌───────────────────────┐
│                       │
│    [Logo Icon]        │  ← 48px
│                       │
│   PharmaGuard         │  ← 30px
│   Sign in...          │
│                       │
│ ┌───────────────────┐ │
│ │ Email             │ │  ← More width
│ └───────────────────┘ │
│ ┌───────────────────┐ │
│ │ Password          │ │
│ └───────────────────┘ │
│                       │
│     [Sign In]         │  ← Centered, auto width
│                       │
└───────────────────────┘
  Generous padding
```

## Responsive Padding Scale

```
Element          Mobile (px)    Desktop (px)
───────────────────────────────────────────
Page container:     12-16          24-32
Card padding:       16-20          32
Button padding:     12x10          24x8
Section margins:    24-32          48-64
Grid gaps:          12-16          16-24
```

## Interactive Elements Touch Targets

```
MOBILE (Minimum 44x44px):
┌────────────┐
│  CODEINE   │  ← 48px height minimum
└────────────┘    Larger padding

┌──────────────────────┐
│  [☰]  Hamburger      │  ← 40px tap area
└──────────────────────┘

DESKTOP (Standard sizes):
┌─────────┐
│ CODEINE │  ← 32px height
└─────────┘   Standard padding
```

## Text Size Progression

```
            Mobile    Tablet    Desktop    XL Desktop
─────────────────────────────────────────────────────
Hero H1:    30px      36px      48-60px    72px
H2:         24px      30px      36px       36px
Body:       14px      16px      18px       18px
Small:      12px      14px      14px       14px
```

## Breakpoint Trigger Points

```
                Mobile          Tablet          Desktop         XL
                ──────          ──────          ───────         ──
Viewport:       < 640px      640-767px       768-1023px      ≥ 1024px
Nav Style:      Hamburger    Hamburger       Full Nav        Full Nav
Stats Grid:     2 cols       2 cols          2 cols          4 cols
Drug Grid:      2 cols       2 cols          2 cols          3 cols
Logo Text:      Hidden       Visible         Visible         Visible
User Info:      Menu only    Menu only       Inline          Inline
```

## Footer Consistency

```
ALL BREAKPOINTS:
┌─────────────────────────────────────────────┐
│        Made by ❤️ DevCore                   │  ← Always centered
└─────────────────────────────────────────────┘
    Text: 12px (mobile) → 14px (desktop)
```

## Z-Index Layering

```
Layer 5: Mobile Menu (when open) - z-10 + backdrop
Layer 4: Assistant Chat Panel - z-50
Layer 3: Assistant Floating Button - z-50
Layer 2: Navigation Headers - z-10
Layer 1: Page Content - z-10
Layer 0: Video Backgrounds - z-0
```

## Assistant Chat Panel

```
MOBILE (< 640px):
┌────────────────────────────┐
│  ⚡ PharmaGuard Asst    [X]│  ← Compact header
├────────────────────────────┤
│ 👋 Hello! How can I...    │
│                            │
│ [Upload VCF file]          │  ← Full width buttons
│ [How it works]             │
│ [Risk levels]              │
│                            │  ← 70% viewport height
│                            │
├────────────────────────────┤
│ [Ask anything...    ] [→]  │  ← Tight padding
└────────────────────────────┘
  Full width with 16px margins
  Positioned bottom-20 (80px from bottom)

DESKTOP (≥ 640px):
┌────────────────────────┐
│ ⚡ PharmaGuard Assist [X]│  ← Larger header
├────────────────────────┤
│ 👋 Hello! How can I... │
│                        │
│  [Upload VCF file]     │  ← Standard buttons
│  [How it works]        │
│  [Risk levels]         │
│                        │  ← Max 384px height
│                        │
├────────────────────────┤
│ [Ask anything...  ] [→]│  ← Standard padding
└────────────────────────┘
  Fixed 384px width
  Positioned bottom-96px right-32px
```

## Floating Button Position

```
MOBILE:               DESKTOP:
     [Chat]                  [Chat]
bottom-4 right-4      bottom-8 right-8
48px button           56px button
20px icon             24px icon
```

---

**Color Legend:**
- 🟦 Blue = Interactive elements
- 🟪 Purple = Gradient accents
- ⚪ White/Light = Light mode
- ⚫ Dark = Dark mode
- 🟩 Green = Success states
- 🟥 Red = Error states

**Implementation:** React 18 + Tailwind CSS 3 + Mobile-First Design
