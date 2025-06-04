export type ThemeType = 'light' | 'dark'

export interface IThemeColors {
  primary: string
  secondary: string
  accent: string
  error: string
  info: string
  success: string
  warning: string
  background: string
  surface: string
}

export interface ITheme {
  dark: boolean
  colors: IThemeColors
} 