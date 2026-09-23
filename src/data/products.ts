export interface Product {
  id: string
  name: string
  subtitle: string
  category: 'coffee' | 'tea'
  flavorNotes: string[]
  price: number
  origin: string
  elevation?: string
  roastLevel?: 'Light' | 'Medium' | 'Medium-Dark' | 'Dark'
  process?: string
  brewTemp: string
  brewTime: string
  body: string
  description: string
  accentColor: string
}

export const PRODUCTS: Product[] = [
  {
    id: 'signature-roast',
    name: 'Signature Estate Roast',
    subtitle: 'Washed Arabica · Chikmagalur, Karnataka',
    category: 'coffee',
    flavorNotes: ['Dark Chocolate', 'Caramelized Fig', 'Roasted Almond'],
    price: 320,
    origin: 'Bababudangiri Hills, Karnataka',
    elevation: '1,450 MASL',
    roastLevel: 'Medium-Dark',
    process: 'Double Washed',
    brewTemp: '93°C (199°F)',
    brewTime: '3 min 15 sec',
    body: 'Syrupy & velvety with long dark cacao finish',
    description: 'Our cornerstone single-estate roast, slowly developed to coax out dense fudge sweetness and nutty aromatics without bitter harshness.',
    accentColor: '#C67D3B',
  },
  {
    id: 'single-origin-espresso',
    name: 'Yirgacheffe Bloom Espresso',
    subtitle: 'Heirloom Varietals · Ethiopia',
    category: 'coffee',
    flavorNotes: ['Wild Blackberry', 'Cocoa Nibs', 'Bergamot Blossom'],
    price: 380,
    origin: 'Gedeo Zone, Yirgacheffe',
    elevation: '2,100 MASL',
    roastLevel: 'Light',
    process: 'Natural Sun-Dried',
    brewTemp: '94°C (201°F)',
    brewTime: '28 sec extraction',
    body: 'Luminous, tea-like clarity with sparkling acidity',
    description: 'An ethereal, fruit-forward espresso featuring explosive stone-fruit aromas and crisp citrus florals that melt into honey.',
    accentColor: '#E09F3E',
  },
  {
    id: 'slow-cold-brew',
    name: 'Bourbon Barrel Cold Brew',
    subtitle: 'Slow 18-hour Cold Steeping Blend',
    category: 'coffee',
    flavorNotes: ['Bourbon Vanilla', 'Charred Oak', 'Black Treacle'],
    price: 340,
    origin: 'Araku Valley, Eastern Ghats',
    elevation: '1,100 MASL',
    roastLevel: 'Dark',
    process: 'Anaerobic Honey',
    brewTemp: '4°C (Ice Drip)',
    brewTime: '18 hours slow drip',
    body: 'Heavy liqueur density, nearly zero astringency',
    description: 'Steeped drop-by-drop in ice-cold mountain spring water, yielding a deeply unctuous cordial with lingering woody sweetness.',
    accentColor: '#935626',
  },
  {
    id: 'artisan-cappuccino',
    name: 'Silk Velvet Cappuccino',
    subtitle: 'Micro-foamed Oat & Sweet Espresso',
    category: 'coffee',
    flavorNotes: ['Silky Microfoam', 'Raw Honey', 'Toasted Hazelnut'],
    price: 290,
    origin: 'Shevaroy Hills, Tamil Nadu',
    elevation: '1,380 MASL',
    roastLevel: 'Medium',
    process: 'Yellow Honey',
    brewTemp: '65°C microfoam',
    brewTime: '1 min assemble',
    body: 'Cushioned, marshmallow softness with roasty backbone',
    description: 'Crafted for morning harmony. Balanced espresso poured beneath a velvety mantle of micro-textured emulsion.',
    accentColor: '#D4A373',
  },
  {
    id: 'royal-masala-chai',
    name: 'Royal Heritage Masala Chai',
    subtitle: 'Upper Assam CTC & Sun-Dried Spices',
    category: 'tea',
    flavorNotes: ['Green Cardamom', 'Crushed Ginger', 'Ceylon Cinnamon'],
    price: 260,
    origin: 'Brahmaputra Valley, Assam',
    elevation: '120 MASL',
    process: 'CTC Orthodox Blend',
    brewTemp: '98°C simmering',
    brewTime: '5 min decoction',
    body: 'Robust, spicy, invigorating, and soul-warming',
    description: 'Crushed organic green cardamom pods, fiery dried ginger, whole cloves, and true cinnamon gently simmered in whole milk and unrefined jaggery.',
    accentColor: '#B05D3B',
  },
  {
    id: 'imperial-earl-grey',
    name: 'Imperial Bergamot Earl Grey',
    subtitle: 'High-grown Nilgiri Black Tea & Citrus',
    category: 'tea',
    flavorNotes: ['Calabrian Bergamot', 'Blue Cornflower', 'Malted Amber'],
    price: 280,
    origin: 'Blue Mountains, Nilgiri',
    elevation: '1,800 MASL',
    process: 'Orthodox Whole Leaf',
    brewTemp: '95°C (203°F)',
    brewTime: '3 min 30 sec',
    body: 'Crisp, aromatic, zesty with structured tannins',
    description: 'Hand-plucked high altitude black tea scented exclusively with cold-pressed oil of first-press Calabrian bergamot and dried petals.',
    accentColor: '#4A6B53',
  },
  {
    id: 'first-flush-green',
    name: 'Spring First Flush Green Tea',
    subtitle: 'Pan-fired Spring Shoots · Kangra Valley',
    category: 'tea',
    flavorNotes: ['Sweet Spring Grass', 'Steamed Chestnut', 'Marine Umami'],
    price: 310,
    origin: 'Dhauladhar Range, Kangra',
    elevation: '1,500 MASL',
    process: 'Gentle Pan-Fired',
    brewTemp: '80°C (176°F)',
    brewTime: '2 min infusion',
    body: 'Delicate, jade broth with silky lingering sweetness',
    description: 'Harvested over 72 golden hours in early spring when the tender buds awaken beneath melting Himalayan snow.',
    accentColor: '#587B54',
  },
  {
    id: 'ceremonial-matcha',
    name: 'Uji Ceremonial Stone-Ground Matcha',
    subtitle: 'Shade-Grown Tencha · Uji, Kyoto',
    category: 'tea',
    flavorNotes: ['Velvety Crema', 'White Chocolate Umami', 'Young Bamboo'],
    price: 380,
    origin: 'Uji River Valley, Kyoto',
    elevation: '250 MASL',
    process: 'Granite Stone Milled',
    brewTemp: '75°C (167°F)',
    brewTime: 'Chasen whisked 45 sec',
    body: 'Thick, creamy froth, vibrant emerald jade color',
    description: 'Shaded for 28 days under straw mats to concentrate theanine before slow milling on granite stones at 30 grams per hour.',
    accentColor: '#3A5A40',
  },
]

