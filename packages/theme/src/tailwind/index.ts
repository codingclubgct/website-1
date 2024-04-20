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
    safelist: [
      {pattern: /hljs-+/}
    ],
    plugins: [
      createThemes({
        light: colorScheme.light,
        dark: colorScheme.dark
      }),
      typography
    ],
    theme: {
      extend: {
        typography: {
          DEFAULT: {
            css: {
              '--tw-prose-body': 'hsl(var(--twc-text))',
              '--tw-prose-headings': 'var(--tw-prose-body)',
              '--tw-prose-links': 'hsl(var(--twc-blue))',
              '--tw-prose-pre-code': 'var(--twc-body)',
              '--tw-prose-pre-bg': 'hsl(var(--twc-mantle))',
              '--tw-prose-code': 'var(--tw-prose-body)',
              code: {
                backgroundColor: 'var(--tw-prose-pre-bg)',
                padding: "4px",
                borderRadius: "4px",
                borderColor: "var(--tw-prose-body)",
              }
            }
          }
        }
      }
    }
  } as Config;
}