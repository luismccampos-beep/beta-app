/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_TINYMCE_API_KEY?: string;
  readonly VITE_ADMIN_URL?: string;
  readonly NEXT_PUBLIC_ADMIN_URL?: string;
  // adiciona aqui outras vars VITE_... que uses
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
