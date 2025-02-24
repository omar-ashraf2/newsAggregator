declare global {
  interface Window {
    env?: Record<string, string>;
  }
}

export function getEnv(key: string, fallback = ""): string {
  return window.env?.[key] ?? fallback;
}

export const VITE_NEWSAPI_BASE_URL = getEnv("VITE_NEWSAPI_BASE_URL");
export const VITE_GUARDIAN_BASE_URL = getEnv("VITE_GUARDIAN_BASE_URL");
export const VITE_NYTIMES_BASE_URL = getEnv("VITE_NYTIMES_BASE_URL");

export const VITE_NEWSAPI_KEY = getEnv("VITE_NEWSAPI_KEY");
export const VITE_GUARDIAN_KEY = getEnv("VITE_GUARDIAN_KEY");
export const VITE_NYTIMES_KEY = getEnv("VITE_NYTIMES_KEY");
