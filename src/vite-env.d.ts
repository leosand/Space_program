/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SPACEX_API_URL: string
  readonly VITE_NASA_API_URL: string
  readonly VITE_NASA_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 