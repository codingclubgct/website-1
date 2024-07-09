import SessionProvider from "@/components/provider";
import { CatppuccinProvider } from "@/context/catppuccin";
import { DarkModeProvider } from "@/context/darkmode";
import { IssuesProvider } from "@/context/issues";
import { ThemeProvider } from "@/context/mui";
import { OpenProvider } from "@/context/open";
import "./global.css";
import "./tailwind.css";
import { Metadata } from "next";
import { headers } from "next/headers";
import View from "@/components/view";

export const metadata: Metadata = {
  metadataBase: new URL("https://blogs.codingclubgct.in"),
  title: "Blogs | Coding Club GCT",
  description: 'A club exclusively for coding. Here we practice and participate in programming competitions, solving real-world problems. Develop applications, providing tech support to our college and working on open source contributions.',
  icons: ["/favicon.ico", '/favicon-16x16.png', '/favicon-32x32.png', '/apple-touch-icon.png'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://blogs.codingclubgct.in',
    siteName: 'Blog | Coding Club GCT',
    title: 'Blogs | Coding Club GCT',
    description: 'A club exclusively for coding. Here we practice and participate in programming competitions, solving real-world problems. Develop applications, providing tech support to our college and working on open source contributions.',
  },
  twitter: {
    title: 'Blogs | Coding Club GCT',
    description: 'A club exclusively for coding. Here we practice and participate in programming competitions, solving real-world problems. Develop applications, providing tech support to our college and working on open source contributions.',
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers()
  const url = new URL(headersList.get("x-url")!)
  const author = url.searchParams.get("author")

  return (
    <html lang="en" id="__next">
      <body>
        <SessionProvider>
          <DarkModeProvider>
            <ThemeProvider>
              <CatppuccinProvider>
                <OpenProvider>
                  <IssuesProvider>
                    <View>
                      {children}
                    </View>
                  </IssuesProvider>
                </OpenProvider>
              </CatppuccinProvider>
            </ThemeProvider>
          </DarkModeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}