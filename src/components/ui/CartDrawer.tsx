import { useState } from 'react'
import { sound } from '../../utils/soundEngine'
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Check, Truck } from 'lucide-react'

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
}

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [promoError, setPromoError] = useState('')
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

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

  const handleCheckout = () => {
    sound.playChime(720, 0.5)
    setIsCheckingOut(true)
    setTimeout(() => {
      setIsCheckingOut(false)
      setOrderComplete(true)
    }, 1200)
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
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-[#a89b8d] hover:text-white transition-colors"
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

          {/* Order Completed Confirmation Overlay */}
          {orderComplete ? (
            <div className="py-16 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#f4ece1] mb-2">Order Confirmed!</h3>
              <p className="text-xs text-[#a89b8d] max-w-xs mb-6 leading-relaxed">
                Thank you for choosing Gomzi Life Science. Your protein staples are being freshly prepared and packed.
              </p>
              <button
                onClick={() => {
                  setOrderComplete(false)
                  onClose()
                }}
                className="px-6 py-2.5 rounded-full bg-[#E9B964] text-[#0c0806] font-semibold text-xs"
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
                          className="px-2 py-0.5 text-xs text-[#a89b8d] hover:text-white hover:bg-white/10"
                        >
                          -
                        </button>
                        <span className="px-2 font-mono text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => {
                            sound.playClick(520, 0.02)
                            onUpdateQuantity(item.id, item.quantity + 1)
                          }}
                          className="px-2 py-0.5 text-xs text-[#a89b8d] hover:text-white hover:bg-white/10"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          sound.playClick(350, 0.03)
                          onRemoveItem(item.id)
                        }}
                        className="text-[#8a7e73] hover:text-rose-400 transition-colors p-1"
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

        {/* Footer & Checkout Area */}
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
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors"
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

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#E9B964] py-3.5 font-bold text-sm text-[#0c0806] shadow-xl hover:bg-[#f3d28e] transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isCheckingOut ? (
                <span>Securing Transaction...</span>
              ) : (
                <>
                  <span>Proceed to Express Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
