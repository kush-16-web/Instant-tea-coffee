import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { createPaymentOrder, verifyPaymentSignature } from './server/payments.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'razorpay-payments-api',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/api/payments/order' && req.method === 'POST') {
            let body = ''
            req.on('data', (chunk) => {
              body += chunk
            })
            req.on('end', async () => {
              try {
                ;(req as any).body = JSON.parse(body || '{}')
              } catch {
                ;(req as any).body = {}
              }
              const mockRes = {
                status: (code: number) => {
                  res.statusCode = code
                  return mockRes
                },
                json: (data: any) => {
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(data))
                },
              }
              await createPaymentOrder(req as any, mockRes as any)
            })
            return
          }

          if (req.url === '/api/payments/verify' && req.method === 'POST') {
            let body = ''
            req.on('data', (chunk) => {
              body += chunk
            })
            req.on('end', () => {
              try {
                ;(req as any).body = JSON.parse(body || '{}')
              } catch {
                ;(req as any).body = {}
              }
              const mockRes = {
                status: (code: number) => {
                  res.statusCode = code
                  return mockRes
                },
                json: (data: any) => {
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(data))
                },
              }
              verifyPaymentSignature(req as any, mockRes as any)
            })
            return
          }

          next()
        })
      },
    },
  ],
})
