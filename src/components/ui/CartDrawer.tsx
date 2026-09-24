import { useState, useEffect } from 'react'
import { sound } from '../../utils/soundEngine'
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Check, Truck, ShieldCheck, AlertCircle } from 'lucide-react'

export interface CartItem {
  id: string
  name: string
  size: string
  price: number
  image?: string
  quantity: number
}

interface CartDrawerProps {
  isOpen: boolean
  items: CartItem[]
  onClose: () => void
  onUpdateQuantity: (id: string, qty: number) => void
  onRemoveItem: (id: string) => void
  onClearCart?: () => void
}

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [promoError, setPromoError] = useState('')
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [completedPaymentId, setCompletedPaymentId] = useState<string | null>(null)

  // Load Razorpay checkout.js script dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (document.getElementById('razorpay-checkout-script')) return

    const script = document.createElement('script')
    script.id = 'razorpay-checkout-script'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  if (!isOpen) return null

  const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0)
  const discountAmount = Math.round((subtotal * discountPercent) / 100)
  const shipping = subtotal > 499 || subtotal === 0 ? 0 : 49
  const total = Math.max(0, subtotal - discountAmount + shipping)

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (promoCode.trim().toUpperCase() === 'GOMZI20') {
      sound.playChime(640, 0.4)
      setDiscountPercent(20)
      setPromoError('')
    } else {
      sound.playClick(300, 0.08)
      setPromoError('Invalid code. Try "GOMZI20"')
    }
  }

  // Real Razorpay Checkout flow (Server-side price verification + HMAC-SHA256 signature verification)
  const handleRazorpayCheckout = async () => {
    try {
      setPaymentError(null)
      setIsCheckingOut(true)
      sound.playClick(600, 0.05)

      // 1. Create order on server (prices looked up strictly server-side from product IDs)
      const res = await fetch('/api/payments/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((it) => ({ id: it.id, quantity: it.quantity })),
        }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Server failed to initialize payment order')
      }

      const orderData = await res.json()
      const { order_id, amount, currency, key_id, isMock } = orderData

      // Check if official Razorpay checkout script is loaded
      const RazorpayConstructor = (window as any).Razorpay

      if (RazorpayConstructor && !isMock) {
        const options = {
          key: key_id,
          amount: amount,
          currency: currency || 'INR',
          name: 'GOMZI LIFE SCIENCE',
          description: 'Bio-Available Protein Culinary Staples',
          order_id: order_id,
          handler: async function (response: any) {
            try {
              // 2. Verify payment signature on backend
              const verifyRes = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              })

              const verifyData = await verifyRes.json()

              if (verifyData.success) {
                sound.playChime(720, 0.5)
                setCompletedPaymentId(response.razorpay_payment_id)
                setOrderComplete(true)
                setIsCheckingOut(false)
                onClearCart?.()
              } else {
                setPaymentError(verifyData.error || 'Payment verification failed.')
                setIsCheckingOut(false)
              }
            } catch (vErr: any) {
              setPaymentError(vErr.message || 'Signature verification network error')
              setIsCheckingOut(false)
            }
          },
          theme: {
            color: '#E9B964',
          },
          modal: {
            ondismiss: function () {
              setIsCheckingOut(false)
            },
          },
        }

        const rzp = new RazorpayConstructor(options)
        rzp.on('payment.failed', function (resp: any) {
          setPaymentError(resp.error?.description || 'Payment was declined or cancelled.')
          setIsCheckingOut(false)
        })
        rzp.open()
      } else {
        // Test Mode Mock verification flow for offline/local development
        const mockPaymentId = `pay_test_${Math.random().toString(36).substring(2, 10)}`
        const verifyRes = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: order_id,
            razorpay_payment_id: mockPaymentId,
            razorpay_signature: 'mock_verified_sig',
          }),
        })

        const verifyData = await verifyRes.json()

        if (verifyData.success) {
          setTimeout(() => {
            sound.playChime(720, 0.5)
            setCompletedPaymentId(mockPaymentId)
            setOrderComplete(true)
            setIsCheckingOut(false)
            onClearCart?.()
          }, 800)
        } else {
          setPaymentError('Test mode verification could not be validated.')
          setIsCheckingOut(false)
        }
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      setPaymentError(err.message || 'Payment initiation failed. Please try again.')
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-out Drawer */}
      <div className="relative h-full w-full max-w-md bg-[#140e0a] border-l border-white/10 p-6 sm:p-8 flex flex-col justify-between text-[#f4ece1] shadow-2xl z-10 overflow-y-auto">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 font-serif text-2xl font-bold">
              <ShoppingBag className="h-5 w-5 text-[#E9B964]" />
              <span>YOUR SELECTION</span>
            </div>
            <button
              onClick={() => {
                sound.playClick(440, 0.03)
                onClose()
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-[#a89b8d] hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 text-[#dcd0bf]">
                <Truck className="w-3.5 h-3.5 text-[#E9B964]" />
                <span>
                  {subtotal >= 499
                    ? '🎉 You unlocked FREE Express Delivery!'
                    : `Add ₹${499 - subtotal} more for Free Delivery`}
                </span>
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-[#E9B964] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (subtotal / 499) * 100)}%` }}
              />
            </div>
          </div>

          {/* Payment Error Toast */}
          {paymentError && (
            <div className="mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block">Payment Notice:</span>
                <span>{paymentError}</span>
              </div>
            </div>
          )}

          {/* Order Completed Confirmation Overlay */}
          {orderComplete ? (
            <div className="py-16 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#f4ece1] mb-2">Order Confirmed!</h3>
              <p className="text-xs text-[#a89b8d] max-w-xs mb-4 leading-relaxed">
                Thank you for choosing Gomzi Life Science. Your payment was verified securely with Razorpay.
              </p>
              {completedPaymentId && (
                <div className="font-mono text-[10px] text-[#E9B964] px-3 py-1 rounded bg-black/40 border border-white/10 mb-6">
                  Ref ID: {completedPaymentId}
                </div>
              )}
              <button
                onClick={() => {
                  setOrderComplete(false)
                  onClose()
                }}
                className="px-6 py-2.5 rounded-full bg-[#E9B964] text-[#0c0806] font-semibold text-xs cursor-pointer shadow-md hover:scale-105 transition-all"
              >
                Back to Store
              </button>
            </div>
          ) : (
            /* Cart Items List */
            <div className="mt-6 max-h-[45vh] overflow-y-auto divide-y divide-white/10 pr-2">
              {items.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="font-mono text-xs uppercase tracking-widest text-[#8a7e73]">
                    Your bag is empty
                  </p>
                  <p className="mt-2 text-sm text-[#b5a79a]">
                    Explore the 3D chapters above to add Multi Grain Atta, Spiced Chai, or Mocha Coffee.
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="py-4 flex items-center justify-between gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-14 object-contain rounded bg-white/5 p-1"
                      />
                    )}

                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-[#f4ece1] leading-tight">
                        {item.name}
                      </h4>
                      <span className="text-xs text-[#8a7e73] block">{item.size}</span>
                      <span className="font-mono text-xs font-bold text-[#E9B964]">
                        ₹{item.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-white/15 rounded-lg overflow-hidden bg-white/5">
                        <button
                          onClick={() => {
                            sound.playClick(420, 0.02)
                            onUpdateQuantity(item.id, item.quantity - 1)
                          }}
                          className="px-2 py-0.5 text-xs text-[#a89b8d] hover:text-white hover:bg-white/10 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 font-mono text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => {
                            sound.playClick(520, 0.02)
                            onUpdateQuantity(item.id, item.quantity + 1)
                          }}
                          className="px-2 py-0.5 text-xs text-[#a89b8d] hover:text-white hover:bg-white/10 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          sound.playClick(350, 0.03)
                          onRemoveItem(item.id)
                        }}
                        className="text-[#8a7e73] hover:text-rose-400 transition-colors p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer & Razorpay Checkout Area */}
        {!orderComplete && items.length > 0 && (
          <div className="pt-6 border-t border-white/10">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Discount code (try GOMZI20)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-[#f4ece1] placeholder:text-[#6e6359] focus:outline-none focus:border-[#E9B964]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>
            {promoError && <p className="text-[11px] text-rose-400 mb-2">{promoError}</p>}
            {discountPercent > 0 && (
              <p className="text-[11px] text-emerald-400 mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>20% discount applied successfully!</span>
              </p>
            )}

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#a89b8d] mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-[#f4ece1]">₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({discountPercent}%)</span>
                  <span className="font-mono">-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Delivery</span>
                <span className="font-mono">
                  {shipping === 0 ? <span className="text-emerald-400">FREE</span> : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#f4ece1] pt-2 border-t border-white/10">
                <span>Total</span>
                <span className="font-mono text-base text-[#E9B964]">₹{total}</span>
              </div>
            </div>

            {/* Razorpay Express Checkout Button */}
            <button
              onClick={handleRazorpayCheckout}
              disabled={isCheckingOut}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#E9B964] py-3.5 font-bold text-sm text-[#0c0806] shadow-xl hover:bg-[#f3d28e] transition-all hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
            >
              {isCheckingOut ? (
                <span>Securing Razorpay Order...</span>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Pay with Razorpay · ₹{total}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Test Mode Note as requested in Section E */}
            <div className="flex items-center justify-center gap-1.5 mt-2.5 text-[10px] font-mono text-[#E9B964]/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E9B964] animate-pulse" />
              <span>Razorpay Test Mode Active · Safe Sandbox</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
