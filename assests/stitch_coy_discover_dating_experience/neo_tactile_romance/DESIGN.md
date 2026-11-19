---
name: Neo-Tactile Romance
colors:
  surface: '#fbf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fbf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#5b3f45'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#8f6f75'
  outline-variant: '#e3bdc3'
  surface-tint: '#bb0054'
  primary: '#b70052'
  on-primary: '#ffffff'
  primary-container: '#e11568'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb1c1'
  secondary: '#615b75'
  on-secondary: '#ffffff'
  secondary-container: '#e7defd'
  on-secondary-container: '#67617b'
  tertiary: '#615969'
  on-tertiary: '#ffffff'
  tertiary-container: '#7a7182'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9df'
  primary-fixed-dim: '#ffb1c1'
  on-primary-fixed: '#3f0017'
  on-primary-fixed-variant: '#8f003f'
  secondary-fixed: '#e7defd'
  secondary-fixed-dim: '#cbc2e0'
  on-secondary-fixed: '#1d182e'
  on-secondary-fixed-variant: '#49435c'
  tertiary-fixed: '#eadef2'
  tertiary-fixed-dim: '#cdc3d6'
  on-tertiary-fixed: '#1f1927'
  on-tertiary-fixed-variant: '#4b4454'
  background: '#fbf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes an intimate, high-trust environment engineered for modern social discovery. Balancing playful romance with uncompromising privacy, the interface rejects cold corporate anonymity in favor of a "neo-soft tactile" visual vocabulary: high-contrast geometric linework, deep violet structural ink, punchy hot coral affirmations, and pillowy lilac interaction surfaces.

The visual style blends soft neo-pop tactile realism with crisp mobile-first minimalism. Rather than murky blurred blurs or skeuomorphic clutter, components use clean solid offsets, deliberate stroke boundaries, and responsive bouncy micro-interactions. The target feeling is warm, safe, flirtatious, and decidedly premium.

## Colors

The palette is engineered around sharp chromatic contrast paired with delicate background tints:

- **Canvas & Backdrops (`#FFFCFE`)**: A tinted warm porcelain background that eliminates stark hospital-white glare, giving profile photos and cards a soft natural glow.
- **Primary Coral (`#FF347D`)**: The vibrant heartbeat of the UI. Reserved strictly for primary intents, match celebrations, heart triggers, and active toggles.
- **Secondary Lilac (`#E9E0FF`)**: A calming, premium surface tint used for pill chips, muted utility trays, ghost containers, and non-destructive selections.
- **Structural Ink (`#211B29`)**: A near-black violet utilized for crisp 1.5px/2px strokes, sharp drop shadows, icons, and hero headings.
- **Muted Violet (`#777383`)**: Designed for secondary metadata, distance indicators, timestamps, and placeholder elements to maintain comfortable contrast against `#FFFCFE`.

## Typography

Typographic hierarchy relies on the geometric warmth and tight optical spacing of Plus Jakarta Sans. 

- Large titles and person discovery tags leverage bold (`700`) and extra-bold (`800`) weights with tight tracking (`-0.02em` to `-0.03em`) to anchor fast-scrolling eyes.
- Profile copy and bio text prioritize comfortable reading using `body-lg` (500 weight) with relaxed vertical rhythm to invite deeper reads.
- Badges, status chips, and privacy indicators use capitalized or compact `label-sm` with slight positive tracking (`+0.04em`) to maintain razor-sharp legibility over photographic cards.

## Layout & Spacing

The layout is centered around an intentional vertical card-deck architecture:

- **Mobile Viewports (< 640px)**: Single-column edge-padded layout constrained to 100vh/100dvh for app-like thumb interaction. Outer screen margins are locked to `16px` (`margin-mobile`), ensuring maximal surface area for the visual discovery canvas.
- **Desktop & Tablet Viewports (>= 768px)**: Card canvases auto-center in a disciplined 440px–480px simulated device container with contextual lateral control wings, preserving native gesture reachability.
- **Internal Spacing**: Micro-rhythms utilize 4px base increments. Content containers enforce `16px` (`space-md`) interior breathing room, while compact discovery attributes (distance, badges, interests) are separated by `8px` (`space-sm`).

## Elevation & Depth

Visual hierarchy uses crisp graphic offset shadows rather than indistinct atmospheric blurs:

- **Surface Linework**: Interactive items, discovery cards, and primary sheets feature a crisp 1.5px or 2px outline in Structural Ink (`#211B29`).
- **Tactile Offset Shadows**: Surfaces rise off the porcelain canvas through hard-offset directional shadows: `3px 3px 0px #211B29`.
- **Pressed & Active State**: On touch or click, interactive elements shift `translate(2px, 2px)` while their drop-shadow collapses to `1px 1px 0px #211B29`, producing an instant physical button snap.
- **Ephemeral Layers (Action Sheets & Privacy Overlays)**: Floated drawers introduce a gentle underlying veil of `rgba(33, 27, 41, 0.45)` with rounded top sheets rimmed by the signature 2px ink outline.

## Shapes

The shape system embraces extreme curvature to balance the sharp structural ink borders:

- **Action Controls & Badges**: Fully pill-shaped (`9999px`), delivering a friendly, touch-ready aesthetic for interest tags, swipe controls, and navigation pills.
- **Discovery Cards & Modals**: Generously sculpted using `rounded-3xl` (24px to 32px radii), creating soft silhouettes that make content feel contained and protected.
- **Input Fields & Secondary Boxes**: Framed with `rounded-2xl` (16px radii), keeping forms soft and approachable while avoiding edge clash.

## Components

### Action Buttons
- **Primary Swiping Triggers (Pass/Like/Super-like)**: Circular pills (64px mobile diameter) with a 2px `#211B29` solid stroke, `3px 3px 0px #211B29` offset shadow, and solid fills (`#FFFCFE` for Pass, `#FF347D` with white icon for Like). Active states physically depress 2px diagonally.
- **Standard Primary Buttons**: Full-width pill buttons (`h-13`), bold text, `#FF347D` background, text in white, 2px border in `#211B29`, and tactile shadow.

### Discovery Cards
- Constructed with a 2px `#211B29` shell, 24px border radius, and a `4px 4px 0px #211B29` foundation shadow.
- Photography occupies 100% of the upper container, fading into a solid `#211B29` bottom bio overlay via an ultra-short linear gradient ramp for legibility.

### Attribute Chips & Interest Badges
- Pill-shaped (`rounded-full`), padded with `8px 14px`, 1.5px `#211B29` border.
- Inactive badges sit on a `#E9E0FF` surface with `#211B29` text.
- Highlighted/Common interests flip to a `#FF347D` surface with crisp white text.

### Form Inputs & Privacy Toggles
- Inputs feature a `#FFFCFE` base, 1.5px `#211B29` border, and 16px radius. Focus states apply a warm 3px `#FF347D` outer glow ring alongside the ink border.
- Toggle switches use a rounded pill track in `#E9E0FF` with a sliding circular thumb bounded by a 1.5px ink stroke. Active toggles fill the track with `#FF347D`.

### Privacy Badges & Ephemeral Notifications
- Floating security capsules with mini lock icons, rendered in high-contrast `#211B29` background with `#FFFCFE` text, floating unobtrusively at card headers to signal encrypted chat and incognito discoverability.