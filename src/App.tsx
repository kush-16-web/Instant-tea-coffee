import { useState, useEffect, useCallback } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './lib/gsap'
import { FluidShaderCanvas } from './components/3d/FluidShaderCanvas'
import { Navbar } from './components/ui/Navbar'
import { CiaoenergyLoader } from './components/ui/CiaoenergyLoader'
import { UnifiedHeroDeckSection } from './components/sections/UnifiedHeroDeckSection'
import { ProductDetailSection } from './components/sections/ProductDetailSection'
import { NutritionLabSection } from './components/sections/NutritionLabSection'
import { SensoryRitualSection } from './components/sections/SensoryRitualSection'
import { TrinityBundleSection } from './components/sections/TrinityBundleSection'
import { GomziFooter } from './components/sections/GomziFooter'
import { QuickViewModal } from './components/ui/QuickViewModal'
import { CartDrawer, type CartItem } from './components/ui/CartDrawer'
import { GOMZI_PRODUCTS, TRINITY_BUNDLE, type GomziProduct } from './data/gomziProducts'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [heroProduct, setHeroProduct] = useState<GomziProduct>(GOMZI_PRODUCTS[0])
  const [currentTone, setCurrentTone] = useState<'hero' | 'atta' | 'tea' | 'mocha' | 'lab'>('hero')
  const [inspectProduct, setInspectProduct] = useState<GomziProduct | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: GOMZI_PRODUCTS[0].id,
      name: GOMZI_PRODUCTS[0].name,
      size: GOMZI_PRODUCTS[0].size,
      price: GOMZI_PRODUCTS[0].price,
      image: GOMZI_PRODUCTS[0].image,
      quantity: 1,
    },
  ])

  // Initialize Lenis smooth scroll & synchronize with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    })

    ;(window as any).lenis = lenis

    // Synchronize Lenis scroll with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    const tickerHandler = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerHandler)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tickerHandler)
      lenis.destroy()
      delete (window as any).lenis
    }
  }, [])

  // Cart operations
  const handleAddToCart = useCallback((product: GomziProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          size: product.size,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ]
    })
    setIsCartOpen(true)
  }, [])

  const handleAddBundleToCart = useCallback(() => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === TRINITY_BUNDLE.id)
      if (existing) {
        return prev.map((item) =>
          item.id === TRINITY_BUNDLE.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [
        ...prev,
        {
          id: TRINITY_BUNDLE.id,
          name: TRINITY_BUNDLE.name,
          size: '3-Product Full Set',
          price: TRINITY_BUNDLE.price,
          image: GOMZI_PRODUCTS[0].image,
          quantity: 1,
        },
      ]
    })
    setIsCartOpen(true)
  }, [])

  const handleUpdateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id))
      return
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    )
  }, [])

  const handleRemoveItem = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0)

  return (
    <div
      className="relative min-h-screen text-[#f4ece1] transition-colors duration-1000 ease-out"
      style={{
        backgroundColor: heroProduct.themeColor || '#0c0806',
        // Inject global dynamic brand variables matching the active hero product
        ['--brand-accent' as any]: heroProduct.accentColor,
        ['--brand-theme' as any]: heroProduct.themeColor,
      }}
    >
      {/* 1. Ciaoenergy-Style Brand Loading Screen */}
      <CiaoenergyLoader
        onComplete={() => setIsLoading(false)}
        accentColor={heroProduct.accentColor}
      />

      {/* 2. Fullscreen Fluid Aura Shader Canvas */}
      <FluidShaderCanvas currentTone={currentTone} />

      {/* 3. Film Grain & Vignette Overlay */}
      <div className="film-grain" />
      <div className="vignette-overlay" />

      {/* 4. Floating Navbar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeProduct={heroProduct}
      />

      {/* 5. Continuous Merged Hero + Product Deck Pinned Experience */}
      <UnifiedHeroDeckSection
        initialProductId={heroProduct.id}
        onProductChange={(p) => {
          setHeroProduct(p)
          setCurrentTone(p.id)
        }}
        onAddToCart={handleAddToCart}
        onQuickInspect={(p) => setInspectProduct(p)}
        readyToReveal={!isLoading}
      />

      {/* 6. Product Detail Intro (Clean continuation of selected product) */}
      <ProductDetailSection
        product={heroProduct}
        onAddToCart={handleAddToCart}
        onQuickInspect={(p) => setInspectProduct(p)}
      />

      {/* 7. Main Chapters & Sections */}
      <main id="main">

        {/* Clinical Science Lab (Macronutrient Verification - Image 3) */}
        <NutritionLabSection />

        {/* Sensory Preparation Simulator (Daily Ritual) */}
        <SensoryRitualSection initialProductId={heroProduct.id} />

        {/* The Daily Trinity 3-Pack Bundle Offer */}
        <TrinityBundleSection onAddBundleToCart={handleAddBundleToCart} />
      </main>

      {/* 7. Comprehensive Brand Footer */}
      <GomziFooter />

      {/* 8. Advanced 3D Anatomical Cutaway Inspector Modal (Screenshot) */}
      <QuickViewModal
        product={inspectProduct}
        onClose={() => setInspectProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* 9. Interactive Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
      />
    </div>
  )
}
