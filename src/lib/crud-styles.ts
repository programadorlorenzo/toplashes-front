export const pageTitleStyle = {
  fontFamily: "var(--font-heading), Georgia, serif",
  color: "hsl(var(--tl-brown-dark))",
  fontWeight: 500,
  letterSpacing: "0.01em",
} as const;

export const cardPaperStyle = {
  backgroundColor: "hsl(var(--card))",
  borderColor: "hsl(var(--border))",
} as const;

export const primaryButtonStyles = {
  root: {
    backgroundColor: "hsl(var(--tl-taupe))",
    color: "hsl(var(--tl-ivory))",
    fontWeight: 500,
    letterSpacing: "0.02em",
  },
} as const;

export const subtleActionStyle = {
  color: "hsl(var(--tl-brown-medium))",
} as const;
