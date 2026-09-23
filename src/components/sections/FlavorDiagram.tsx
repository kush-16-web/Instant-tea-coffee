import { useState } from 'react'
import { FLAVOR_NODES, type FlavorNode } from '../../data/products'

export function FlavorDiagram() {
  const [selectedNode, setSelectedNode] = useState<FlavorNode>(FLAVOR_NODES[0])

  // Center coordinate in SVG viewBox (500 x 500)
  const cx = 250
  const cy = 250
  const radius = 170

  return (
    <section id="flavor-radar" className="relative min-h-screen w-full flex items-center justify-center px-6 py-28 pointer-events-auto">
      <div className="mx-auto w-full max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#c67d3b]">
            TASTING ATLAS
          </span>
          <h2 className="mt-3 font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-[#f4ece1]">
            THE FLAVOR <span className="italic font-normal text-[#e09f3e]">SPECTRUM.</span>
          </h2>
          <p className="mt-4 font-sans text-base text-[#b8a898] max-w-lg">
            Hover each node to inspect aromatic compounds captured across both roasting stages and botanical tea infusions.
          </p>
        </div>

        {/* Central Radial SVG Tasting Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left/Main SVG Interactive Network */}
          <div className="lg:col-span-8 flex items-center justify-center">
            <div className="relative w-full max-w-[500px] aspect-square">
              <svg viewBox="0 0 500 500" className="w-full h-full overflow-visible">
                <defs>
                  {/* Radial Gradients for concentric reference rings */}
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c67d3b" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#e09f3e" stopOpacity="0.2" />
                  </linearGradient>
                </defs>

                {/* Subtle Concentric Guide Rings */}
                {[60, 115, 170].map((r, i) => (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke="#f4ece1"
                    strokeOpacity={0.06}
                    strokeDasharray={i === 2 ? '4 6' : 'none'}
                  />
                ))}

                {/* Connecting SVG Lines to each node */}
                {FLAVOR_NODES.map((node) => {
                  const rad = (node.angle * Math.PI) / 180
                  const nx = cx + Math.cos(rad) * radius
                  const ny = cy + Math.sin(rad) * radius
                  const isCurrent = selectedNode.id === node.id

                  return (
                    <g key={node.id}>
                      <line
                        x1={cx}
                        y1={cy}
                        x2={nx}
                        y2={ny}
                        stroke={isCurrent ? '#e09f3e' : '#f4ece1'}
                        strokeOpacity={isCurrent ? 0.8 : 0.15}
                        strokeWidth={isCurrent ? 2 : 1}
                        strokeDasharray={isCurrent ? 'none' : '3 3'}
                        className="transition-all duration-300"
                      />
                    </g>
                  )
                })}

                {/* Central Bean / Origin Hub */}
                <g className="cursor-pointer" onClick={() => setSelectedNode(FLAVOR_NODES[0])}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r="44"
                    fill="#1e120a"
                    stroke="#c67d3b"
                    strokeWidth="1.5"
                    className="transition-all duration-300 hover:scale-105"
                  />
                  <text
                    x={cx}
                    y={cy - 6}
                    textAnchor="middle"
                    fill="#f4ece1"
                    className="font-serif text-xs font-semibold tracking-wider select-none"
                  >
                    ROAST & LEAF
                  </text>
                  <text
                    x={cx}
                    y={cy + 12}
                    textAnchor="middle"
                    fill="#c67d3b"
                    className="font-mono text-[8px] uppercase tracking-widest select-none"
                  >
                    AROMATIC HUB
                  </text>
                </g>

                {/* Outer Interactive Flavor Nodes */}
                {FLAVOR_NODES.map((node) => {
                  const rad = (node.angle * Math.PI) / 180
                  const nx = cx + Math.cos(rad) * radius
                  const ny = cy + Math.sin(rad) * radius
                  const isCurrent = selectedNode.id === node.id

                  return (
                    <g
                      key={node.id}
                      className="cursor-pointer group"
                      onMouseEnter={() => setSelectedNode(node)}
                      onClick={() => setSelectedNode(node)}
                    >
                      {/* Active Pulse Outer Ring */}
                      {isCurrent && (
                        <circle
                          cx={nx}
                          cy={ny}
                          r="28"
                          fill="none"
                          stroke={node.color}
                          strokeWidth="1.5"
                          className="animate-ping"
                          style={{ animationDuration: '2.5s' }}
                        />
                      )}

                      {/* Node Body */}
                      <circle
                        cx={nx}
                        cy={ny}
                        r="22"
                        fill={isCurrent ? '#2a160d' : '#140c08'}
                        stroke={isCurrent ? '#e09f3e' : '#f4ece1'}
                        strokeOpacity={isCurrent ? 1 : 0.3}
                        strokeWidth={isCurrent ? 2 : 1}
                        className="transition-all duration-300 group-hover:scale-110"
                      />

                      {/* Node Intensity Dot */}
                      <circle
                        cx={nx}
                        cy={ny}
                        r="4"
                        fill={node.color}
                        className="transition-transform duration-300 group-hover:scale-125"
                      />

                      {/* Node Label Text */}
                      <text
                        x={nx}
                        y={ny > cy ? ny + 36 : ny - 28}
                        textAnchor="middle"
                        fill={isCurrent ? '#f4ece1' : '#b8a898'}
                        className={`font-mono text-[10px] uppercase font-bold tracking-[0.2em] select-none transition-colors duration-200 ${
                          isCurrent ? 'fill-[#e09f3e]' : ''
                        }`}
                      >
                        {node.name}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>

          {/* Right Column: Dynamic Flavor Inspector Card */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-[#c67d3b]/40 bg-[#160e0a]/90 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300">
              <div className="flex items-center justify-between border-b border-[#f4ece1]/10 pb-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#c67d3b]">
                  {selectedNode.category.toUpperCase()} SPECTRUM
                </span>
                <span className="font-mono text-xs font-bold text-[#e09f3e]">
                  INTENSITY: {selectedNode.intensity}%
                </span>
              </div>

              <h3 className="mt-5 font-serif text-3xl md:text-4xl font-normal text-[#f4ece1]">
                {selectedNode.name}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-[#c7b7a7]">
                {selectedNode.notes}
              </p>

              {/* Intensity Bar */}
              <div className="mt-6">
                <div className="flex justify-between font-mono text-[10px] text-[#8e7e72] mb-1.5 uppercase">
                  <span>Palate Prominence</span>
                  <span>{selectedNode.intensity} / 100</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#2a170d]">
                  <div
                    className="h-full transition-all duration-500 ease-out"
                    style={{
                      width: `${selectedNode.intensity}%`,
                      backgroundColor: selectedNode.color,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#f4ece1]/10 pt-4 font-mono text-[11px] text-[#b8a898]">
                <span>CATEGORY</span>
                <span className="text-[#f4ece1] font-semibold uppercase">{selectedNode.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
