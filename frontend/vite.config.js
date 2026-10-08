import { randomBytes } from 'node:crypto'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode, command, isPreview }) => {
  const nonce = command === 'serve' && !isPreview ? randomBytes(18).toString('base64') : null
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const apiOrigin = new URL(env.VITE_API_URL || 'http://localhost:8000/api', 'http://localhost').origin
  const policy = [
    "default-src 'self'",
    `script-src 'self'${nonce ? ` 'nonce-${nonce}'` : ''}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    `img-src 'self' data: blob: https: ${apiOrigin}`,
    `connect-src 'self' ${apiOrigin} ws://localhost:* ws://127.0.0.1:*`,
    "frame-src https://www.google.com https://maps.google.com",
    "media-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
  ].join('; ')
  const headers = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(self), microphone=(), geolocation=()',
    'Content-Security-Policy': policy,
  }
  return {
    plugins: [tailwindcss(), react()],
    html: nonce ? { cspNonce: nonce } : {},
    server: { headers },
    preview: { headers },
  }
})
