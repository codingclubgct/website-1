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
  } as Config;
}