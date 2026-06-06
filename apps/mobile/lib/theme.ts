/**
 * TypeScript mirror of the CSS variables defined in apps/mobile/global.css.
 *
 * Light = "Hoarfrost" (霜凝): frost-blue tinted neutrals
 * Dark  = "Moonlit Verse" (月韵): deep indigo canvas
 *
 * - `THEME` is the raw token object for inline styles, animations, and
 *   anywhere a Tailwind class can't reach.
 * - `NAV_THEME` is the React Navigation theme — passed into <ThemeProvider />
 *   in app/_layout.tsx so headers, modals, and the back button match.
 *
 * If you change a variable in global.css, update the matching key here.
 * See apps/mobile/docs/rnr-migration.md §5 for the sync rule.
 * See docs/rimedeck-feature-dev-add-theme.md for design rationale.
 */
import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native";

export const THEME = {
  light: {
    background: "hsl(220 30% 96%)",
    foreground: "hsl(225 28% 12%)",
    card: "hsl(220 25% 97%)",
    cardForeground: "hsl(225 28% 12%)",
    popover: "hsl(220 25% 97%)",
    popoverForeground: "hsl(225 28% 12%)",
    primary: "hsl(225 35% 15%)",
    primaryForeground: "hsl(220 25% 97%)",
    secondary: "hsl(220 24% 92%)",
    secondaryForeground: "hsl(225 35% 15%)",
    muted: "hsl(220 24% 92%)",
    mutedForeground: "hsl(225 22% 46%)",
    accent: "hsl(218 28% 90%)",
    accentForeground: "hsl(225 35% 15%)",
    destructive: "hsl(0 84.2% 60.2%)",
    destructiveForeground: "hsl(0 0% 98%)",
    border: "hsl(220 22% 85%)",
    input: "hsl(220 22% 85%)",
    ring: "hsl(230 45% 52%)",
    radius: "0.625rem",
    chart1: "hsl(235 65% 50%)",
    chart2: "hsl(220 55% 52%)",
    chart3: "hsl(205 45% 50%)",
    chart4: "hsl(192 38% 55%)",
    chart5: "hsl(180 32% 58%)",

    // RimeDeck custom — Hoarfrost (霜凝): blue accent
    brand: "hsl(235 75% 55%)",
    brandForeground: "hsl(220 25% 97%)",
    success: "hsl(152 65% 45%)",
    warning: "hsl(48 89% 47%)",
    info: "hsl(230 80% 55%)",
    priority: "hsl(25 95% 53%)",
    codeSurface: "hsl(225 18% 90%)",
    // Surface elevation tiers — frost layers. See global.css.
    surface1: "hsl(220 22% 95%)",
    surface2: "hsl(220 18% 87%)",
  },
  dark: {
    background: "hsl(245 30% 10%)",
    foreground: "hsl(220 18% 94%)",
    card: "hsl(245 32% 12%)",
    cardForeground: "hsl(220 18% 94%)",
    popover: "hsl(245 32% 12%)",
    popoverForeground: "hsl(220 18% 94%)",
    primary: "hsl(225 22% 88%)",
    primaryForeground: "hsl(245 32% 12%)",
    secondary: "hsl(245 28% 17%)",
    secondaryForeground: "hsl(220 18% 94%)",
    muted: "hsl(245 28% 17%)",
    mutedForeground: "hsl(225 18% 58%)",
    accent: "hsl(240 30% 19%)",
    accentForeground: "hsl(220 18% 94%)",
    destructive: "hsl(0 70.9% 59.4%)",
    destructiveForeground: "hsl(0 0% 98%)",
    border: "hsl(235 20% 30%)",
    input: "hsl(235 20% 33%)",
    ring: "hsl(30 72% 55%)",
    radius: "0.625rem",
    chart1: "hsl(30 78% 55%)",
    chart2: "hsl(22 70% 50%)",
    chart3: "hsl(14 62% 46%)",
    chart4: "hsl(6 55% 42%)",
    chart5: "hsl(350 48% 38%)",

    // RimeDeck custom — Moonlit Verse (月韵): orange accent
    brand: "hsl(30 75% 55%)",
    brandForeground: "hsl(30 30% 12%)",
    success: "hsl(152 60% 48%)",
    warning: "hsl(48 85% 50%)",
    info: "hsl(230 75% 58%)",
    priority: "hsl(25 90% 55%)",
    codeSurface: "hsl(245 22% 17%)",
    // Dark elevation tiers — indigo layers. See global.css.
    surface1: "hsl(245 26% 13%)",
    surface2: "hsl(245 22% 20%)",
  },
};

export const NAV_THEME: Record<"light" | "dark", Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
