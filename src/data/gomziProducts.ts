import attaImg from '../assets/atta.webp'
import attaSm from '../assets/atta-480.webp'
import teaImg from '../assets/tea.webp'
import teaSm from '../assets/tea-480.webp'
import mochaImg from '../assets/mocha.webp'
import mochaSm from '../assets/mocha-480.webp'
import logoImg from '../assets/logo.webp'

export interface GomziProduct {
  id: 'atta' | 'tea' | 'mocha'
  nav: string
  name: string
  subtitle: string
  bigName: string
  size: string
  netWeight: string
  price: number
  originalPrice: number
  rating: number
  reviewsCount: number
  image: string
  imageSm: string
  shape: 'pouch' | 'sachet'
  bulge: number
  colorVar: string
  themeColor: string
  accentColor: string
  secondaryAccent: string
  lede: string
  story: string
  stats: { value: number; decimals?: number; unit: string; label: string }[]
  keyFeatures: string[]
  ingredients: string[]
  sensoryNotes: { name: string; score: number }[]
  particleType: 'grains' | 'leaves' | 'beans'
  recommendedPairing: string
}

export const GOMZI_PRODUCTS: GomziProduct[] = [
  {
    id: 'atta',
    nav: 'Multi Grain Atta',
    name: 'Multi Grain Protein Atta',
    subtitle: '7-Grain Flour Infused with Whey & Plant Protein',
    bigName: 'MULTI GRAIN ATTA · HIGH PROTEIN · FRESH CHAKKI GROUND ·',
    size: '500 g pouch',
    netWeight: '500g (Makes ~22 Rotis)',
    price: 189,
    originalPrice: 240,
    rating: 4.9,
    reviewsCount: 342,
    image: attaImg,
    imageSm: attaSm,
    shape: 'pouch',
    bulge: 0.11,
    colorVar: '--atta',
    themeColor: '#171109',
    accentColor: '#E9B964',
    secondaryAccent: '#F3D28E',
    lede: 'Soft, golden rotis from a stone-milled multi-grain flour enriched with whey protein. Delivers twice the protein and dietary fibre of standard wheat without compromising softness or puff.',
    story: 'Milled from high-protein Sharbati wheat, defatted soy, roasted oats, ragi, barley, chana, and isolated whey. Created for daily families who want pure nutrition in every roti without pills or powders.',
    stats: [
      { value: 18.5, decimals: 1, unit: 'g', label: 'Protein / 100g' },
      { value: 9.2, decimals: 1, unit: 'g', label: 'Dietary Fibre' },
      { value: 0, decimals: 0, unit: '%', label: 'Preservatives' },
      { value: 100, decimals: 0, unit: '%', label: 'Soft Puffed Rotis' },
    ],
    keyFeatures: [
      '18.5g Protein per 100g (2x regular wheat)',
      'Rich in soluble fiber for prolonged satiety & gut health',
      'Stone-ground chakki fresh texture with natural sweet aroma',
      'Kneads with warm water just like traditional flour',
    ],
    ingredients: [
      'Sharbati Whole Wheat',
      'High-Grade Whey Protein Isolate',
      'Defatted Golden Soy Flour',
      'Roasted Whole Oats',
      'Sprouted Finger Millet (Ragi)',
      'Pearl Barley',
      'Roasted Bengal Gram (Chana)',
    ],
    sensoryNotes: [
      { name: 'Nutty Warmth', score: 92 },
      { name: 'Fluffy Softness', score: 96 },
      { name: 'Golden Toast', score: 88 },
      { name: 'Digestive Ease', score: 94 },
    ],
    particleType: 'grains',
    recommendedPairing: 'Hot Ghee, Dal Tadka or Paneer Bhurji',
  },
  {
    id: 'tea',
    nav: 'Spiced Protein Chai',
    name: 'Instant Ayurvedic Spiced Tea',
    subtitle: 'Kadak Masala Chai with 5 Raw Spices & Micro-Whey',
    bigName: 'SPICED TEA · AYURVEDIC CHAI · PURE WHEY BLEND ·',
    size: '14 g single-serve sachet',
    netWeight: '14g (1 Sachet = 1 Full Cup)',
    price: 35,
    originalPrice: 45,
    rating: 4.95,
    reviewsCount: 518,
    image: teaImg,
    imageSm: teaSm,
    shape: 'sachet',
    bulge: 0.07,
    colorVar: '--tea',
    themeColor: '#0E170A',
    accentColor: '#99D354',
    secondaryAccent: '#C8F38A',
    lede: 'Authentic royal masala chai crafted from Assam CTC leaves, cold-crushed ginger, green cardamom, Ceylon cinnamon, clove, and black pepper — balanced with micro-filtered whey protein.',
    story: 'No boiling saucepan needed. We micro-pulverize whole spices and Assam estate tea extracts with hydrolysed protein. Tear the sachet, pour 120ml steaming water, stir, and experience street-side kadak soul with athletic nutrition.',
    stats: [
      { value: 3.5, decimals: 1, unit: 'g', label: 'Clean Protein' },
      { value: 55, decimals: 0, unit: 'kcal', label: 'Clean Energy' },
      { value: 60, decimals: 0, unit: 'sec', label: 'Brew Time' },
      { value: 5, decimals: 0, unit: 'spices', label: 'Sacred Botanicals' },
    ],
    keyFeatures: [
      '3.5g Bioactive Whey Protein per cup',
      'Real sun-dried Ayurvedic spices (Ginger, Cardamom, Clove, Cinnamon)',
      'Zero refined sugar spikes — smooth natural sweetness',
      'Instant dissolution with velvety spiced foam head',
    ],
    ingredients: [
      'Upper Assam CTC Black Tea Extract',
      'Bio-Active Whey Protein Concentrate',
      'Sun-Dried Malabar Ginger',
      'Green Idukki Cardamom',
      'Ceylon True Cinnamon',
      'Cloves & Tellicherry Black Pepper',
      'Natural Skimmed Dairy Solid',
    ],
    sensoryNotes: [
      { name: 'Cardamom Zing', score: 95 },
      { name: 'Warm Ginger Kick', score: 90 },
      { name: 'Malty Body', score: 89 },
      { name: 'Creamy Mouthfeel', score: 93 },
    ],
    particleType: 'leaves',
    recommendedPairing: 'Morning reflection, rainy evenings, or mid-day slump',
  },
  {
    id: 'mocha',
    nav: 'Mocha Protein Coffee',
    name: 'Instant Mocha Dark Roast',
    subtitle: 'Single-Estate Arabica + Dutch Cocoa + Protein Fusion',
    bigName: 'MOCHA COFFEE · DARK ROAST ARABICA · DUTCH COCOA ·',
    size: '14 g single-serve sachet',
    netWeight: '14g (Hot or Cold soluble)',
    price: 38,
    originalPrice: 50,
    rating: 4.92,
    reviewsCount: 489,
    image: mochaImg,
    imageSm: mochaSm,
    shape: 'sachet',
    bulge: 0.07,
    colorVar: '--mocha',
    themeColor: '#170E08',
    accentColor: '#D48B47',
    secondaryAccent: '#F3B479',
    lede: 'A deeply aromatic union of slow-roasted Chikmagalur Arabica, rich alkalized Dutch cocoa, and premium whey protein. Silky, invigorating, and completely soluble in hot milk or iced shaker water.',
    story: 'Designed for high performers who refuse to choose between their morning specialty coffee ritual and their post-workout protein macros. Creamy, dark chocolate undertones melt into bold espresso without any chalky residue.',
    stats: [
      { value: 5.0, decimals: 0, unit: 'g', label: 'Pure Protein' },
      { value: 58, decimals: 0, unit: 'kcal', label: 'Sustained Energy' },
      { value: 2, decimals: 0, unit: 'ways', label: 'Hot or Iced Cold' },
      { value: 100, decimals: 0, unit: '%', label: 'Arabica & Cocoa' },
    ],
    keyFeatures: [
      '5.0g Premium Whey Protein per single sachet',
      'Chikmagalur Single-Estate Arabica + Dutch Dark Cocoa',
      'Dual preparation: dissolves instantly hot or over ice cubes',
      'Zero chalkiness — micro-emulsified for cafe-grade velvet crema',
    ],
    ingredients: [
      'Spray-Dried Arabica Coffee Extract',
      'Micro-Filtered Whey Protein Isolate',
      'Alkalized Dutch Cocoa Powder',
      'Natural Vanilla Bean Extract',
      'Organic Coconut Milk Emulsifier',
      'Trace Himalayan Rock Salt',
    ],
    sensoryNotes: [
      { name: 'Dark Fudge', score: 94 },
      { name: 'Espresso Roast', score: 91 },
      { name: 'Silky Crema', score: 96 },
      { name: 'Clean Finish', score: 90 },
    ],
    particleType: 'beans',
    recommendedPairing: 'Pre-workout focus booster or afternoon indulgence',
  },
]

