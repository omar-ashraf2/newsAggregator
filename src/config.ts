declare global {
  interface Window {
    env?: { [key: string]: string };
  }
}

export const getEnv = (key: string, fallback?: string): string => {
  return window.env?.[key] || fallback || "";
};

// Fetch environment variables from `env-config.js`
export const VITE_NEWSAPI_BASE_URL = getEnv("VITE_NEWSAPI_BASE_URL");
export const VITE_GUARDIAN_BASE_URL = getEnv("VITE_GUARDIAN_BASE_URL");
export const VITE_NYTIMES_BASE_URL = getEnv("VITE_NYTIMES_BASE_URL");

export const VITE_NEWSAPI_KEY = getEnv("VITE_NEWSAPI_KEY");
export const VITE_GUARDIAN_KEY = getEnv("VITE_GUARDIAN_KEY");
export const VITE_NYTIMES_KEY = getEnv("VITE_NYTIMES_KEY");
