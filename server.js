import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createPaymentOrder, verifyPaymentSignature } from './server/payments.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Gomzi Payments API' })
})

// POST /api/payments/order (Server-side price verification & order creation)
app.post('/api/payments/order', createPaymentOrder)

// POST /api/payments/verify (HMAC-SHA256 signature verification)
app.post('/api/payments/verify', verifyPaymentSignature)

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Razorpay Payments Server running on http://localhost:${PORT}`)
  })
}

export default app
