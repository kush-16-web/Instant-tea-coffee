import { useState } from 'react'
import { PRODUCTS, type Product } from '../../data/products'
import { ArrowUpRight, Plus } from 'lucide-react'

interface ProductCatalogProps {
  onSelectProduct: (product: Product) => void
  onAddToCart: (product: Product) => void
}

export function ProductCatalog({ onSelectProduct, onAddToCart }: ProductCatalogProps) {
  const [filter, setFilter] = useState<'all' | 'coffee' | 'tea'>('all')

  const filtered = PRODUCTS.filter((p) => filter === 'all' || p.category === filter)

  return (
    <section id="products" className="relative min-h-screen w-full px-6 py-28 pointer-events-auto">
      <div className="mx-auto w-full max-w-7xl">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#f4ece1]/10 pb-8 mb-12">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#c67d3b]">
              CURRENT EXTRACTIONS
            </span>
            <h2 className="mt-3 font-serif text-5xl md:text-7xl font-light text-[#f4ece1]">
              THE ARCHIVE <span className="italic font-normal text-[#e09f3e]">CATALOG.</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="mt-6 md:mt-0 flex items-center gap-2">
            {[
              ['all', 'ALL OFFERINGS'],
              ['coffee', 'SPECIALTY COFFEE'],
              ['tea', 'ARTISAN TEA'],
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilter(val as any)}
                className={`rounded-full px-5 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-200 ${
                  filter === val
                    ? 'bg-[#c67d3b] text-[#0f0a07] font-bold shadow-lg'
                    : 'border border-[#f4ece1]/15 bg-[#160e0a]/60 text-[#d4c5b5] hover:border-[#f4ece1]/30 hover:text-[#f4ece1]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial List Layout (Awwwards Style, not a cheap box grid) */}
        <div className="divide-y divide-[#f4ece1]/10 border-b border-[#f4ece1]/10">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              className="group relative flex flex-col lg:flex-row lg:items-center justify-between py-8 transition-colors duration-300 hover:bg-[#1a0f09]/40 px-4 rounded-2xl"
            >
              {/* Left Column: Number, Title & Subtitle */}
              <div className="flex items-start sm:items-center gap-6">
                <span className="font-mono text-xs font-bold uppercase text-[#8e7e72] group-hover:text-[#c67d3b] transition-colors">
                  0{idx + 1}
                </span>

                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#f4ece1] transition-transform duration-300 group-hover:translate-x-2">
                      {item.name}
                    </h3>
                    <span className="rounded-full bg-[#f4ece1]/10 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#e09f3e]">
                      {item.category}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-[#a8998c]">{item.subtitle}</p>
                </div>
              </div>

              {/* Middle Column: Flavor Notes */}
              <div className="my-4 lg:my-0 flex flex-wrap gap-2 lg:max-w-xs">
                {item.flavorNotes.map((note) => (
                  <span
                    key={note}
                    className="font-mono text-xs text-[#d4c5b5]/80 bg-[#120a06] border border-[#f4ece1]/10 rounded-full px-3 py-0.5"
                  >
                    {note}
                  </span>
                ))}
              </div>

              {/* Right Column: Price & Actions */}
              <div className="flex items-center justify-between lg:justify-end gap-6">
                <div className="text-left lg:text-right">
                  <span className="font-mono text-[10px] text-[#8e7e72] uppercase block">PRICE</span>
                  <span className="font-serif text-2xl font-bold text-[#f4ece1]">₹{item.price}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onSelectProduct(item)}
                    className="flex items-center gap-1.5 rounded-full border border-[#f4ece1]/20 bg-[#1e130c] px-4 py-2 font-mono text-xs font-semibold text-[#f4ece1] transition-all hover:border-[#c67d3b] hover:bg-[#251810]"
                  >
                    <span>DETAILS</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#c67d3b]" />
                  </button>

                  <button
                    onClick={() => onAddToCart(item)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c67d3b] text-[#0f0a07] transition-all hover:bg-[#e09f3e] hover:scale-110 shadow-md"
                    title="Add to ritual selection"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
