import type { Item, User, Transaction, InventoryManifest, ActivityLog, Alert, Notification } from '@/types';

export const AVATARS = {
  julian: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop',
  sterling: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
  sarah: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
};

export const SEED_USERS: User[] = [
  { id: 'u1', name: 'Julian Vane', email: 'julian@sru.edu.in', password: 'ZGVtbzEyMw==', role: 'student', avatar: AVATARS.julian, loyaltyPoints: 1240, loyaltyTier: 'Gold Archivist', joinedAt: '2024-01-15' },
  { id: 'u2', name: 'M. Sterling', email: 'sterling@retcom.edu', password: 'ZGVtbzEyMw==', role: 'admin', avatar: AVATARS.sterling, loyaltyPoints: 0, loyaltyTier: 'Admin', joinedAt: '2023-06-01' },
  { id: 'u3', name: 'Sarah Chen', email: 'sarah@retcom.edu', password: 'ZGVtbzEyMw==', role: 'manager', avatar: AVATARS.sarah, loyaltyPoints: 0, loyaltyTier: 'Manager', joinedAt: '2023-09-10' },
];

const IMG = {
  camera: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop',
  watch: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop',
  books: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop',
  typewriter: 'https://images.unsplash.com/photo-1504691342899-4d92b50853e1?w=500&h=500&fit=crop',
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
  microscope: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&h=500&fit=crop',
  hoodie: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop',
  compass: 'https://images.unsplash.com/photo-1504164996022-09080787b6b3?w=500&h=500&fit=crop',
  pen: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&h=500&fit=crop',
  laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop',
  lamp: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=500&h=500&fit=crop',
  backpack: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
  journal: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&h=500&fit=crop',
  globe: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=500&h=500&fit=crop',
  magnifier: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500&h=500&fit=crop',
  vinyl: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=500&h=500&fit=crop',
  keyboard: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop',
  chair: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&h=500&fit=crop',
  goggles: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=500&h=500&fit=crop',
  map: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=500&h=500&fit=crop',
  bag: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop',
  physics: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&h=500&fit=crop',
  lens: 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=500&h=500&fit=crop',
  server: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=350&fit=crop',
};

