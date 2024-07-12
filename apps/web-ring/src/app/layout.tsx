
import { ThemeProvider } from "@/context/mui";
import "./globals.css"
import { DarkModeProvider } from "@/context/darkmode";
import { CatppuccinProvider } from "@/context/catppuccin";

import { Metadata } from "next";

export default function RootLayout({ children }: { children: React.ReactNode }) {
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