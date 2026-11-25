const url = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:8080' : '')

export const API_URL = url.replace(/\/$/, '')