export const NUTRITION_LAB = [
  {
    nutrient: 'Protein',
    unit: 'g',
    atta: 18.5,
    attaStandard: 9.8,
    tea: 3.5,
    teaStandard: 0.4,
    mocha: 5.0,
    mochaStandard: 0.6,
    highlight: true,
  },
  {
    nutrient: 'Dietary Fibre',
    unit: 'g',
    atta: 9.2,
    attaStandard: 3.4,
    tea: 0.8,
    teaStandard: 0.0,
    mocha: 1.2,
    mochaStandard: 0.1,
    highlight: true,
  },
  {
    nutrient: 'Added Sugar',
    unit: 'g',
    atta: 0.0,
    attaStandard: 0.0,
    tea: 4.8,
    teaStandard: 12.0,
    mocha: 4.2,
    mochaStandard: 14.5,
    highlight: false,
  },
  {
    nutrient: 'Energy',
    unit: 'kcal',
    atta: 348,
    attaStandard: 360,
    tea: 55,
    teaStandard: 85,
    mocha: 58,
    mochaStandard: 95,
    highlight: false,
  },
  {
    nutrient: 'Total Fat',
    unit: 'g',
    atta: 2.1,
    attaStandard: 1.8,
    tea: 1.0,
    teaStandard: 3.2,
    mocha: 1.8,
    mochaStandard: 4.1,
    highlight: false,
  },
  {
    nutrient: 'Calcium',
    unit: 'mg',
    atta: 65,
    attaStandard: 30,
    tea: 85,
    teaStandard: 20,
    mocha: 110,
    mochaStandard: 25,
    highlight: false,
  },
]

