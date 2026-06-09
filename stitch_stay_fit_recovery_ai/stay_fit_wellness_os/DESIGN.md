---
name: Stay FIT Wellness OS
colors:
  surface: '#111225'
  surface-dim: '#111225'
  surface-bright: '#37374d'
  surface-container-lowest: '#0b0c1f'
  surface-container-low: '#191a2d'
  surface-container: '#1d1e32'
  surface-container-high: '#27283d'
  surface-container-highest: '#323348'
  on-surface: '#e1e0fb'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e1e0fb'
  inverse-on-surface: '#2e2f43'
  outline: '#849495'
  outline-variant: '#3a494b'
  surface-tint: '#00dbe7'
  primary: '#e1fdff'
  on-primary: '#00363a'
  primary-container: '#00f2ff'
  on-primary-container: '#006a71'
  inverse-primary: '#00696f'
  secondary: '#ebb2ff'
  on-secondary: '#520072'
  secondary-container: '#b600f8'
  on-secondary-container: '#fff6fc'
  tertiary: '#efffbb'
  on-tertiary: '#283500'
  tertiary-container: '#bdec00'
  on-tertiary-container: '#516800'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#74f5ff'
  primary-fixed-dim: '#00dbe7'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#f8d8ff'
  secondary-fixed-dim: '#ebb2ff'
  on-secondary-fixed: '#320047'
  on-secondary-fixed-variant: '#74009f'
  tertiary-fixed: '#c3f400'
  tertiary-fixed-dim: '#abd600'
  on-tertiary-fixed: '#161e00'
  on-tertiary-fixed-variant: '#3c4d00'
  background: '#111225'
  on-background: '#e1e0fb'
  surface-variant: '#323348'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system is envisioned as a high-performance "Wellness OS"—an intelligent, data-driven interface that feels more like a cockpit for the human body than a traditional app. The brand personality is **Intelligent**, **Supportive**, and **Premium**, aiming to evoke a sense of advanced bio-hacking and futuristic precision.

The visual style is a refined **Glassmorphism**. This involves deep-space backgrounds layered with translucent, frosted-glass panels that blur the content beneath them. Elements are defined by ultra-thin "light-leak" borders and subtle neon glows that represent active biological energy. The interface should feel ethereal yet grounded in data, utilizing high-contrast accents to highlight critical health metrics and recovery states.

## Colors
This design system utilizes a "Deep Space" palette to minimize eye strain and maximize the impact of glowing data points.

*   **Primary (Electric Blue):** Used for active states, primary actions, and "Optimal" health readings.
*   **Secondary (Vibrant Purple):** Used for high-intensity activity, achievements, and "Flow State" indicators.
*   **Tertiary (Acid Green):** Specifically reserved for recovery, healing, and "Ready to Train" status indicators.
*   **Neutrals:** The background is a mix of absolute black and deep navy (#0a0b1e) to create a sense of infinite depth.

Gradients should be used sparingly, primarily as "auras" behind glass panels or as subtle indicators in data visualizations.

## Typography
The typography strategy blends futuristic geometric shapes with technical precision. 

*   **Headlines (Sora):** A geometric sans-serif with a futuristic "tech-luxury" feel. Used for large data callouts and screen titles.
*   **Body (Geist):** A clean, highly legible font that maintains a technical edge while ensuring comfort for long-form health insights.
*   **Data & Labels (JetBrains Mono):** A monospaced font used for metrics, timestamps, and biological data points to reinforce the "OS" and "Developer Tool for the Body" aesthetic.

All labels should utilize slightly increased letter-spacing to enhance the technical, systematic feel of the UI.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a focus on "Data Modules." 

*   **Desktop:** A 12-column grid. Modules are often grouped into "command centers" where metrics are prioritized on the left and visual data (charts) on the right.
*   **Mobile:** A single-column scrollable feed of "Glass Cards."
*   **Rhythm:** We use a 4px base unit. Spacing between related data points is tight (8px), while spacing between distinct modules is generous (24px+) to allow the "glow" of the cards to breathe without overlap.

Safe areas are critical; ensure that blurred backgrounds do not interfere with the readability of text by maintaining a minimum contrast ratio of 4.5:1 against the frosted surfaces.

## Elevation & Depth
In this design system, depth is communicated through **Z-axis Layering and Opacity** rather than traditional shadows.

1.  **Level 0 (Background):** Deep navy to black gradients.
2.  **Level 1 (Glass Panels):** `rgba(255, 255, 255, 0.03)` with a 20px backdrop blur. These carry a 1px border of `rgba(255, 255, 255, 0.1)`.
3.  **Level 2 (Active States):** Elevated panels use a primary color "inner glow" (0.5px stroke with 4px blur) to simulate power running through the component.
4.  **Floating Elements:** Modals and tooltips use a more opaque glass (`0.08`) and a soft, wide-cast outer glow in the primary color at 10% opacity to suggest they are hovering above the OS.

## Shapes
The shape language is **Modern and Balanced**. 

Standard containers and cards use a 0.5rem (8px) radius to maintain a professional, systematic look. For "Biometric Circles" (progress rings) and "Action Pills," we transition to fully rounded (pill-shaped) geometry to contrast against the architectural grid. 

Buttons should never be sharp-edged; they must feel approachable and ergonomic, like premium wearable hardware.

## Components
*   **Glass Cards:** The core container. Must have a `backdrop-filter: blur(20px)` and a subtle linear-gradient border from top-left (light) to bottom-right (dark).
*   **Neon Buttons:** Primary buttons are filled with the Electric Blue primary color, using a slight outer glow. Ghost buttons use the 1px light-leak border.
*   **Status Chips:** Small, pill-shaped indicators. For recovery, use Acid Green text on a dark green translucent base.
*   **Biometric Inputs:** Input fields should be "Bottom-Line Only" or "Minimal Border" to avoid cluttering the glass surfaces. Focus states trigger a vertical glow on the left edge.
*   **Data Visuals:** Charts should use "Neon-Line" styling—high-contrast paths with a glow effect that leaves a "trail" across the grid.
*   **Segmented Controls:** Use a "sliding glass" indicator that moves behind the text options, creating a tactile physical feel within the OS.