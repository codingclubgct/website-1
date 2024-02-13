import { ThemeProvider } from "@/context/mui";
import "./globals.css"
import { DarkModeProvider } from "@/context/darkmode";
import { CatppuccinProvider } from "@/context/catppuccin";
import View from "@/components/view"
import { OpenProvider } from "@/context/open";
import SessionProvider from "@/components/session";
import { Metadata } from "next";

export const metadata : Metadata = {
  metadataBase: new URL("https://codingclubgct.in"),
  title: "Coding Club GCT",
  description: 'A club exclusively for coding. Here we practice and participate in programming competitions, solving real-world problems. Develop applications, providing tech support to our college and working on open source contributions.',
  icons: ["/favicon.ico", '/favicon-16x16.png', '/favicon-32x32.png', '/apple-touch-icon.png'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://codingclubgct.in',
    siteName: 'Coding Club GCT',
    title: 'Coding Club GCT',
    description: 'A club exclusively for coding. Here we practice and participate in programming competitions, solving real-world problems. Develop applications, providing tech support to our college and working on open source contributions.',
  },
  twitter: {
    title: 'Coding Club GCT',
    description: 'A club exclusively for coding. Here we practice and participate in programming competitions, solving real-world problems. Develop applications, providing tech support to our college and working on open source contributions.',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" id="__next">
      <body>
        <SessionProvider>
          <DarkModeProvider>
            <ThemeProvider>
              <CatppuccinProvider>
                <OpenProvider>
                  <View>
                    {children}
                  </View>
                </OpenProvider>
              </CatppuccinProvider>
            </ThemeProvider>
          </DarkModeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
