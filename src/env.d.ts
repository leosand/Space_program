/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SPACEX_API_URL: string;
  readonly VITE_NASA_API_KEY: string;
  readonly VITE_NASA_API_URL: string;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 