export const SEED_ITEMS: Item[] = [
  { id: 'i1', name: 'Olympus OM-1n Vintage', category: 'electronics', price: 1240, condition: 'good', year: 1975, description: 'Original 1970s SLR body with Zuiko 50mm lens. Tested and fully functional mechanical shutter.', sellerId: 'u1', sellerName: 'CURATOR_SMITH', images: [IMG.camera], stock: 3, status: 'in_stock', provenance: 'Tokyo Exchange', createdAt: '2024-10-01', reported: false, rating: 4.5 },
  { id: 'i2', name: 'Braul Bauhaus Edition', category: 'electronics', price: 4800, condition: 'like_new', year: 1960, description: 'Limited run minimalist chronometer. Original box and archive papers included.', sellerId: 'u1', sellerName: 'TEMPORAL_VAULT', images: [IMG.watch], stock: 1, status: 'in_stock', provenance: 'Berlin Archives', createdAt: '2024-09-20', reported: false, rating: 4.8 },
  { id: 'i3', name: 'Archival Leather Journal', category: 'media', price: 650, condition: 'fair', year: 2010, description: 'Hand-stitched calfskin, blank acid-free pages. Shows significant but beautiful patina.', sellerId: 'u1', sellerName: 'SCRIBE_OMEGA', images: [IMG.journal], stock: 5, status: 'in_stock', provenance: 'Merchant Row', createdAt: '2024-10-05', reported: false, rating: 3.9 },
  { id: 'i4', name: 'Remington No. 5', category: 'electronics', price: 2900, condition: 'good', year: 1930, description: 'Classic portable typewriter. All keys clear, ribbon recently replaced. Pristine case included.', sellerId: 'u1', sellerName: 'THE_TYPIST', images: [IMG.typewriter], stock: 1, status: 'low_stock', provenance: 'London Archives', createdAt: '2024-08-15', reported: false, rating: 4.7 },
  { id: 'i5', name: 'Aurum Sonic MK II', category: 'electronics', price: 1150, condition: 'like_new', year: 2022, description: 'Audiophile grade open-back headphones with mahogany finish. Exceptional clarity.', sellerId: 'u1', sellerName: 'AUDIO_ARCHIVE', images: [IMG.headphones], stock: 8, status: 'in_stock', provenance: 'Vienna Exchange', createdAt: '2024-10-10', reported: false, rating: 4.6 },
  { id: 'i6', name: 'Advanced Physics: Vol II', category: 'books', price: 45, condition: 'good', year: 2020, description: 'University-level textbook covering quantum mechanics and thermodynamics. Minor highlighting.', sellerId: 'u1', sellerName: 'SCHOLAR_PRIME', images: [IMG.physics], stock: 0, status: 'out_of_stock', provenance: 'Campus Library', createdAt: '2024-07-01', reported: false, rating: 4.2 },
  { id: 'i7', name: 'Precision Optical Lens Set', category: 'lab_gear', price: 120, condition: 'like_new', year: 2023, description: 'Professional-grade microscope lens kit. 4x, 10x, 40x, 100x objectives in padded case.', sellerId: 'u1', sellerName: 'LAB_MASTER', images: [IMG.microscope], stock: 12, status: 'in_stock', provenance: 'SR Labs', createdAt: '2024-09-28', reported: false, rating: 4.4 },
  { id: 'i8', name: 'SR Uni Heritage Hoodie', category: 'apparel', price: 55, condition: 'new', year: 2024, description: 'Official SR University merch. Premium cotton blend with embroidered crest. Size M-XL.', sellerId: 'u3', sellerName: 'CAMPUS_STORE', images: [IMG.hoodie], stock: 2, status: 'restock', provenance: 'Campus Store', createdAt: '2024-10-12', reported: false, rating: 4.0 },
  { id: 'i9', name: 'Cartier Fountain Pen', category: 'media', price: 3200, condition: 'good', year: 1935, description: 'Art Deco era fountain pen with gold nib. Fully restored with new ink bladder.', sellerId: 'u1', sellerName: 'PEN_COLLECTOR', images: [IMG.pen], stock: 1, status: 'in_stock', provenance: 'Parisian Exchange', createdAt: '2024-06-20', reported: false, rating: 4.9 },
  { id: 'i10', name: 'Silver Engraved Compasses', category: 'lab_gear', price: 1800, condition: 'good', year: 1890, description: 'Victorian-era navigation compass with ornate silver casing. Still magnetically true.', sellerId: 'u1', sellerName: 'NAVIGATOR', images: [IMG.compass], stock: 1, status: 'low_stock', provenance: 'London Archives', createdAt: '2024-05-10', reported: false, rating: 4.8 },
  { id: 'i11', name: 'Vintage Magnifier', category: 'lab_gear', price: 450, condition: 'good', year: 1950, description: 'Brass-handled magnifying glass with crystal lens. Museum-quality optics.', sellerId: 'u1', sellerName: 'OPTICS_GUILD', images: [IMG.magnifier], stock: 3, status: 'in_stock', provenance: 'Amsterdam Exchange', createdAt: '2024-10-08', reported: false, rating: 4.3 },
  { id: 'i12', name: 'Underwood Keycap', category: 'electronics', price: 380, condition: 'fair', year: 1940, description: 'Salvaged keycap set from Underwood Standard. Bakelite construction, minor wear.', sellerId: 'u1', sellerName: 'KEY_SMITH', images: [IMG.keyboard], stock: 6, status: 'in_stock', provenance: 'NYC Archives', createdAt: '2024-09-01', reported: false, rating: 3.5 },
  { id: 'i13', name: 'ThinkPad X1 Carbon', category: 'electronics', price: 890, condition: 'good', year: 2022, description: 'Gen 10, i7-1260P, 16GB RAM, 512GB SSD. Excellent condition, minor keyboard shine.', sellerId: 'u1', sellerName: 'TECH_VAULT', images: [IMG.laptop], stock: 1, status: 'in_stock', provenance: 'Campus Exchange', createdAt: '2024-10-15', reported: false, rating: 4.6 },
  { id: 'i14', name: 'Victorian Desk Lamp', category: 'furniture', price: 890, condition: 'good', year: 1910, description: 'Brass banker\'s lamp with green glass shade. Original wiring replaced for safety.', sellerId: 'u1', sellerName: 'ANTIQUE_LIGHT', images: [IMG.lamp], stock: 2, status: 'in_stock', provenance: 'Berlin Archives', createdAt: '2024-08-20', reported: false, rating: 4.4 },
  { id: 'i15', name: 'Explorer Field Pack', category: 'apparel', price: 175, condition: 'like_new', year: 2023, description: 'Waxed canvas backpack with leather straps. 30L capacity, water resistant.', sellerId: 'u1', sellerName: 'FIELD_SUPPLY', images: [IMG.backpack], stock: 4, status: 'in_stock', provenance: 'Alpine Exchange', createdAt: '2024-09-15', reported: false, rating: 4.2 },
  { id: 'i16', name: 'Terrestrial Globe', category: 'furniture', price: 560, condition: 'good', year: 1965, description: 'Mid-century desk globe with brass meridian ring. Political boundaries of the era.', sellerId: 'u1', sellerName: 'CARTOGRAPHER', images: [IMG.globe], stock: 1, status: 'low_stock', provenance: 'Geneva Exchange', createdAt: '2024-07-30', reported: false, rating: 4.1 },
  { id: 'i17', name: 'Chromatic Vinyl Collection', category: 'media', price: 340, condition: 'good', year: 1978, description: 'Curated set of 12 jazz LPs. Original pressings, sleeves in good condition.', sellerId: 'u1', sellerName: 'VINYL_SAGE', images: [IMG.vinyl], stock: 1, status: 'in_stock', provenance: 'Memphis Exchange', createdAt: '2024-10-02', reported: false, rating: 4.7 },
  { id: 'i18', name: 'Archival Map Set (1920s)', category: 'media', price: 2100, condition: 'fair', year: 1924, description: 'Set of 6 topographical maps covering Central Europe. Linen-backed, some foxing.', sellerId: 'u1', sellerName: 'MAP_KEEPER', images: [IMG.map], stock: 1, status: 'in_stock', provenance: 'Vienna Archives', createdAt: '2024-04-15', reported: false, rating: 4.5 },
  { id: 'i19', name: 'Lab Protective Goggles', category: 'lab_gear', price: 95, condition: 'new', year: 2024, description: 'Anti-fog, UV-resistant lab goggles. Adjustable strap, meets ANSI Z87.1 standard.', sellerId: 'u3', sellerName: 'SAFETY_FIRST', images: [IMG.goggles], stock: 25, status: 'in_stock', provenance: 'SR Labs', createdAt: '2024-10-20', reported: false, rating: 4.0 },
  { id: 'i20', name: 'SR Campus Tote Bag', category: 'merchandise', price: 35, condition: 'new', year: 2024, description: 'Heavy-duty canvas tote with SR University branding. Internal pocket, reinforced handles.', sellerId: 'u3', sellerName: 'CAMPUS_STORE', images: [IMG.bag], stock: 15, status: 'in_stock', provenance: 'Campus Store', createdAt: '2024-10-18', reported: false, rating: 3.8 },
  { id: 'i21', name: 'Ergonomic Desk Chair', category: 'furniture', price: 420, condition: 'good', year: 2021, description: 'Mesh back, adjustable lumbar support, 4D armrests. Some wear on seat cushion.', sellerId: 'u1', sellerName: 'OFFICE_GUILD', images: [IMG.chair], stock: 2, status: 'in_stock', provenance: 'Campus Exchange', createdAt: '2024-09-05', reported: false, rating: 4.3 },
  { id: 'i22', name: 'Leather Field Journal', category: 'media', price: 450, condition: 'like_new', year: 2023, description: 'Hand-bound leather journal with 200 acid-free pages. Includes brass clasp closure.', sellerId: 'u1', sellerName: 'BOOKBINDER', images: [IMG.journal], stock: 4, status: 'in_stock', provenance: 'Merchant Row', createdAt: '2024-10-11', reported: false, rating: 4.6 },
  { id: 'i23', name: 'Astronomical Field Guide', category: 'books', price: 75, condition: 'good', year: 2019, description: 'Comprehensive stargazing guide with fold-out star charts. 3rd edition, minor shelf wear.', sellerId: 'u1', sellerName: 'STAR_GAZER', images: [IMG.books], stock: 6, status: 'in_stock', provenance: 'Campus Library', createdAt: '2024-08-25', reported: false, rating: 4.1 },
  { id: 'i24', name: 'Copper Wire Headset', category: 'electronics', price: 780, condition: 'good', year: 2021, description: 'Planar magnetic headphones with copper cabling. Reference-grade sound stage.', sellerId: 'u1', sellerName: 'AUDIO_ARCHIVE', images: [IMG.headphones], stock: 2, status: 'in_stock', provenance: 'Tokyo Exchange', createdAt: '2024-10-03', reported: false, rating: 4.5 },
];

