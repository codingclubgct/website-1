import typography from "@tailwindcss/typography";
import { createThemes } from "tw-colors";
import { ColorScheme } from "../color-schemes";
import { Config } from "tailwindcss";

export const generateTailwindConfig = <T>(colorScheme: ColorScheme<T>) => {
  return {
    content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
    important: "#__next",
    corePlugins: {
      preflight: false
    },
    plugins: [
      createThemes({
        light: colorScheme.light,
        dark: colorScheme.dark
      }),
      typography
    ],
    theme: {
      extend: {
        screens: {
          '3xs': '360px',   // iPhone 6, 7, 8, X, 11, 12 / Galaxy S8 / HTC One
          '2xs': '480px',   // Blackberry Passport / Amazon Kindle Fire HD 7
          'xs': '600px',    // LG G Pad 8.3 / Amazon Kindle Fire
          'sm': '768px',    // Microsoft Surface / iPad Pro 9.7 / iPad Mini
          'md': '1024px',   // iPad Pro 12.9 / Microsoft Surface Pro 3
          'lg': '1280px',   // Google Chromebook Pixel / Samsung Chromebook
          'xl': '1440px',   // Macbook Air 2020 M1 / MacBook Pro 15
          '2xl': '1600px',  // Dell Inspiron 14 series
          '3xl': '1920px',  // Dell UltraSharp U2412M / Dell S2340M / Apple iMac 21.5-inch
          '4xl': '2560px',  // Dell UltraSharp U2711 / Apple iMac 27-inch
        },
        typography: {
          DEFAULT: {
            css: {
              "--tw-prose-body": "hsl(var(--twc-text))",
              "--tw-prose-headings": "hsl(var(--twc-yellow))",
              "--tw-prose-lead": "hsl(var(--twc-text))",
              "--tw-prose-links": "hsl(var(--twc-blue))",
              "--tw-prose-bold": "hsl(var(--twc-yellow))",
              "--tw-prose-counters": "hsl(var(--twc-yellow))",
              "--tw-prose-bullets": "hsl(var(--twc-yellow))",
              "--tw-prose-hr": "hsl(var(--twc-yellow))",
              "--tw-prose-quotes": "hsl(var(--twc-yellow))",
              "--tw-prose-quote-borders": "hsl(var(--twc-yellow))",
              "--tw-prose-captions": "hsl(var(--twc-yellow))",
              "--tw-prose-code": "hsl(var(--twc-yellow))",
              "--tw-prose-pre-code": "hsl(var(--twc-yellow))",
              "--tw-prose-pre-bg": "hsl(var(--twc-mantle))",
              "--tw-prose-th-borders": "hsl(var(--twc-yellow))",
              "--tw-prose-td-borders": "hsl(var(--twc-yellow))",

              "--tw-prose-invert-body": "hsl(var(--twc-yellow))",
              "--tw-prose-invert-headings": "hsl(var(--twc-yellow))",
              "--tw-prose-invert-lead": "hsl(var(--twc-yellow))",
              "--tw-prose-invert-links": "hsl(var(--twc-blue))",
              "--tw-prose-invert-bold": "hsl(var(--twc-yellow))",
              "--tw-prose-invert-counters": "hsl(var(--twc-yellow))",
              "--tw-prose-invert-bullets": "hsl(var(--twc-yellow))",
              "--tw-prose-invert-hr": "hsl(var(--twc-yellow))",
              "--tw-prose-invert-quotes": "hsl(var(--twc-yellow))",
              "--tw-prose-invert-quote-borders": "hsl(var(--twc-yellow))",
              "--tw-prose-invert-captions": "hsl(var(--twc-yellow))",
              "--tw-prose-invert-code": "hsl(var(--twc-yellow))",
              "--tw-prose-invert-pre-code": "hsl(var(--twc-yellow))",
              "--tw-prose-invert-pre-bg": "hsl(var(--twc-mantle))",
              "--tw-prose-invert-th-borders": "hsl(var(--twc-yellow))",
              "--tw-prose-invert-td-borders": "hsl(var(--twc-yellow))",
            },
          },
        },
      }
    },
  } as Config;
}