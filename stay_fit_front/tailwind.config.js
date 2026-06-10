/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0A0A0B",
        surface: "#121214",
        "surface-container": "#1A1A1D",
        "surface-container-high": "#1E1E22",
        "surface-variant": "#2A2A2E",
        "outline-variant": "#2A2A2E",
        outline: "#3F3F46",
        primary: "#FF6A00",
        "primary-fixed": "#E85F00",
        "on-primary": "#FFFFFF",
        "on-background": "#F5F5F5",
        "on-surface": "#F5F5F5",
        "on-surface-variant": "#A0A0A0",
        error: "#EF4444",
        warning: "#F59E0B",
        success: "#22C55E",
        secondary: "#A0A0A0",
        tertiary: "#A0A0A0"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "xl": "40px",
        "gutter": "20px",
        "unit": "4px",
        "margin-mobile": "16px",
        "xs": "4px",
        "lg": "24px",
        "sm": "8px",
        "2xl": "64px",
        "md": "16px",
        "margin-desktop": "48px"
      },
      fontFamily: {
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "display-lg": ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Inter", "sans-serif"],
        "label-sm": ["JetBrains Mono", "monospace"],
        "label-md": ["JetBrains Mono", "monospace"]
      },
      fontSize: {
        "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "label-sm": ["12px", {"lineHeight": "1.4", "fontWeight": "500"}],
        "headline-md": ["24px", {"lineHeight": "1.3", "fontWeight": "600"}],
        "display-lg": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "headline-lg": ["32px", {"lineHeight": "1.2", "fontWeight": "600"}],
        "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "label-md": ["14px", {"lineHeight": "1.4", "letterSpacing": "0.05em", "fontWeight": "500"}],
        "headline-lg-mobile": ["24px", {"lineHeight": "1.2", "fontWeight": "600"}]
      }
    },
  },
  plugins: [],
}
