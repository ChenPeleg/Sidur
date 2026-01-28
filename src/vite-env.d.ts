/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV: string
  // add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
