const svgDataUrl = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const artwork = (
  title: string,
  accent: string,
  backdrop: string,
  motif: string,
) =>
  svgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="bg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${backdrop}" />
          <stop offset="100%" stop-color="#111725" />
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#bg)" />
      <circle cx="920" cy="210" r="190" fill="${accent}" opacity="0.18" />
      <circle cx="250" cy="690" r="240" fill="${accent}" opacity="0.14" />
      <rect x="90" y="90" width="1020" height="720" rx="56" fill="rgba(255,255,255,0.04)" stroke="${accent}" stroke-opacity="0.32" />
      <text x="110" y="200" fill="#F5F0E8" font-family="Georgia, serif" font-size="78">${title}</text>
      <text x="112" y="280" fill="#E8C97A" font-family="Arial, sans-serif" font-size="34" letter-spacing="5">${motif}</text>
      <path d="M760 280c90 0 170 70 170 170s-80 170-170 170-170-70-170-170 80-170 170-170Z" fill="${accent}" opacity="0.22"/>
      <path d="M720 360h80c48 0 88 40 88 88v8c0 48-40 88-88 88h-80c-48 0-88-40-88-88v-8c0-48 40-88 88-88Z" fill="rgba(255,255,255,0.08)" stroke="${accent}" stroke-opacity="0.48" />
      <path d="M220 540h360" stroke="${accent}" stroke-width="14" stroke-linecap="round" />
      <path d="M220 596h290" stroke="#F5F0E8" stroke-opacity="0.72" stroke-width="10" stroke-linecap="round" />
      <path d="M220 642h220" stroke="#F5F0E8" stroke-opacity="0.45" stroke-width="10" stroke-linecap="round" />
    </svg>
  `);

const phoneFrame = (accent: string, label: string) =>
  svgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1600">
      <rect width="900" height="1600" rx="96" fill="#F5F0E8" />
      <rect x="70" y="110" width="760" height="1380" rx="70" fill="#EDE3D0" />
      <rect x="120" y="220" width="660" height="300" rx="48" fill="${accent}" opacity="0.88" />
      <rect x="120" y="570" width="320" height="220" rx="38" fill="#8C6B4B" opacity="0.9" />
      <rect x="460" y="570" width="320" height="220" rx="38" fill="#A4815E" opacity="0.88" />
      <rect x="120" y="850" width="660" height="110" rx="40" fill="#FFFFFF" />
      <rect x="120" y="1010" width="660" height="110" rx="40" fill="#FFFFFF" />
      <rect x="120" y="1170" width="660" height="110" rx="40" fill="#FFFFFF" />
      <text x="120" y="180" fill="#6A4C38" font-family="Arial, sans-serif" font-size="46">${label}</text>
    </svg>
  `);

export type Review = {
  id: string;
  author: string;
  date: string;
  rating: number;
  text: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortBlurb: string;
  descriptionHtml: string;
  images: string[];
  youtubeUrls: string[];
  originalPriceInr: number;
  priceInr: number;
  originalPriceUsd: number;
  priceUsd: number;
  likes: number;
  downloads: number;
  avgRating: number;
  reviewCount: number;
  status: "active" | "hidden";
  reviews: Review[];
};

export type Order = {
  id: string;
  buyerName: string;
  email: string;
  productId: string;
  amount: number;
  currency: "INR" | "USD";
  paymentMethod: string;
  status: "completed" | "processing" | "refunded";
  date: string;
};

