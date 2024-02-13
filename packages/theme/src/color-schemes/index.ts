export interface ColorScheme<T> {
    light: Record<keyof T, string>
    dark: Record<keyof T, string>
}

export * from "./catppuccin"
export * from "./rosepine"
