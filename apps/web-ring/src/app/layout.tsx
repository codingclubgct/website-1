import { ThemeProvider } from "@/context/mui";
import "./globals.css"
import { DarkModeProvider } from "@/context/darkmode";
import { CatppuccinProvider } from "@/context/catppuccin";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" id="__next">
      <body>
        <DarkModeProvider>
          <ThemeProvider>
            <CatppuccinProvider>
              {children}
            </CatppuccinProvider>
          </ThemeProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}