export const SEED_TRANSACTIONS: Transaction[] = [
  { id: '#RC-1924-01', buyerId: 'u1', itemId: 'i9', itemName: 'Cartier Fountain Pen (1930s)', status: 'in_transit', provenance: 'Parisian Exchange', amount: 3200, createdAt: '2024-10-18' },
  { id: '#RC-1924-02', buyerId: 'u1', itemId: 'i10', itemName: 'Silver Engraved Compasses', status: 'authenticated', provenance: 'London Archives', amount: 1800, createdAt: '2024-10-15' },
  { id: '#RC-1924-03', buyerId: 'u1', itemId: 'i22', itemName: 'Leather Field Journal (Blank)', status: 'delivered', provenance: 'Merchant Row', amount: 450, createdAt: '2024-10-10' },
  { id: '#RC-1924-04', buyerId: 'u1', itemId: 'i1', itemName: 'Olympus OM-1n Vintage', status: 'pending', provenance: 'Tokyo Exchange', amount: 1240, createdAt: '2024-10-20' },
  { id: '#RC-1924-05', buyerId: 'u1', itemId: 'i14', itemName: 'Victorian Desk Lamp', status: 'delivered', provenance: 'Berlin Archives', amount: 890, createdAt: '2024-09-28' },
];

export const SEED_INVENTORY: InventoryManifest[] = [
  { referenceId: '#RTC-1924-A', name: 'Handcrafted Oak Archive Cabinet', status: 'stable', valuation: 4250 },
  { referenceId: '#RTC-2023-B', name: 'Neural Data Spool - V-Type', status: 'in_transit', valuation: 12800 },
  { referenceId: '#RTC-0812-X', name: 'Gilded Brass Telemetry Kit', status: 'low_stock', valuation: 1450 },
  { referenceId: '#RTC-4491-K', name: 'Obsidian Interface Console', status: 'stable', valuation: 22100 },
];

