import { ColorSchemeProvider } from "@/context/color-scheme";
import { DarkModeProvider } from "@/context/darkmode";
import { ThemeProvider } from "@/context/mui";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" id="__next">
      <body>
        <DarkModeProvider>
          <ThemeProvider>
            <ColorSchemeProvider>
              {children}
            </ColorSchemeProvider>
          </ThemeProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}