export const PREPARATION_RITUALS = {
  tea: {
    id: 'tea',
    title: 'The 60-Second Kadak Chai Ritual',
    steps: [
      {
        num: '01',
        title: 'Tear & Release',
        instruction: 'Tear along the notched top seal of the sachet into your favourite mug.',
        detail: 'Inhales immediate notes of sun-dried cardamom and freshly ground ginger.',
      },
      {
        num: '02',
        title: 'Pour 120ml Hot Water',
        instruction: 'Pour 120ml to 140ml of freshly boiled water (ideal temp: 85°C – 90°C).',
        detail: 'Watch the micro-whey froth bloom into a golden aromatic decoction.',
      },
      {
        num: '03',
        title: 'Stir & Savor',
        instruction: 'Stir vigorously with a spoon for 8 seconds until completely smooth.',
        detail: 'A soul-warming chai with 3.5g clean protein in every sip.',
      },
    ],
  },
  mocha: {
    id: 'mocha',
    title: 'The Hot & Iced Velvet Mocha Protocol',
    steps: [
      {
        num: '01',
        title: 'Choose Hot or Iced',
        instruction: 'Pour 180ml of hot milk/water OR fill a glass with ice cubes & cold milk.',
        detail: 'Engineered with cold-soluble whey isolate that dissolves without clumps.',
      },
      {
        num: '02',
        title: 'Add Single Sachet',
        instruction: 'Empty one entire 14g sachet of Instant Mocha Coffee over the liquid.',
        detail: 'Single-estate Chikmagalur Arabica paired with dark alkalized Dutch cocoa.',
      },
      {
        num: '03',
        title: 'Froth or Shake',
        instruction: 'Whisk with a frother or shake for 12 seconds in a bottle.',
        detail: 'Delivers a thick cafe-style crema and 5g of sustained protein energy.',
      },
    ],
  },
  atta: {
    id: 'atta',
    title: 'The Golden Multigrain Kneading Ritual',
    steps: [
      {
        num: '01',
        title: 'Measure & Sift',
        instruction: 'Take 2 cups of Gomzi Protein Atta in your mixing bowl. Add a pinch of salt.',
        detail: 'Milled from 7 whole grains with higher natural moisture retention.',
      },
      {
        num: '02',
        title: 'Knead with Warm Water',
        instruction: 'Add lukewarm water gradually. Knead for 3 to 4 minutes into a pliable dough.',
        detail: 'Rest the dough for 10 minutes covered with a damp muslin cloth.',
      },
      {
        num: '03',
        title: 'Roll & Puff on Tawa',
        instruction: 'Roll evenly and cook on medium-hot cast iron tawa until ballooned.',
        detail: 'Yields pillowy soft rotis that remain supple for up to 12 hours.',
      },
    ],
  },
}

export const TRINITY_BUNDLE = {
  id: 'daily-trinity-bundle',
  name: 'The Daily Gomzi Trinity Pack',
  subtitle: 'Atta (500g) + Spiced Tea (10 Sachets) + Mocha Coffee (10 Sachets)',
  badge: '15% BUNDLE SAVINGS',
  price: 789,
  originalPrice: 930,
  savings: 141,
  description: 'Your complete morning-to-night nutritional upgrade. Fuel your breakfast rotis with 18.5g protein, energize your midday with Spiced Chai, and power your workouts with Dark Mocha.',
  perks: [
    '1x 500g Multi Grain Protein Atta pouch (~22 rotis)',
    '10x 14g Instant Spiced Tea single sachets',
    '10x 14g Instant Mocha Coffee single sachets',
    'Complimentary Gomzi Airtight Storage Tin',
    'Free Express Doorstep Shipping',
  ],
}

export { logoImg }