export const SEED_ALERTS: Alert[] = [
  { id: 'a1', type: 'stock_depletion', title: 'STOCK DEPLETION', message: 'Industrial Solder - Batch 04 is below critical threshold (2 units remaining).', timestamp: '12 MINUTES AGO' },
  { id: 'a2', type: 'manifest_update', title: 'MANIFEST UPDATE', message: 'Incoming shipment #RTC-991 identified at sorting hub Alpha.', timestamp: '1 HOUR AGO' },
];

export const SEED_ACTIVITY: ActivityLog[] = [
  { id: 'al1', message: 'Admin updated asset #RTC-1924-A valuation.', highlight: '"M. Sterling"', type: 'admin', timestamp: '08:42 AM' },
  { id: 'al2', message: 'Automated log: Daily archive synchronization complete.', type: 'system', timestamp: '04:00 AM' },
  { id: 'al3', message: 'New requisition request approved for', highlight: 'Workshop Gamma', type: 'user', timestamp: 'Yesterday' },
];

export const SEED_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Item Shipped', message: 'Cartier Fountain Pen is now in transit.', type: 'info', read: false, createdAt: '2024-10-18' },
  { id: 'n2', title: 'Authentication Complete', message: 'Silver Engraved Compasses verified authentic.', type: 'success', read: false, createdAt: '2024-10-15' },
  { id: 'n3', title: 'Restock Alert', message: 'SR Uni Heritage Hoodie back in stock soon.', type: 'warning', read: true, createdAt: '2024-10-12' },
];

export const YIELD_DATA = [
  { month: 'JAN', primary: 58, secondary: 38 },
  { month: 'FEB', primary: 72, secondary: 52 },
  { month: 'MAR', primary: 85, secondary: 62 },
  { month: 'APR', primary: 64, secondary: 48 },
  { month: 'MAY', primary: 50, secondary: 35 },
  { month: 'JUN', primary: 58, secondary: 42 },
];

export const COMMAND_STATS = [
  { label: 'TOTAL REVENUE', value: '$142,850', sub: '+12.4% from archive', icon: 'trending' },
  { label: 'ACTIVE ASSETS', value: '1,204', sub: '98% Utilization', icon: 'package' },
  { label: 'LOGISTICS DELTA', value: '-4.2ms', sub: 'Efficiency Optimized', icon: 'zap' },
  { label: 'RISK QUOTIENT', value: '0.02%', sub: 'Secure Protocol', icon: 'shield' },
];
