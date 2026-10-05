// GERADO por design-tokens/build.mjs a partir de tokens.json. Não edite.
export const tokens = {
  "color": {
    "bg": "#08120E",
    "surface": "#101C17",
    "surfaceElevated": "#16241D",
    "border": "#26372E",
    "borderStrong": "#5A7567",
    "primary": "#39E079",
    "primaryHighlight": "#7CFFAC",
    "onPrimary": "#08120E",
    "primaryMuted": "rgba(57, 224, 121, 0.14)",
    "textPrimary": "#F5F7F6",
    "textSecondary": "#94A39B",
    "textDisabled": "#5B6B62",
    "success": "#39E079",
    "warning": "#F2C94C",
    "danger": "#FF5D5D",
    "info": "#58A6FF",
    "successMuted": "rgba(57, 224, 121, 0.14)",
    "warningMuted": "rgba(242, 201, 76, 0.14)",
    "dangerMuted": "rgba(255, 93, 93, 0.14)",
    "infoMuted": "rgba(88, 166, 255, 0.14)",
    "focusRing": "#7CFFAC",
    "overlay": "rgba(4, 9, 7, 0.72)"
  },
  "font": {
    "family": {
      "ui": "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
      "display": "'Sora', 'Inter', system-ui, sans-serif",
      "mono": "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace"
    },
    "size": {
      "xs": "12px",
      "sm": "13px",
      "md": "14px",
      "lg": "16px",
      "xl": "20px",
      "2xl": "24px",
      "3xl": "32px",
      "4xl": "48px",
      "score": "72px"
    },
    "weight": {
      "regular": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700"
    },
    "lineHeight": {
      "tight": "1.15",
      "snug": "1.3",
      "normal": "1.5"
    },
    "tracking": {
      "caps": "0.08em",
      "display": "-0.01em"
    }
  },
  "space": {
    "0": "0px",
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "5": "20px",
    "6": "24px",
    "8": "32px",
    "10": "40px",
    "12": "48px",
    "16": "64px"
  },
  "radius": {
    "xs": "4px",
    "sm": "6px",
    "md": "8px",
    "lg": "12px",
    "full": "999px"
  },
  "border": {
    "width": "1px"
  },
  "shadow": {
    "overlay": "0 12px 32px rgba(0, 0, 0, 0.45)"
  },
  "motion": {
    "duration": {
      "instant": "80ms",
      "fast": "140ms",
      "base": "220ms",
      "slow": "360ms"
    },
    "easing": {
      "standard": "cubic-bezier(0.2, 0, 0, 1)",
      "enter": "cubic-bezier(0, 0, 0, 1)",
      "exit": "cubic-bezier(0.4, 0, 1, 1)"
    }
  },
  "layout": {
    "sidebarWidth": "248px",
    "sidebarWidthCollapsed": "72px",
    "topbarHeight": "56px",
    "contentMaxWidth": "1440px",
    "controlHeight": {
      "sm": "32px",
      "md": "40px",
      "lg": "48px"
    },
    "tableRowHeight": {
      "compact": "36px",
      "default": "44px"
    },
    "minTouchTarget": "40px"
  },
  "breakpoint": {
    "sm": "640px",
    "md": "960px",
    "lg": "1280px",
    "xl": "1600px"
  },
  "z": {
    "sticky": "10",
    "sidebar": "20",
    "dropdown": "40",
    "drawer": "50",
    "modal": "60",
    "toast": "70",
    "tooltip": "80"
  }
} as const;
export type Tokens = typeof tokens;