export const siteSettings = {
  logoUrl: svgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <defs>
        <linearGradient id="g" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="#E8C97A" />
          <stop offset="100%" stop-color="#C9A84C" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="100" fill="#16213E" />
      <circle cx="100" cy="100" r="85" fill="url(#g)" opacity="0.14" />
      <path d="M64 140V58h34c29 0 44 14 44 35 0 18-10 29-29 33l32 14H113l-27-12H82v12H64Zm18-28h17c15 0 24-6 24-17 0-10-8-16-24-16H82v33Z" fill="#F5F0E8" />
    </svg>
  `),
  siteName: "Royal Vault",
  tagline: "Premium digital assets for founders, creators, and modern studios.",
  accentColor: "#C9A84C",
  backgroundColor: "#1A1A2E",
  textColor: "#F5F0E8",
  fontPair: "Playfair Display + DM Sans",
};

export const sliderImages = [
  {
    id: "slide-1",
    imageUrl: artwork("Launch Faster", "#C9A84C", "#1F3558", "PREMIUM KITS"),
    title: "Digital products with a luxury storefront feel",
    subtitle: "Templates, UI kits, strategy decks, and polished resource bundles.",
  },
  {
    id: "slide-2",
    imageUrl: artwork("Royal Craft", "#E8C97A", "#25385B", "DESIGN SYSTEMS"),
    title: "Build a beautiful catalog with rich media storytelling",
    subtitle: "Hero banners, interactive cards, elegant typography, and conversion cues.",
  },
  {
    id: "slide-3",
    imageUrl: artwork("Member Library", "#C9A84C", "#23304C", "SIGNED DOWNLOADS"),
    title: "Protect premium files with secure private delivery",
    subtitle: "A front-end flow designed for auth, purchases, and gated downloads.",
  },
];

const defaultReviews: Review[] = [
  {
    id: "rev-1",
    author: "Aarav Singh",
    date: "May 15, 2026",
    rating: 5,
    text: "Elegant, practical, and easy to adapt. The structure saved us days of work.",
  },
  {
    id: "rev-2",
    author: "Sophia Grant",
    date: "May 8, 2026",
    rating: 4,
    text: "Thoughtful details throughout. I especially liked the layered product storytelling.",
  },
  {
    id: "rev-3",
    author: "Mila Chen",
    date: "April 29, 2026",
    rating: 5,
    text: "Very polished bundle. The presentation style feels premium without being heavy.",
  },
];

export const products: Product[] = [
  {
    id: "prod-1",
    name: "Creator Launch Blueprint",
    slug: "creator-launch-blueprint",
    category: "Strategy",
    shortBlurb: "A premium planning system for shipping paid digital offers with confidence.",
    descriptionHtml:
      "<h2>What is inside</h2><p>A polished launch framework with planning sheets, positioning prompts, and offer architecture for modern digital businesses.</p><ul><li>Offer strategy worksheets</li><li>Audience messaging prompts</li><li>Launch calendar and checklist</li></ul><p><strong>Best for:</strong> consultants, creators, educators, and boutique agencies.</p>",
    images: [
      artwork("Creator Launch Blueprint", "#C9A84C", "#273A5C", "STRATEGY SYSTEM"),
      artwork("Offer Mapping", "#E8C97A", "#314667", "MESSAGE LAB"),
      phoneFrame("#C9A84C", "Launch dashboard"),
    ],
    youtubeUrls: ["https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"],
    originalPriceInr: 3999,
    priceInr: 3499,
    originalPriceUsd: 56,
    priceUsd: 49,
    likes: 392,
    downloads: 1840,
    avgRating: 4.8,
    reviewCount: 128,
    status: "active",
    reviews: defaultReviews,
  },
  {
    id: "prod-2",
    name: "Royal Commerce UI Kit",
    slug: "royal-commerce-ui-kit",
    category: "Design",
    shortBlurb: "A refined mobile and desktop shopping interface kit with editorial polish.",
    descriptionHtml:
      "<h2>Designed for premium storefronts</h2><p>This UI kit includes home, product, cart, checkout, auth, and account screens with flexible styling foundations.</p><p><a href='#'>Includes layered card patterns</a>, conversion sections, and reusable interaction states.</p>",
    images: [
      artwork("Royal Commerce UI Kit", "#C9A84C", "#1E2A46", "MOBILE + WEB"),
      phoneFrame("#B38757", "Product details"),
      phoneFrame("#A37445", "Library access"),
    ],
    youtubeUrls: [],
    originalPriceInr: 4999,
    priceInr: 4299,
    originalPriceUsd: 68,
    priceUsd: 59,
    likes: 521,
    downloads: 2125,
    avgRating: 4.9,
    reviewCount: 143,
    status: "active",
    reviews: defaultReviews,
  },
  {
    id: "prod-3",
    name: "Founder Pitch Deck Archive",
    slug: "founder-pitch-deck-archive",
    category: "Presentations",
    shortBlurb: "Investor-ready slides with premium layouts, financial pages, and storytelling prompts.",
    descriptionHtml:
      "<h2>Boardroom-ready storytelling</h2><p>Craft a crisp, high-trust narrative with elegant charts, pricing frames, roadmap slides, and proof sections.</p><h3>Why teams love it</h3><p>It balances clarity with a distinct premium look.</p>",
    images: [
      artwork("Founder Pitch Deck Archive", "#D7B566", "#203251", "BOARDROOM STORY"),
      artwork("Financial Frames", "#C9A84C", "#304462", "ELEGANT NUMBERS"),
    ],
    youtubeUrls: ["https://www.youtube.com/embed/ysz5S6PUM-U?autoplay=0"],
    originalPriceInr: 3199,
    priceInr: 2799,
    originalPriceUsd: 45,
    priceUsd: 39,
    likes: 214,
    downloads: 980,
    avgRating: 4.6,
    reviewCount: 87,
    status: "active",
    reviews: defaultReviews,
  },
  {
    id: "prod-4",
    name: "Membership Portal Starter",
    slug: "membership-portal-starter",
    category: "Productivity",
    shortBlurb: "A structured portal concept for courses, memberships, downloads, and client libraries.",
    descriptionHtml:
      "<h2>Private access, polished experience</h2><p>Includes account dashboards, gated download concepts, and library-first navigation built for digital delivery.</p>",
    images: [
      phoneFrame("#8A6242", "Member dashboard"),
      artwork("Membership Portal Starter", "#E8C97A", "#243552", "PRIVATE ACCESS"),
    ],
    youtubeUrls: [],
    originalPriceInr: 3699,
    priceInr: 3199,
    originalPriceUsd: 52,
    priceUsd: 45,
    likes: 164,
    downloads: 720,
    avgRating: 4.7,
    reviewCount: 64,
    status: "active",
    reviews: defaultReviews,
  },
  {
    id: "prod-5",
    name: "Luxury Email Swipe Vault",
    slug: "luxury-email-swipe-vault",
    category: "Marketing",
    shortBlurb: "Conversion-focused email flows for launches, delivery, onboarding, and upsells.",
    descriptionHtml:
      "<h2>Write with more clarity and cadence</h2><p>A rich set of adaptable email sequences with premium tone cues and segmentation notes.</p>",
    images: [
      artwork("Luxury Email Swipe Vault", "#D2A85B", "#2E3B57", "EMAIL FLOWS"),
      artwork("Welcome Sequences", "#E8C97A", "#2B304E", "AUTOMATION"),
    ],
    youtubeUrls: [],
    originalPriceInr: 1799,
    priceInr: 1499,
    originalPriceUsd: 26,
    priceUsd: 21,
    likes: 308,
    downloads: 1510,
    avgRating: 4.5,
    reviewCount: 112,
    status: "active",
    reviews: defaultReviews,
  },
  {
    id: "prod-6",
    name: "Executive Notion Suite",
    slug: "executive-notion-suite",
    category: "Systems",
    shortBlurb: "A command center for goals, deliverables, content pipelines, and premium client work.",
    descriptionHtml:
      "<h2>Designed for calm operations</h2><p>This bundle brings together decision dashboards, planning databases, and a clean executive rhythm.</p>",
    images: [
      artwork("Executive Notion Suite", "#C9A84C", "#212C44", "OPERATING SYSTEM"),
      phoneFrame("#946A48", "Weekly review"),
    ],
    youtubeUrls: [],
    originalPriceInr: 2899,
    priceInr: 2399,
    originalPriceUsd: 41,
    priceUsd: 34,
    likes: 447,
    downloads: 1886,
    avgRating: 4.8,
    reviewCount: 135,
    status: "active",
    reviews: defaultReviews,
  },
];

export const libraryItems = [
  {
    productId: "prod-2",
    purchasedAt: "May 21, 2026",
  },
  {
    productId: "prod-5",
    purchasedAt: "May 7, 2026",
  },
  {
    productId: "prod-1",
    purchasedAt: "April 17, 2026",
  },
];

export const cartSeed = ["prod-2", "prod-6"];

export const orders: Order[] = [
  {
    id: "ORD-2194",
    buyerName: "Sophia Howard",
    email: "sophia@example.com",
    productId: "prod-2",
    amount: 59,
    currency: "USD",
    paymentMethod: "Stripe",
    status: "completed",
    date: "May 26, 2026",
  },
  {
    id: "ORD-2191",
    buyerName: "Rahul Menon",
    email: "rahul@example.com",
    productId: "prod-1",
    amount: 3499,
    currency: "INR",
    paymentMethod: "Razorpay",
    status: "processing",
    date: "May 25, 2026",
  },
  {
    id: "ORD-2188",
    buyerName: "Nina Alvarez",
    email: "nina@example.com",
    productId: "prod-6",
    amount: 34,
    currency: "USD",
    paymentMethod: "Stripe",
    status: "completed",
    date: "May 23, 2026",
  },
];

export const dashboardStats = [
  { label: "Total Products", value: "24", detail: "18 active, 6 hidden" },
  { label: "Total Orders", value: "1,284", detail: "47 in the last 7 days" },
  { label: "Revenue", value: "₹3.8L / $14.2K", detail: "INR + USD split" },
  { label: "Total Users", value: "842", detail: "132 repeat buyers" },
];

export const appearanceFonts = [
  "Playfair Display + DM Sans",
  "Lora + Nunito",
  "Cormorant + Work Sans",
  "Libre Baskerville + Manrope",
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function getRelatedProducts(currentId: string) {
  return products.filter((product) => product.id !== currentId).slice(0, 4);
}

export function searchProducts(query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  return products
    .filter((product) => {
      return (
        product.name.toLowerCase().includes(normalized) ||
        product.category.toLowerCase().includes(normalized) ||
        product.shortBlurb.toLowerCase().includes(normalized)
      );
    })
    .slice(0, 5);
}

export function getProductDiscountPercentage(
  product: Pick<Product, "originalPriceInr" | "priceInr" | "originalPriceUsd" | "priceUsd">,
  currency: "INR" | "USD",
) {
  const original = currency === "INR" ? product.originalPriceInr : product.originalPriceUsd;
  const current = currency === "INR" ? product.priceInr : product.priceUsd;

  if (!original || original <= current) {
    return 0;
  }

  return Math.round(((original - current) / original) * 100);
}