export interface FlavorNode {
  id: string
  name: string
  intensity: number
  color: string
  notes: string
  angle: number // degrees on radial chart
  category: 'coffee' | 'tea' | 'shared'
}

export const FLAVOR_NODES: FlavorNode[] = [
  { id: 'chocolate', name: 'CHOCOLATE', intensity: 92, color: '#4B2818', notes: '72% dark cocoa nibs, bakers fudge, toasted brownie crust', angle: 30, category: 'coffee' },
  { id: 'caramel', name: 'CARAMEL', intensity: 88, color: '#C67D3B', notes: 'Demerara sugar, roasted marshmallow, dulce de leche', angle: 90, category: 'coffee' },
  { id: 'nutty', name: 'NUTTY', intensity: 80, color: '#9C6644', notes: 'Roasted hazelnut, slivered almond, golden walnut skins', angle: 150, category: 'shared' },
  { id: 'citrus', name: 'CITRUS', intensity: 74, color: '#E09F3E', notes: 'Cold-pressed bergamot, candied Meyer lemon, dried mandarin peel', angle: 210, category: 'shared' },
  { id: 'floral', name: 'FLORAL', intensity: 84, color: '#6A8E72', notes: 'Jasmine blossom, wild blue cornflower, spring honeysuckle', angle: 270, category: 'tea' },
  { id: 'spiced', name: 'SPICED', intensity: 90, color: '#B05D3B', notes: 'Green cardamom pod, crushed ginger root, Sri Lankan cinnamon bark', angle: 330, category: 'tea' },
]
