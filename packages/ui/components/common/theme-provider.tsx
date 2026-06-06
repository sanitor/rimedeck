import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

export { useTheme };
import { TooltipProvider } from "../ui/tooltip";

export type Palette = "rime" | "zinc";

const PALETTE_KEY = "rimedeck-palette";

interface PaletteContextValue {
  palette: Palette;
  setPalette: (p: Palette) => void;
}

const PaletteContext = createContext<PaletteContextValue>({
  palette: "rime",
  setPalette: () => {},
});

export function usePalette() {
  return useContext(PaletteContext);
}

function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPaletteState] = useState<Palette>(() => {
    if (typeof window === "undefined") return "rime";
    return (localStorage.getItem(PALETTE_KEY) as Palette) || "rime";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (palette === "zinc") {
      root.setAttribute("data-palette", "zinc");
    } else {
      root.removeAttribute("data-palette");
    }
  }, [palette]);

  const setPalette = useCallback((p: Palette) => {
    setPaletteState(p);
    localStorage.setItem(PALETTE_KEY, p);
  }, []);

  return (
    <PaletteContext value={{ palette, setPalette }}>
      {children}
    </PaletteContext>
  );
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <PaletteProvider>
        <TooltipProvider delay={500}>
          {children}
        </TooltipProvider>
      </PaletteProvider>
    </NextThemesProvider>
  );
}
