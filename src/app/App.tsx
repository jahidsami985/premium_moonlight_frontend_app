import { useState, useEffect, useRef } from "react";
import {
  Search, ShoppingBag, User, Heart, Menu, X, ChevronDown, ChevronRight,
  ChevronUp, Star, Truck, RotateCcw, Shield, Phone, Mail, MapPin,
  Instagram, Facebook, Youtube, Twitter, Minus, Plus, Trash2, ArrowRight,
  Tag, Flame, Sparkles, Clock, CheckCircle, Package, Eye, AlertCircle,
  Award, Users, Globe, Check, TrendingUp, MessageSquare, Home,
  SlidersHorizontal, Lock, CreditCard, Banknote, MapPinned,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type Page =
  | "home" | "shop" | "category" | "product" | "cart" | "checkout"
  | "empty-category" | "search" | "brands" | "brand-detail"
  | "login" | "register" | "account" | "wishlist"
  | "order-success" | "order-tracking"
  | "about" | "contact" | "faq" | "policy";

type Badge = "new" | "sale" | "trending" | "out-of-stock" | "exclusive";

interface Product {
  id: number; name: string; brand: string; price: number;
  originalPrice?: number; image: string; badge?: Badge;
  rating: number; reviews: number; colors: string[];
  category: string; inStock: boolean;
  sizes?: string[]; description?: string;
  fabric?: string; images?: string[];
}

interface CartItem { product: Product; qty: number; size: string; }
interface NavParams { category?: string; productId?: number; brand?: string; query?: string; }
type NavFn = (page: Page, params?: NavParams) => void;

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const ALL_PRODUCTS: Product[] = [
  { id: 1, name: "Embroidered Lawn 3-Piece", brand: "Gul Ahmed", price: 4800, originalPrice: 6500, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=650&fit=crop&auto=format", badge: "sale", rating: 4.7, reviews: 142, colors: ["#C2185B","#1a1a2e","#2d4a3e"], category: "Stitch Three Piece", inStock: true, sizes: ["XS","S","M","L","XL"], description: "Exquisitely crafted 3-piece lawn suit with hand-done embroidery on the front, back, and sleeves. Includes matching printed dupatta and embroidered trouser.", fabric: "100% Pure Lawn" },
  { id: 2, name: "Chiffon Bridal Lehenga", brand: "Maria B", price: 18500, image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&h=650&fit=crop&auto=format", badge: "exclusive", rating: 4.9, reviews: 87, colors: ["#C2185B","#d4af37","#ffffff"], category: "Wedding Collection", inStock: true, sizes: ["XS","S","M","L"], description: "Stunning bridal lehenga in soft chiffon with heavy stone work and zardosi embroidery. Perfect for the big day.", fabric: "Chiffon with Net Dupatta" },
  { id: 3, name: "Printed Karandi Suit", brand: "Khaadi", price: 3200, originalPrice: 3800, image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4057?w=500&h=650&fit=crop&auto=format", badge: "new", rating: 4.5, reviews: 63, colors: ["#3d2c1e","#1f2937","#C2185B"], category: "Stitch Two Piece", inStock: true, sizes: ["S","M","L","XL","XXL"] },
  { id: 4, name: "Digital Print Stitched Kurti", brand: "Sapphire", price: 2400, image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&h=650&fit=crop&auto=format", badge: "trending", rating: 4.6, reviews: 211, colors: ["#1e3a5f","#ffffff","#C2185B"], category: "Stitch One Piece", inStock: true, sizes: ["XS","S","M","L","XL"] },
  { id: 5, name: "Party Wear Sequin Gown", brand: "Sana Safinaz", price: 12800, originalPrice: 15000, image: "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=500&h=650&fit=crop&auto=format", badge: "sale", rating: 4.8, reviews: 56, colors: ["#1f2937","#C2185B","#d4af37"], category: "Party Wear", inStock: true, sizes: ["XS","S","M","L"] },
  { id: 6, name: "Floral Midi Dress", brand: "Sapphire", price: 3600, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=650&fit=crop&auto=format", badge: "new", rating: 4.4, reviews: 34, colors: ["#C2185B","#2d4a3e","#ffffff"], category: "Western Collection", inStock: true, sizes: ["XS","S","M","L","XL"] },
  { id: 7, name: "Embroidered Organza 2-Pc", brand: "Alkaram", price: 5500, originalPrice: 7200, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&h=650&fit=crop&auto=format", badge: "sale", rating: 4.3, reviews: 98, colors: ["#4a1a2e","#ffffff","#d4af37"], category: "Stitch Two Piece", inStock: false, sizes: ["S","M","L"] },
  { id: 8, name: "Pure Lawn Unstitched Set", brand: "Gul Ahmed", price: 2900, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500&h=650&fit=crop&auto=format", badge: "trending", rating: 4.7, reviews: 176, colors: ["#1a1a2e","#C2185B","#ffffff"], category: "Unstitched", inStock: true, sizes: [] },
  { id: 9, name: "Velvet Bridal Maxi", brand: "Maria B", price: 22000, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=650&fit=crop&auto=format", badge: "exclusive", rating: 4.9, reviews: 42, colors: ["#8b0039","#1a1a1a","#d4af37"], category: "Wedding Collection", inStock: true, sizes: ["XS","S","M","L"] },
  { id: 10, name: "Co-ord Set — Linen", brand: "Khaadi", price: 4100, originalPrice: 4800, image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&h=650&fit=crop&auto=format", badge: "sale", rating: 4.5, reviews: 89, colors: ["#C2185B","#f5f0e8","#1a1a1a"], category: "Western Collection", inStock: true, sizes: ["XS","S","M","L","XL"] },
  { id: 11, name: "Embroidered Kameez Shalwar", brand: "Gul Ahmed", price: 3800, image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&h=650&fit=crop&auto=format", badge: "new", rating: 4.6, reviews: 67, colors: ["#1e3a5f","#C2185B","#ffffff"], category: "Stitch Two Piece", inStock: true, sizes: ["S","M","L","XL"] },
  { id: 12, name: "Silk Party Gharara Set", brand: "Sana Safinaz", price: 9800, originalPrice: 11500, image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&h=650&fit=crop&auto=format", badge: "sale", rating: 4.8, reviews: 53, colors: ["#d4af37","#C2185B","#1a1a1a"], category: "Party Wear", inStock: true, sizes: ["XS","S","M","L"] },
  { id: 13, name: "Lawn Unstitched 3-Piece", brand: "Alkaram", price: 2100, image: "https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=500&h=650&fit=crop&auto=format", badge: "new", rating: 4.4, reviews: 121, colors: ["#2d4a3e","#C2185B","#ffffff"], category: "Unstitched", inStock: true, sizes: [] },
  { id: 14, name: "Casual Kurti with Palazzo", brand: "Sapphire", price: 2800, image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4057?w=500&h=650&fit=crop&auto=format", badge: "trending", rating: 4.3, reviews: 88, colors: ["#C2185B","#f5f0e8","#1a1a1a"], category: "Stitch Two Piece", inStock: true, sizes: ["XS","S","M","L","XL"] },
  { id: 15, name: "Chiffon Embroidered Top", brand: "Maria B", price: 3300, image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&h=650&fit=crop&auto=format", badge: "new", rating: 4.7, reviews: 44, colors: ["#C2185B","#1a1a1a","#d4af37"], category: "Stitch One Piece", inStock: true, sizes: ["XS","S","M","L"] },
  { id: 16, name: "Formal Blazer Suit", brand: "Khaadi", price: 6500, originalPrice: 7800, image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&h=650&fit=crop&auto=format", badge: "sale", rating: 4.6, reviews: 31, colors: ["#1a1a1a","#1e3a5f","#C2185B"], category: "Western Collection", inStock: true, sizes: ["S","M","L","XL"] },
];

const BRANDS_DATA = [
  { name: "Gul Ahmed", slug: "gul-ahmed", logo: "GA", bg: "#1a1a2e", count: 320, description: "Pakistan's leading textile and fashion brand since 1953.", founded: "1953", website: "gulahmed.com", categories: ["Lawn","Khaddar","Linen","Formal"] },
  { name: "Khaadi", slug: "khaadi", logo: "KH", bg: "#2d4a3e", count: 280, description: "Celebrating handcrafted heritage with contemporary fashion design.", founded: "1998", website: "khaadi.com", categories: ["Pret","Unstitched","Western","Home"] },
  { name: "Sapphire", slug: "sapphire", logo: "SA", bg: "#1e3a5f", count: 195, description: "Modern luxury fashion for the contemporary South Asian woman.", founded: "2014", website: "sapphireonline.pk", categories: ["Pret","Festive","Basics","Western"] },
  { name: "Alkaram", slug: "alkaram", logo: "AK", bg: "#4a1a2e", count: 240, description: "Premium fabric and fashion with intricate artisan craftsmanship.", founded: "1986", website: "alkaramstudio.com", categories: ["Lawn","Formal","Khaddar","Winter"] },
  { name: "Maria B", slug: "maria-b", logo: "MB", bg: "#3d2c1e", count: 165, description: "Bridal and luxury fashion redefined for the discerning woman.", founded: "1999", website: "mariab.pk", categories: ["Bridal","Luxury","Pret","Lawn"] },
  { name: "Sana Safinaz", slug: "sana-safinaz", logo: "SS", bg: "#1f2937", count: 210, description: "High fashion with impeccable quality — a heritage of elegance.", founded: "1989", website: "sanasafinaz.com", categories: ["Luxury","Bridal","Pret","Unstitched"] },
];

const CATEGORIES_DATA = [
  { label: "Stitch One Piece", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=380&fit=crop&auto=format", count: 87 },
  { label: "Stitch Two Piece", image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4057?w=300&h=380&fit=crop&auto=format", count: 124 },
  { label: "Stitch Three Piece", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=380&fit=crop&auto=format", count: 96 },
  { label: "Unstitched", image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=300&h=380&fit=crop&auto=format", count: 210 },
  { label: "Wedding Collection", image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=300&h=380&fit=crop&auto=format", count: 89 },
  { label: "Party Wear", image: "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=300&h=380&fit=crop&auto=format", count: 67 },
  { label: "Western Collection", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=380&fit=crop&auto=format", count: 56 },
];

const NAV_ITEMS: { label: string; page: Page; param?: string }[] = [
  { label: "Home", page: "home" },
  { label: "All Products", page: "shop" },
  { label: "Stitch One Piece", page: "category", param: "Stitch One Piece" },
  { label: "Stitch Two Piece", page: "category", param: "Stitch Two Piece" },
  { label: "Stitch Three Piece", page: "category", param: "Stitch Three Piece" },
  { label: "Unstitched", page: "category", param: "Unstitched" },
  { label: "Wedding Collection", page: "category", param: "Wedding Collection" },
  { label: "Party Wear", page: "category", param: "Party Wear" },
  { label: "Western Collection", page: "category", param: "Western Collection" },
  { label: "Brands", page: "brands" },
  { label: "Offers", page: "shop" },
];

const REVIEWS_DATA = [
  { name: "Fatima Malik", location: "Dhaka", rating: 5, text: "Absolutely stunning quality! The embroidery is so detailed and the fabric is premium. Will definitely order again.", product: "Embroidered Lawn 3-Piece", avatar: "FM", date: "2 days ago" },
  { name: "Nadia Islam", location: "Chittagong", rating: 5, text: "Got my wedding lehenga from here and I was blown away. Delivery was fast and packaging was beautiful. Highly recommend!", product: "Chiffon Bridal Lehenga", avatar: "NI", date: "1 week ago" },
  { name: "Sadia Rahman", location: "Sylhet", rating: 4, text: "Great selection of brands. The stitching quality on my kurti was perfect. Sizing was accurate to the chart.", product: "Digital Print Kurti", avatar: "SR", date: "2 weeks ago" },
];

const FAQ_DATA = [
  { category: "Orders & Delivery", items: [
    { q: "How long does delivery take?", a: "Standard delivery takes 3–5 business days within Dhaka and 5–7 days for other districts. Express delivery (1–2 days) is available for an additional charge." },
    { q: "Can I track my order?", a: "Yes! Once your order is shipped, you will receive an SMS and email with your tracking number. You can also track it from My Account > My Orders." },
    { q: "What are the delivery charges?", a: "Delivery is FREE on orders above ৳2,000. Orders below ৳2,000 have a flat delivery fee of ৳80 for Dhaka and ৳120 for outside Dhaka." },
  ]},
  { category: "Returns & Exchanges", items: [
    { q: "What is your return policy?", a: "We accept returns within 7 days of delivery for unused, unwashed items in their original packaging. Sale items are non-returnable." },
    { q: "How do I initiate a return?", a: "Go to My Account > My Orders > select the order > click 'Return Item'. Fill out the return form and our team will arrange a pickup within 2 business days." },
    { q: "How long does the refund take?", a: "Refunds are processed within 5–7 business days after we receive and inspect the returned item. Amount is credited to your original payment method." },
  ]},
  { category: "Payments", items: [
    { q: "What payment methods are accepted?", a: "We accept bKash, Nagad, credit/debit cards (Visa, Mastercard), and Cash on Delivery for select areas." },
    { q: "Is online payment safe?", a: "Yes. All payments are SSL-encrypted and processed through secure payment gateways. We never store your card information." },
    { q: "Can I pay in installments?", a: "Installment options are available through select credit cards. Look for the 'EMI Available' tag on eligible products." },
  ]},
];

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function BadgeChip({ badge }: { badge: Badge }) {
  const cfg: Record<Badge, { label: string; cls: string; icon: React.ReactNode }> = {
    new: { label: "NEW", cls: "bg-emerald-500", icon: <Sparkles className="w-2.5 h-2.5" /> },
    sale: { label: "SALE", cls: "bg-red-500", icon: <Tag className="w-2.5 h-2.5" /> },
    trending: { label: "TRENDING", cls: "bg-orange-500", icon: <Flame className="w-2.5 h-2.5" /> },
    "out-of-stock": { label: "SOLD OUT", cls: "bg-gray-400", icon: <Clock className="w-2.5 h-2.5" /> },
    exclusive: { label: "EXCLUSIVE", cls: "bg-[#C2185B]", icon: <Star className="w-2.5 h-2.5" /> },
  };
  const c = cfg[badge];
  return (
    <span className={`${c.cls} text-white text-[10px] font-semibold tracking-wider px-2 py-1 rounded-full flex items-center gap-1`}>
      {c.icon}{c.label}
    </span>
  );
}

function Breadcrumb({ items, navigate }: { items: { label: string; page?: Page; params?: NavParams }[]; navigate: NavFn }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#666] mb-6">
      <button onClick={() => navigate("home")} className="hover:text-[#C2185B] transition-colors flex items-center gap-1">
        <Home className="w-3 h-3" />Home
      </button>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3 opacity-40" />
          {item.page && i < items.length - 1 ? (
            <button onClick={() => navigate(item.page!, item.params)} className="hover:text-[#C2185B] transition-colors">{item.label}</button>
          ) : (
            <span className={i === items.length - 1 ? "text-[#1a1a1a] font-medium" : ""}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

function StarRow({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${sz} ${i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────────────────────────────────────
function ProductCard({ product, navigate, onAddToCart, wishlistIds, onToggleWishlist }: {
  product: Product; navigate: NavFn;
  onAddToCart: (p: Product) => void;
  wishlistIds: number[];
  onToggleWishlist: (id: number) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const liked = wishlistIds.includes(product.id);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;
  return (
    <div
      className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#e5e5e5] bg-white shadow-[0_12px_35px_rgba(17,17,17,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C2185B]/30 hover:shadow-[0_24px_60px_rgba(194,24,91,0.12)]"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#fafafa]">
        <img src={product.image} alt={product.name} onClick={() => navigate("product", { productId: product.id })} className={`h-full w-full object-cover transition-transform duration-500 ${hovered ? "scale-105" : "scale-100"}`} />
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="text-sm font-semibold tracking-[0.2em] text-white">OUT OF STOCK</span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badge && product.badge !== "out-of-stock" && <BadgeChip badge={product.badge} />}
          {discount && <span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-semibold text-white">-{discount}%</span>}
        </div>
        <button onClick={() => onToggleWishlist(product.id)} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:scale-110">
          <Heart className={`h-4 w-4 transition-colors ${liked ? "fill-[#C2185B] text-[#C2185B]" : "text-gray-400"}`} />
        </button>
        <div className={`absolute inset-x-0 bottom-0 flex transition-all duration-300 ${hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
          <button onClick={() => navigate("product", { productId: product.id })} className="flex-1 border-r border-[#e5e5e5] bg-white/95 py-2.5 text-[11px] font-semibold text-[#1a1a1a] transition-colors hover:bg-white">
            Quick View
          </button>
          {product.inStock && (
            <button onClick={() => onAddToCart(product)} className="flex-1 bg-[#C2185B] py-2.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#a3154e]">
              Add to Cart
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4" onClick={() => navigate("product", { productId: product.id })}>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C2185B]">{product.brand}</p>
        <h3 className="mb-1.5 line-clamp-2 text-sm font-semibold leading-tight text-[#1a1a1a]">{product.name}</h3>
        <p className="mb-2 text-xs text-[#999]">{product.category}</p>
        <div className="mb-2.5 flex items-center gap-1">
          <StarRow rating={product.rating} />
          <span className="text-xs text-[#666]">({product.reviews})</span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            <span className="text-sm font-bold text-[#1a1a1a]">৳{product.price.toLocaleString()}</span>
            {product.originalPrice && <span className="ml-2 text-xs text-[#999] line-through">৳{product.originalPrice.toLocaleString()}</span>}
          </div>
          <div className="flex gap-1">
            {product.colors.slice(0, 3).map((c, i) => (
              <div key={i} className="h-3.5 w-3.5 rounded-full border border-white shadow-sm" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
function FilterSidebar() {
  const [open, setOpen] = useState<Record<string, boolean>>({ categories: true, price: true, brands: true, size: false, color: false, availability: false });
  const [brandSearch, setBrandSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 25000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const toggle = (key: string) => setOpen(p => ({ ...p, [key]: !p[key] }));
  const toggleArr = (arr: string[], setArr: (v: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const brands = BRANDS_DATA.filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase()));
  const colorOptions = [
    { name: "Pink", hex: "#C2185B" }, { name: "Black", hex: "#111111" },
    { name: "White", hex: "#ffffff" }, { name: "Navy", hex: "#1e3a5f" },
    { name: "Gold", hex: "#d4af37" }, { name: "Green", hex: "#2d4a3e" },
  ];

  const AccHead = ({ label, k }: { label: string; k: string }) => (
    <button onClick={() => toggle(k)} className="flex items-center justify-between w-full py-3 text-sm font-semibold text-[#1a1a1a] hover:text-[#C2185B] transition-colors">
      {label}{open[k] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
    </button>
  );

  return (
    <aside className="w-60 shrink-0">
      <div className="sticky top-[73px] bg-white rounded-2xl border border-[#e5e5e5] p-5 space-y-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[#1a1a1a] text-sm">Filters</h3>
          <button className="text-xs text-[#C2185B] hover:underline font-medium">Clear All</button>
        </div>

        {/* Categories */}
        <div className="border-b border-[#e5e5e5]">
          <AccHead label="Category" k="categories" />
          {open.categories && (
            <div className="pb-3 space-y-2">
              {CATEGORIES_DATA.map(c => (
                <label key={c.label} className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="w-4 h-4 rounded border border-[#e5e5e5] group-hover:border-[#C2185B] flex items-center justify-center transition-colors bg-white">
                    <div className="w-2 h-2 rounded-sm bg-[#C2185B] opacity-0 group-hover:opacity-20 transition-opacity" />
                  </div>
                  <span className="text-xs text-[#444] group-hover:text-[#C2185B] transition-colors">{c.label}</span>
                  <span className="text-xs text-[#999] ml-auto">{c.count}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="border-b border-[#e5e5e5]">
          <AccHead label="Price Range" k="price" />
          {open.price && (
            <div className="pb-3">
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <p className="text-[10px] text-[#999] mb-1">Min (৳)</p>
                  <input type="number" value={priceRange[0]} onChange={e => setPriceRange([+e.target.value, priceRange[1]])} className="w-full border border-[#e5e5e5] rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#C2185B] transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-[#999] mb-1">Max (৳)</p>
                  <input type="number" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value])} className="w-full border border-[#e5e5e5] rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#C2185B] transition-colors" />
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[["Under ৳2K", 0, 2000], ["৳2K–5K", 2000, 5000], ["৳5K–10K", 5000, 10000], ["৳10K+", 10000, 25000]].map(([label, min, max]) => (
                  <button key={String(label)} onClick={() => setPriceRange([+min, +max])} className={`text-[10px] px-2.5 py-1 rounded-full border transition-colors ${priceRange[0] === min && priceRange[1] === max ? "bg-[#C2185B] text-white border-[#C2185B]" : "border-[#e5e5e5] text-[#666] hover:border-[#C2185B] hover:text-[#C2185B]"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Brands */}
        <div className="border-b border-[#e5e5e5]">
          <AccHead label="Brand" k="brands" />
          {open.brands && (
            <div className="pb-3">
              <div className="relative mb-2.5">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#999]" />
                <input value={brandSearch} onChange={e => setBrandSearch(e.target.value)} placeholder="Search brand..." className="w-full border border-[#e5e5e5] rounded-lg pl-7 pr-3 py-1.5 text-xs outline-none focus:border-[#C2185B] transition-colors" />
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {brands.map(b => (
                  <label key={b.slug} className="flex items-center gap-2.5 cursor-pointer group">
                    <div onClick={() => toggleArr(selectedBrands, setSelectedBrands, b.slug)} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedBrands.includes(b.slug) ? "bg-[#C2185B] border-[#C2185B]" : "border-[#e5e5e5] group-hover:border-[#C2185B]"}`}>
                      {selectedBrands.includes(b.slug) && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className="text-xs text-[#444] group-hover:text-[#C2185B] transition-colors">{b.name}</span>
                    <span className="text-xs text-[#999] ml-auto">{b.count}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Size */}
        <div className="border-b border-[#e5e5e5]">
          <AccHead label="Size" k="size" />
          {open.size && (
            <div className="pb-3 flex flex-wrap gap-1.5">
              {["XS","S","M","L","XL","XXL"].map(sz => (
                <button key={sz} onClick={() => toggleArr(selectedSizes, setSelectedSizes, sz)} className={`w-9 h-9 rounded-lg text-xs font-semibold border transition-colors ${selectedSizes.includes(sz) ? "bg-[#C2185B] text-white border-[#C2185B]" : "border-[#e5e5e5] text-[#444] hover:border-[#C2185B] hover:text-[#C2185B]"}`}>{sz}</button>
              ))}
            </div>
          )}
        </div>

        {/* Color */}
        <div className="border-b border-[#e5e5e5]">
          <AccHead label="Color" k="color" />
          {open.color && (
            <div className="pb-3 flex flex-wrap gap-2">
              {colorOptions.map(co => (
                <button key={co.name} onClick={() => toggleArr(selectedColors, setSelectedColors, co.name)} title={co.name} className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${selectedColors.includes(co.name) ? "border-[#C2185B] scale-110" : "border-white shadow-sm"}`} style={{ backgroundColor: co.hex }} />
              ))}
            </div>
          )}
        </div>

        {/* Availability */}
        <div>
          <AccHead label="Availability" k="availability" />
          {open.availability && (
            <div className="pb-3 space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div onClick={() => setInStockOnly(!inStockOnly)} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${inStockOnly ? "bg-[#C2185B] border-[#C2185B]" : "border-[#e5e5e5] group-hover:border-[#C2185B]"}`}>
                  {inStockOnly && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className="text-xs text-[#444]">In Stock Only</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-[#e5e5e5] group-hover:border-[#C2185B] flex items-center justify-center transition-colors" />
                <span className="text-xs text-[#444]">On Sale</span>
              </label>
            </div>
          )}
        </div>

        <button className="w-full mt-4 bg-[#C2185B] hover:bg-[#a3154e] text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">Apply Filters</button>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────────────────────────────────────
function Pagination({ total, current = 1 }: { total: number; current?: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button className="w-9 h-9 rounded-xl border border-[#e5e5e5] flex items-center justify-center text-[#666] hover:border-[#C2185B] hover:text-[#C2185B] transition-colors">
        <ChevronRight className="w-4 h-4 rotate-180" />
      </button>
      {Array.from({ length: total }).map((_, i) => (
        <button key={i} className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${i + 1 === current ? "bg-[#C2185B] text-white" : "border border-[#e5e5e5] text-[#666] hover:border-[#C2185B] hover:text-[#C2185B]"}`}>
          {i + 1}
        </button>
      ))}
      <button className="w-9 h-9 rounded-xl border border-[#e5e5e5] flex items-center justify-center text-[#666] hover:border-[#C2185B] hover:text-[#C2185B] transition-colors">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────────────────
function Navbar({ navigate, currentPage, cartCount, wishlistCount, searchQuery, setSearchQuery }: {
  navigate: NavFn; currentPage: Page; cartCount: number; wishlistCount: number;
  searchQuery: string; setSearchQuery: (q: string) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchRef.current?.value) {
      setSearchQuery(searchRef.current.value);
      navigate("search", { query: searchRef.current.value });
      setSearchOpen(false);
    }
  };

  return (
    <>
      <div className="border-b border-white/10 bg-[#111111] text-white">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em]">
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px]">Free delivery above ৳2,000</span>
          <span className="text-white/55">•</span>
          <span className="text-[#f7c1d5]">Eid collection is live</span>
          <span className="text-white/55">•</span>
          <span className="text-white/75">Easy returns within 7 days</span>
        </div>
      </div>

      <header className={`sticky top-0 z-30 border-b border-[#e5e5e5] bg-white/95 backdrop-blur transition-all duration-300 ${scrolled ? "shadow-[0_12px_35px_rgba(17,17,17,0.06)]" : "shadow-none"}`}>
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
          <div className="flex h-[74px] items-center justify-between gap-3 border-b border-[#f3edf0]">
            <button onClick={() => navigate("home")} className="flex shrink-0 items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#C2185B] shadow-[0_10px_25px_rgba(194,24,91,0.2)]">
                <span className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>M</span>
              </div>
              <span className="text-lg font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>
                Moonlight <span className="text-[#C2185B]">BD</span>
              </span>
            </button>

            <div className="hidden flex-1 justify-center md:flex">
              <div className="relative w-full max-w-xl">
                <Search className="absolute left-3.5 top-1/2 w-4 h-4 -translate-y-1/2 text-[#999]" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search products, brands, categories..."
                  onKeyDown={handleSearch}
                  className="w-full rounded-full border border-[#e5e5e5] bg-[#fafafa] py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder-[#999] focus:border-[#C2185B]/50"
                />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#fafafa] md:hidden" onClick={() => setSearchOpen(!searchOpen)}>
                <Search className="h-4 w-4" />
              </button>
              <button onClick={() => navigate("account")} className="hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#fafafa] sm:flex" title="Account">
                <User className="h-4 w-4 text-[#444] transition-colors hover:text-[#C2185B]" />
              </button>
              <button onClick={() => navigate("wishlist")} className="hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#fafafa] sm:flex" title="Wishlist">
                <Heart className="h-4 w-4 text-[#444] transition-colors hover:text-[#C2185B]" />
                {wishlistCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C2185B] text-[9px] font-bold text-white">{wishlistCount}</span>}
              </button>
              <button onClick={() => navigate("cart")} className="relative flex items-center gap-2 rounded-full bg-[#C2185B] px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#a3154e]">
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#111] text-[10px] font-bold text-white">{cartCount}</span>}
              </button>
              <button className="ml-1 flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#fafafa] lg:hidden" onClick={() => setMobileOpen(true)}>
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>

          <nav className="hidden h-11 items-center justify-center gap-1 lg:flex">
            {NAV_ITEMS.map(item => (
              <button
                key={item.label}
                onClick={() => navigate(item.page, item.param ? { category: item.param } : undefined)}
                className={`h-full rounded-full px-3.5 text-[12.5px] font-semibold whitespace-nowrap transition-all ${currentPage === item.page ? "bg-[#fff3f7] text-[#C2185B]" : "text-[#444] hover:bg-[#fafafa] hover:text-[#C2185B]"}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {searchOpen && (
          <div className="border-t border-[#e5e5e5] bg-white px-4 py-2 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
              <input autoFocus type="text" placeholder="Search..." onKeyDown={handleSearch} className="w-full rounded-full border border-[#e5e5e5] bg-[#fafafa] py-2.5 pl-9 pr-10 text-sm outline-none focus:border-[#C2185B]/50" />
              <button onClick={() => setSearchOpen(false)} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="h-4 w-4 text-[#999]" /></button>
            </div>
          </div>
        )}
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5e5e5] p-5">
              <span className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>Moonlight <span className="text-[#C2185B]">BD</span></span>
              <button onClick={() => setMobileOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fafafa]"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {NAV_ITEMS.map(item => (
                <button key={item.label} onClick={() => { navigate(item.page, item.param ? { category: item.param } : undefined); setMobileOpen(false); }} className="flex w-full items-center justify-between px-5 py-3 text-sm font-medium text-[#1a1a1a] transition-colors hover:bg-[#fff3f7] hover:text-[#C2185B]">
                  {item.label}<ChevronRight className="h-4 w-4 opacity-30" />
                </button>
              ))}
            </div>
            <div className="space-y-2 border-t border-[#e5e5e5] p-4">
              <button onClick={() => { navigate("account"); setMobileOpen(false); }} className="flex w-full items-center gap-3 rounded-xl bg-[#fafafa] px-4 py-2.5 text-sm font-medium"><User className="h-4 w-4 text-[#C2185B]" />My Account</button>
              <button onClick={() => { navigate("wishlist"); setMobileOpen(false); }} className="flex w-full items-center gap-3 rounded-xl bg-[#fafafa] px-4 py-2.5 text-sm font-medium"><Heart className="h-4 w-4 text-[#C2185B]" />Wishlist</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────
function Footer({ navigate }: { navigate: NavFn }) {
  const col = (title: string, links: { label: string; page: Page }[]) => (
    <div>
      <h4 className="text-xs font-bold tracking-widest text-white/40 uppercase mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map(l => (
          <li key={l.label}><button onClick={() => navigate(l.page)} className="text-xs text-white/60 hover:text-white transition-colors text-left">{l.label}</button></li>
        ))}
      </ul>
    </div>
  );
  return (
    <footer className="bg-[#0a0a0a] text-white">
      <div className="max-w-[1440px] mx-auto px-6 pt-14 pb-6">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 mb-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[#C2185B] flex items-center justify-center"><span className="text-white text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>M</span></div>
              <span className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>Moonlight <span className="text-[#C2185B]">BD</span></span>
            </div>
            <p className="text-white/50 text-xs leading-relaxed mb-4">Bangladesh&apos;s premier multi-brand fashion destination. Premium quality, curated style from top South Asian brands.</p>
            <div className="flex gap-2.5 mb-5">
              {[{ icon: <Instagram className="w-3.5 h-3.5" />, label: "Instagram" }, { icon: <Facebook className="w-3.5 h-3.5" />, label: "Facebook" }, { icon: <Youtube className="w-3.5 h-3.5" />, label: "YouTube" }, { icon: <Twitter className="w-3.5 h-3.5" />, label: "Twitter" }].map(s => (
                <a key={s.label} href="#" aria-label={s.label} className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#C2185B] flex items-center justify-center transition-colors">{s.icon}</a>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Our Outlets</p>
              <p className="text-xs text-white/50">Dhaka: Bashundhara City, Level 4</p>
              <p className="text-xs text-white/50">Chittagong: Millennium Gate, GF</p>
            </div>
          </div>
          {col("Customer Service", [{ label: "My Account", page: "account" }, { label: "Track My Order", page: "order-tracking" }, { label: "FAQ", page: "faq" }, { label: "Contact Us", page: "contact" }, { label: "About Us", page: "about" }])}
          {col("Collections", [{ label: "New Arrivals", page: "shop" }, { label: "Wedding Collection", page: "category" }, { label: "Party Wear", page: "category" }, { label: "Western Collection", page: "category" }, { label: "Offers", page: "shop" }])}
          {col("Policies", [{ label: "Privacy Policy", page: "policy" }, { label: "Terms of Use", page: "policy" }, { label: "Refund Policy", page: "policy" }, { label: "Shipping Policy", page: "policy" }])}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-white/40 uppercase mb-4">Contact Us</h4>
            <div className="space-y-2.5">
              {[{ icon: <Phone className="w-3 h-3" />, text: "+880 1700-000000" }, { icon: <Mail className="w-3 h-3" />, text: "support@moonlightbd.com" }, { icon: <MapPin className="w-3 h-3" />, text: "Dhaka, Bangladesh" }].map(c => (
                <div key={c.text} className="flex items-center gap-2"><span className="text-[#C2185B]">{c.icon}</span><span className="text-xs text-white/50">{c.text}</span></div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">© 2025 Moonlight BD. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {["bKash", "Nagad", "Visa", "Mastercard", "COD"].map(p => (
              <span key={p} className="text-[10px] font-bold text-white/40 bg-white/5 border border-white/10 px-2 py-1 rounded">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE LAYOUT WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
function PageLayout({ children, navigate, currentPage, cartCount, wishlistCount, searchQuery, setSearchQuery }: {
  children: React.ReactNode; navigate: NavFn; currentPage: Page;
  cartCount: number; wishlistCount: number; searchQuery: string; setSearchQuery: (q: string) => void;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "var(--font-body)" }}>
      <Navbar navigate={navigate} currentPage={currentPage} cartCount={cartCount} wishlistCount={wishlistCount} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="flex-1">{children}</main>
      <Footer navigate={navigate} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────────────────────────
function HomePage({ navigate, onAddToCart, wishlistIds, onToggleWishlist }: {
  navigate: NavFn; onAddToCart: (p: Product) => void; wishlistIds: number[]; onToggleWishlist: (id: number) => void;
}) {
  const [activeCategory, setActiveCategory] = useState("All");

  const productCats = ["All", ...Array.from(new Set(ALL_PRODUCTS.map(p => p.category)))];
  const filtered = activeCategory === "All" ? ALL_PRODUCTS.slice(0, 8) : ALL_PRODUCTS.filter(p => p.category === activeCategory).slice(0, 8);

  return (
    <>
      <section className="relative flex min-h-[620px] items-center overflow-hidden bg-[#111]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&h=1100&fit=crop&auto=format)" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111]/95 via-[#111]/75 to-[#111]/30" />
        <div className="relative z-10 mx-auto grid w-full max-w-[1440px] items-center gap-10 px-6 py-20 lg:grid-cols-[1.05fr_0.75fr] lg:py-24">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C2185B]/40 bg-[#C2185B]/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#f8d5e2]">
              <Sparkles className="h-3 w-3" />Eid Collection 2025 — Now Live
            </div>
            <h1 className="mb-5 text-white" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem,5vw,4rem)", lineHeight: 1.1, fontWeight: 400 }}>
              Elevated fashion for <span className="text-[#f5a8c0]">modern celebration</span>
            </h1>
            <p className="mb-8 max-w-xl text-base leading-relaxed text-white/75">Discover premium stitched sets, unstitched luxury, bridal favourites, and everyday elegance curated for the Moonlight BD wardrobe.</p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate("shop")} className="rounded-full bg-[#C2185B] px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition-all hover:bg-[#a3154e] hover:shadow-lg hover:shadow-[#C2185B]/30">Shop Now</button>
              <button onClick={() => navigate("brands")} className="rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/60">Explore Collections</button>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 sm:gap-8">
              {[{ n: "1,200+", l: "Products" }, { n: "50+", l: "Brands" }, { n: "25K+", l: "Happy Customers" }].map(s => (
                <div key={s.l}><div className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>{s.n}</div><div className="mt-0.5 text-xs text-white/50">{s.l}</div></div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="rounded-[32px] border border-white/15 bg-white/10 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.2)] backdrop-blur-md">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f8d5e2]">This Week’s Edit</p>
              <div className="rounded-[24px] bg-[#fff3f7] p-4 text-[#1a1a1a]">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold">Bridal Glow</span>
                  <span className="rounded-full bg-[#C2185B] px-2.5 py-1 text-[10px] font-semibold text-white">New</span>
                </div>
                <p className="text-sm leading-relaxed text-[#666]">Soft embroidery, luxe fabrics, and statement silhouettes made for your most special moments.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e5e5e5] bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-3">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[{ icon: <Truck className="h-4 w-4" />, label: "Free Delivery", sub: "On orders ৳2,000+" }, { icon: <RotateCcw className="h-4 w-4" />, label: "Easy Returns", sub: "7-day return policy" }, { icon: <Shield className="h-4 w-4" />, label: "Secure Payment", sub: "SSL encrypted" }, { icon: <Phone className="h-4 w-4" />, label: "24/7 Support", sub: "Always here for you" }].map(t => (
              <div key={t.label} className="flex items-center gap-3 rounded-2xl bg-[#fafafa] px-3 py-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff3f7] text-[#C2185B]">{t.icon}</div>
                <div><p className="text-xs font-semibold text-[#1a1a1a]">{t.label}</p><p className="text-xs text-[#666]">{t.sub}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fafafa] py-12">
        <div className="mx-auto max-w-[1440px] px-6">
          <div className="mb-7 flex items-end justify-between">
            <div><p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#C2185B]">Explore</p><h2 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>Featured Categories</h2></div>
            <button onClick={() => navigate("shop")} className="hidden items-center gap-1.5 text-sm font-semibold text-[#C2185B] transition-all hover:gap-3 sm:flex">View All <ArrowRight className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {CATEGORIES_DATA.map(cat => (
              <button key={cat.label} onClick={() => navigate("category", { category: cat.label })} className="group relative aspect-[2/3] overflow-hidden rounded-[24px] bg-[#e5e5e5] transition-all duration-300 hover:shadow-lg">
                <img src={cat.image} alt={cat.label} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                  <p className="text-[11px] font-bold leading-tight text-white">{cat.label}</p>
                  <p className="text-[10px] text-white/60">{cat.count} items</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-[1440px] px-6">
          <div className="mb-7 flex items-end justify-between">
            <div><p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#C2185B]">Why Moonlight</p><h2 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>A refined shopping experience</h2></div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[{ title: "Curated by style", body: "Every collection blends premium craftsmanship with modern silhouettes for effortless dressing." }, { title: "Trusted fashion brands", body: "Shop authentic pieces from established names with flexible sizing and polished presentation." }, { title: "Seamless checkout", body: "From discovery to delivery, every step is designed to feel calm, clear, and premium." }].map(item => (
              <div key={item.title} className="rounded-[24px] border border-[#e5e5e5] bg-[#fafafa] p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#fff3f7] text-[#C2185B]"><Sparkles className="h-4 w-4" /></div>
                <h3 className="mb-2 text-base font-semibold text-[#1a1a1a]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#666]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-end justify-between mb-7">
            <div><p className="text-xs font-semibold text-[#C2185B] uppercase tracking-widest mb-1.5"><Flame className="w-3 h-3 inline mr-1" />Trending</p><h2 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>Top Trending</h2></div>
            <button onClick={() => navigate("shop")} className="flex items-center gap-1.5 text-sm font-semibold text-[#C2185B] hover:gap-3 transition-all">View All <ArrowRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {ALL_PRODUCTS.filter(p => p.badge === "trending").slice(0, 4).concat(ALL_PRODUCTS.filter(p => p.badge !== "trending")).slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} navigate={navigate} onAddToCart={onAddToCart} wishlistIds={wishlistIds} onToggleWishlist={onToggleWishlist} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-12 bg-[#fafafa] border-y border-[#e5e5e5]">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-end justify-between mb-7">
            <div><p className="text-xs font-semibold text-[#C2185B] uppercase tracking-widest mb-1.5">Top Brands</p><h2 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>Featured Brands</h2></div>
            <button onClick={() => navigate("brands")} className="flex items-center gap-1.5 text-sm font-semibold text-[#C2185B] hover:gap-3 transition-all">All Brands <ArrowRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {BRANDS_DATA.slice(0, 4).map(brand => (
              <button key={brand.slug} onClick={() => navigate("brand-detail", { brand: brand.slug })} className="group relative rounded-2xl overflow-hidden p-6 flex flex-col items-center justify-center gap-3 aspect-square hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: brand.bg }}>
                <div className="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center text-white text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{brand.logo}</div>
                <p className="text-white font-bold text-sm text-center">{brand.name}</p>
                <p className="text-white/60 text-xs">{brand.count}+ Products</p>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 bg-white">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-end justify-between mb-7">
            <div><p className="text-xs font-semibold text-[#C2185B] uppercase tracking-widest mb-1.5"><Sparkles className="w-3 h-3 inline mr-1" />Fresh In</p><h2 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>New Arrivals</h2></div>
            <button onClick={() => navigate("shop")} className="flex items-center gap-1.5 text-sm font-semibold text-[#C2185B] hover:gap-3 transition-all">View All <ArrowRight className="w-4 h-4" /></button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            {productCats.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${activeCategory === cat ? "bg-[#C2185B] text-white shadow-md shadow-[#C2185B]/20" : "bg-[#fafafa] border border-[#e5e5e5] text-[#666] hover:border-[#C2185B]/40 hover:text-[#C2185B]"}`}>{cat}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} navigate={navigate} onAddToCart={onAddToCart} wishlistIds={wishlistIds} onToggleWishlist={onToggleWishlist} />
            ))}
          </div>
        </div>
      </section>

      {/* Offer Collection */}
      <section className="py-12 bg-[#fafafa]">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-end justify-between mb-7">
            <div><p className="text-xs font-semibold text-[#C2185B] uppercase tracking-widest mb-1.5"><Tag className="w-3 h-3 inline mr-1" />On Sale</p><h2 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>Offer Collection</h2></div>
            <button onClick={() => navigate("shop")} className="flex items-center gap-1.5 text-sm font-semibold text-[#C2185B] hover:gap-3 transition-all">View All <ArrowRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {ALL_PRODUCTS.filter(p => p.badge === "sale").slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} navigate={navigate} onAddToCart={onAddToCart} wishlistIds={wishlistIds} onToggleWishlist={onToggleWishlist} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Spotlight Banner */}
      <section className="py-6 bg-white">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="rounded-2xl bg-gradient-to-r from-[#C2185B] to-[#8b0039] p-10 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute right-24 bottom-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
            <div className="relative z-10 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-3"><Tag className="w-3 h-3" />BRAND SPOTLIGHT — MARIA B</div>
              <h2 className="text-white text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>The Bridal Edit 2025</h2>
              <p className="text-white/80 text-sm">Exclusive wedding and formal collection — now available on Moonlight BD.</p>
            </div>
            <button onClick={() => navigate("brand-detail", { brand: "maria-b" })} className="relative z-10 shrink-0 bg-white text-[#C2185B] hover:bg-[#fff3f7] px-8 py-3.5 rounded-full font-bold text-sm tracking-wide transition-colors shadow-lg">Shop Maria B</button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-12 bg-[#fafafa]">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center mb-9">
            <p className="text-xs font-semibold text-[#C2185B] uppercase tracking-widest mb-1.5">Reviews</p>
            <h2 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
              <span className="text-sm text-[#666]">4.8 out of 5 — 2,400+ reviews</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {REVIEWS_DATA.map(r => (
              <div key={r.name} className="bg-white rounded-2xl p-6 border border-[#e5e5e5] hover:border-[#C2185B]/20 hover:shadow-lg hover:shadow-[#C2185B]/5 transition-all">
                <div className="flex mb-3">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />)}</div>
                <p className="text-sm text-[#444] leading-relaxed mb-4">&ldquo;{r.text}&rdquo;</p>
                <p className="text-xs text-[#999] mb-4 italic">— on {r.product}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#C2185B] text-white text-xs font-bold flex items-center justify-center">{r.avatar}</div>
                  <div><p className="text-sm font-semibold text-[#1a1a1a]">{r.name}</p><p className="text-xs text-[#999]">{r.location} · {r.date}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social bar */}
      <section className="py-10 bg-white border-y border-[#e5e5e5]">
        <div className="max-w-[1440px] mx-auto px-6 text-center">
          <p className="text-xs font-semibold text-[#C2185B] uppercase tracking-widest mb-2">Follow Us</p>
          <h2 className="text-xl font-bold text-[#1a1a1a] mb-5" style={{ fontFamily: "var(--font-display)" }}>@moonlightbd on Instagram</h2>
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 mb-5">
            {["photo-1490481651871-ab68de25d43d","photo-1583391733956-6c78276477e2","photo-1610030469983-98e550d6193c","photo-1566174053879-31528523f8ae","photo-1559839734-2b71ea197ec2","photo-1621072156002-e2fccdc0b176","photo-1572804013309-59a88b7e92f1","photo-1585487000160-6ebcfceb0d03"].map((id, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-[#fafafa] group cursor-pointer relative">
                <img src={`https://images.unsplash.com/${id}?w=200&h=200&fit=crop&auto=format`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-[#C2185B]/0 group-hover:bg-[#C2185B]/20 transition-colors flex items-center justify-center"><Instagram className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" /></div>
              </div>
            ))}
          </div>
          <a href="#" className="inline-flex items-center gap-2 border border-[#C2185B] text-[#C2185B] hover:bg-[#C2185B] hover:text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all"><Instagram className="w-4 h-4" />Follow @moonlightbd</a>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-[#111]">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <div className="w-11 h-11 rounded-full bg-[#C2185B]/20 border border-[#C2185B]/40 flex items-center justify-center mx-auto mb-5"><Mail className="w-5 h-5 text-[#C2185B]" /></div>
          <h2 className="text-white text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>Stay in the Loop</h2>
          <p className="text-white/60 text-sm mb-6 leading-relaxed">Get notified about new arrivals, exclusive deals, and fashion updates. No spam — ever.</p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 rounded-full text-sm outline-none focus:border-[#C2185B]/60 transition-colors" />
            <button className="bg-[#C2185B] hover:bg-[#a3154e] text-white px-5 py-3 rounded-full text-sm font-semibold transition-colors shrink-0">Subscribe</button>
          </div>
        </div>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHOP / CATEGORY PAGE (shared layout)
// ─────────────────────────────────────────────────────────────────────────────
function ProductListingPage({ title, description, breadcrumb, products, navigate, onAddToCart, wishlistIds, onToggleWishlist, emptyMessage }: {
  title: string; description?: string; breadcrumb: { label: string; page?: Page; params?: NavParams }[];
  products: Product[]; navigate: NavFn; onAddToCart: (p: Product) => void;
  wishlistIds: number[]; onToggleWishlist: (id: number) => void; emptyMessage?: string;
}) {
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const perPage = 12;

  const sorted = [...products].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "new") return b.id - a.id;
    return 0;
  });
  const paged = sorted.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(sorted.length / perPage);

  return (
    <div className="bg-[#fafafa] min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-[#e5e5e5]">
        <div className="max-w-[1440px] mx-auto px-6 py-6">
          <Breadcrumb items={breadcrumb} navigate={navigate} />
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>{title}</h1>
              {description && <p className="text-sm text-[#666] mt-1 max-w-xl">{description}</p>}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#666]">{sorted.length} products</span>
              <select value={sort} onChange={e => setSort(e.target.value)} className="border border-[#e5e5e5] bg-white rounded-xl px-3 py-2 text-sm text-[#444] outline-none focus:border-[#C2185B] transition-colors cursor-pointer">
                <option value="featured">Sort: Featured</option>
                <option value="new">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Best Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 py-8 lg:flex-row lg:gap-7">
        <FilterSidebar />
        <div className="min-w-0 flex-1">
          {paged.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <AlertCircle className="w-16 h-16 text-[#e5e5e5] mb-4" />
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">No Products Found</h3>
              <p className="text-sm text-[#666] mb-6">{emptyMessage || "Try adjusting your filters or browse other categories."}</p>
              <button onClick={() => navigate("shop")} className="bg-[#C2185B] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#a3154e] transition-colors">Browse All Products</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {paged.map(p => (
                  <ProductCard key={p.id} product={p} navigate={navigate} onAddToCart={onAddToCart} wishlistIds={wishlistIds} onToggleWishlist={onToggleWishlist} />
                ))}
              </div>
              {totalPages > 1 && <Pagination total={totalPages} current={page} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ShopPage(props: { navigate: NavFn; onAddToCart: (p: Product) => void; wishlistIds: number[]; onToggleWishlist: (id: number) => void; }) {
  return <ProductListingPage title="All Products" description="Explore our full collection of stitched, unstitched, and ready-to-wear fashion from top brands." breadcrumb={[{ label: "All Products" }]} products={ALL_PRODUCTS} {...props} />;
}

function CategoryPage({ category, navigate, onAddToCart, wishlistIds, onToggleWishlist }: { category: string; navigate: NavFn; onAddToCart: (p: Product) => void; wishlistIds: number[]; onToggleWishlist: (id: number) => void; }) {
  const products = ALL_PRODUCTS.filter(p => p.category === category);
  return <ProductListingPage title={category} description={`Discover our curated selection of ${category.toLowerCase()} — premium quality from top brands.`} breadcrumb={[{ label: "All Products", page: "shop" }, { label: category }]} products={products} navigate={navigate} onAddToCart={onAddToCart} wishlistIds={wishlistIds} onToggleWishlist={onToggleWishlist} emptyMessage={`No products found in ${category}.`} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT DETAIL PAGE
// ─────────────────────────────────────────────────────────────────────────────
function ProductDetailPage({ product, navigate, onAddToCart, wishlistIds, onToggleWishlist }: {
  product: Product; navigate: NavFn; onAddToCart: (p: Product) => void; wishlistIds: number[]; onToggleWishlist: (id: number) => void;
}) {
  const [mainImg, setMainImg] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [openAcc, setOpenAcc] = useState<string[]>(["description"]);
  const liked = wishlistIds.includes(product.id);

  const thumbs = [product.image, ...(product.images || [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=120&h=150&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&h=150&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=120&h=150&fit=crop&auto=format",
  ])];

  const toggleAcc = (k: string) => setOpenAcc(p => p.includes(k) ? p.filter(x => x !== k) : [...p, k]);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;
  const sizes = product.sizes?.length ? product.sizes : ["XS", "S", "M", "L", "XL"];
  const related = ALL_PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const AccSection = ({ k, title, children }: { k: string; title: string; children: React.ReactNode }) => (
    <div className="border-b border-[#e5e5e5]">
      <button onClick={() => toggleAcc(k)} className="flex items-center justify-between w-full py-4 text-sm font-semibold text-[#1a1a1a] hover:text-[#C2185B] transition-colors">
        {title}{openAcc.includes(k) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {openAcc.includes(k) && <div className="pb-4 text-sm text-[#555] leading-relaxed">{children}</div>}
    </div>
  );

  return (
    <div className="bg-white">
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <Breadcrumb items={[{ label: "All Products", page: "shop" }, { label: product.category, page: "category", params: { category: product.category } }, { label: product.name }]} navigate={navigate} />

        <div className="grid lg:grid-cols-2 gap-12 mb-14">
          {/* Gallery */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-3">
              {thumbs.slice(0, 4).map((img, i) => (
                <button key={i} onClick={() => setMainImg(img)} className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-colors ${mainImg === img ? "border-[#C2185B]" : "border-[#e5e5e5] hover:border-[#C2185B]/50"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-1 rounded-2xl overflow-hidden aspect-[3/4] bg-[#fafafa] relative">
              <img src={mainImg} alt={product.name} className="w-full h-full object-cover" />
              {discount && <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">-{discount}%</div>}
              {product.badge && product.badge !== "out-of-stock" && <div className="absolute top-4 right-4"><BadgeChip badge={product.badge} /></div>}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-xs font-semibold text-[#C2185B] uppercase tracking-widest mb-1">{product.brand}</p>
                <h1 className="text-2xl font-bold text-[#1a1a1a] leading-snug" style={{ fontFamily: "var(--font-display)" }}>{product.name}</h1>
              </div>
              <button onClick={() => onToggleWishlist(product.id)} className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-all hover:scale-110 ${liked ? "border-[#C2185B] bg-[#fff3f7]" : "border-[#e5e5e5] hover:border-[#C2185B]"}`}>
                <Heart className={`w-4 h-4 ${liked ? "fill-[#C2185B] text-[#C2185B]" : "text-[#666]"}`} />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-[#fff3f7] text-[#C2185B] px-2.5 py-1 rounded-full font-medium">{product.category}</span>
              {product.inStock ? <span className="text-xs bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full font-medium">In Stock</span> : <span className="text-xs bg-red-50 text-red-500 px-2.5 py-1 rounded-full font-medium">Out of Stock</span>}
            </div>

            <div className="flex items-center gap-2 mb-5 mt-3">
              <StarRow rating={product.rating} size="md" />
              <span className="text-sm font-semibold text-[#1a1a1a]">{product.rating}</span>
              <span className="text-sm text-[#999]">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-end gap-3 mb-6">
              <span className="text-3xl font-bold text-[#1a1a1a]">৳{product.price.toLocaleString()}</span>
              {product.originalPrice && <>
                <span className="text-lg text-[#999] line-through">৳{product.originalPrice.toLocaleString()}</span>
                <span className="text-sm font-bold text-red-500">Save ৳{(product.originalPrice - product.price).toLocaleString()}</span>
              </>}
            </div>

            {/* Colors */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-[#444] uppercase tracking-wider mb-2">Color</p>
              <div className="flex gap-2">
                {product.colors.map((c, i) => (
                  <button key={i} className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform ring-2 ring-offset-1 ring-transparent hover:ring-[#C2185B]" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            {/* Size */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-[#444] uppercase tracking-wider">Size</p>
                  <button className="text-xs text-[#C2185B] underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(sz => (
                    <button key={sz} onClick={() => setSelectedSize(sz)} className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${selectedSize === sz ? "border-[#C2185B] bg-[#fff3f7] text-[#C2185B]" : "border-[#e5e5e5] text-[#444] hover:border-[#C2185B]"}`}>{sz}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-[#444] uppercase tracking-wider mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-[#e5e5e5] rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-[#fafafa] transition-colors"><Minus className="w-4 h-4" /></button>
                  <span className="w-12 text-center font-bold text-[#1a1a1a]">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-[#fafafa] transition-colors"><Plus className="w-4 h-4" /></button>
                </div>
                <span className="text-xs text-[#999]">Only 12 left in stock</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => { onAddToCart({ ...product }); }} disabled={!product.inStock} className="flex-1 rounded-2xl bg-[#C2185B] py-3.5 text-sm font-bold tracking-wide text-white transition-colors hover:bg-[#a3154e] disabled:bg-gray-300 flex items-center justify-center gap-2">
                <ShoppingBag className="h-4 w-4" />Add to Cart
              </button>
              <button onClick={() => navigate("checkout")} disabled={!product.inStock} className="flex-1 rounded-2xl bg-[#111111] py-3.5 text-sm font-bold tracking-wide text-white transition-colors hover:bg-[#333] disabled:bg-gray-300">
                Buy Now
              </button>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-[#e5e5e5] py-4">
              {[{ icon: <Truck className="w-4 h-4" />, text: "Free delivery above ৳2,000" }, { icon: <RotateCcw className="w-4 h-4" />, text: "7-day easy returns" }, { icon: <Shield className="w-4 h-4" />, text: "Secure payment" }].map(t => (
                <div key={t.text} className="flex items-center gap-1.5 rounded-full bg-[#fafafa] px-3 py-1.5 text-xs text-[#666]"><span className="text-[#C2185B]">{t.icon}</span>{t.text}</div>
              ))}
            </div>

            {/* Accordions */}
            <div className="mt-4 border-t border-[#e5e5e5]">
              <AccSection k="description" title="Description">
                <p>{product.description || "Beautifully crafted with attention to every detail. This piece combines traditional aesthetics with contemporary silhouettes, making it perfect for any occasion."}</p>
              </AccSection>
              <AccSection k="fabric" title="Fabric & Care">
                <p className="mb-2"><strong>Fabric:</strong> {product.fabric || "100% Pure Cotton"}</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Hand wash or gentle machine wash in cold water</li>
                  <li>Do not bleach or tumble dry</li>
                  <li>Iron on medium heat on reverse side</li>
                  <li>Dry in shade to preserve color</li>
                </ul>
              </AccSection>
              <AccSection k="shipping" title="Shipping Policy">
                <p>Standard delivery: 3–5 business days within Dhaka, 5–7 days nationally. Free delivery on orders above ৳2,000. Express delivery available at checkout.</p>
              </AccSection>
              <AccSection k="returns" title="Return & Exchange">
                <p>Returns accepted within 7 days of delivery for unused, unwashed items in original packaging. Sale items and custom stitched pieces are non-returnable.</p>
              </AccSection>
              <AccSection k="disclaimer" title="Disclaimer">
                <p>Actual colors may vary slightly due to photography lighting and screen calibration. Fabric texture and embroidery patterns are as shown. Minor variations in hand-embroidered pieces are natural.</p>
              </AccSection>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="border-t border-[#e5e5e5] pt-10">
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-6" style={{ fontFamily: "var(--font-display)" }}>You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p.id} product={p} navigate={navigate} onAddToCart={onAddToCart} wishlistIds={wishlistIds} onToggleWishlist={onToggleWishlist} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CART PAGE
// ─────────────────────────────────────────────────────────────────────────────
function CartPage({ cartItems, navigate, onRemove, onQty }: {
  cartItems: CartItem[]; navigate: NavFn;
  onRemove: (id: number) => void; onQty: (id: number, d: number) => void;
}) {
  const [promo, setPromo] = useState("");
  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal >= 2000 ? 0 : 80;
  const total = subtotal + shipping;

  return (
    <div className="bg-[#fafafa] min-h-screen">
      <div className="bg-white border-b border-[#e5e5e5]">
        <div className="max-w-[1440px] mx-auto px-6 py-6">
          <Breadcrumb items={[{ label: "Cart" }]} navigate={navigate} />
          <h1 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>Shopping Cart</h1>
          <p className="text-sm text-[#666] mt-1">{cartItems.length} items in your cart</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] items-start gap-6 px-6 py-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#e5e5e5] p-16 flex flex-col items-center text-center">
              <ShoppingBag className="w-16 h-16 text-[#e5e5e5] mb-4" />
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">Your cart is empty</h3>
              <p className="text-sm text-[#666] mb-6">Looks like you haven&apos;t added anything yet.</p>
              <button onClick={() => navigate("shop")} className="bg-[#C2185B] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-[#a3154e] transition-colors">Start Shopping</button>
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-[24px] border border-[#e5e5e5] bg-white">
                <div className="grid items-center gap-4 border-b border-[#e5e5e5] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#999] sm:grid-cols-[88px_1fr_auto_auto_auto]">
                  <span className="hidden sm:block" />
                  <span>Product</span>
                  <span className="hidden text-center sm:block">Quantity</span>
                  <span className="hidden text-right sm:block">Price</span>
                  <span className="hidden sm:block" />
                </div>
                {cartItems.map(item => (
                  <div key={item.product.id} className="grid items-center gap-4 border-b border-[#f5f5f5] px-5 py-4 last:border-0 hover:bg-[#fafafa] sm:grid-cols-[88px_1fr_auto_auto_auto]">
                    <img src={item.product.image} alt={item.product.name} onClick={() => navigate("product", { productId: item.product.id })} className="h-24 w-20 rounded-xl object-cover cursor-pointer" />
                    <div>
                      <p className="mb-0.5 text-xs font-medium text-[#C2185B]">{item.product.brand}</p>
                      <p className="mb-1 line-clamp-2 text-sm font-semibold text-[#1a1a1a] transition-colors hover:text-[#C2185B]" onClick={() => navigate("product", { productId: item.product.id })}>{item.product.name}</p>
                      <p className="text-xs text-[#999]">Size: <span className="font-semibold text-[#444]">{item.size}</span></p>
                      {!item.product.inStock && <p className="mt-1 text-xs text-red-500">⚠ Out of stock</p>}
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="flex items-center overflow-hidden rounded-xl border border-[#e5e5e5]">
                        <button onClick={() => onQty(item.product.id, -1)} className="flex h-8 w-8 items-center justify-center text-[#666] transition-colors hover:bg-[#fafafa]"><Minus className="h-3 w-3" /></button>
                        <span className="w-8 text-center text-sm font-bold">{item.qty}</span>
                        <button onClick={() => onQty(item.product.id, 1)} className="flex h-8 w-8 items-center justify-center text-[#666] transition-colors hover:bg-[#fafafa]"><Plus className="h-3 w-3" /></button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#1a1a1a]">৳{(item.product.price * item.qty).toLocaleString()}</p>
                      {item.qty > 1 && <p className="text-xs text-[#999]">৳{item.product.price.toLocaleString()} each</p>}
                    </div>
                    <button onClick={() => onRemove(item.product.id)} className="flex items-center justify-center text-[#ccc] transition-colors hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <button onClick={() => navigate("shop")} className="flex items-center gap-2 text-sm font-medium text-[#666] hover:text-[#C2185B] transition-colors">
                  <ChevronRight className="w-4 h-4 rotate-180" />Continue Shopping
                </button>
                <button className="text-sm font-medium text-red-400 hover:text-red-600 transition-colors">Clear Cart</button>
              </div>
            </>
          )}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6 sticky top-[73px] space-y-4">
          <h3 className="font-bold text-[#1a1a1a] text-base border-b border-[#e5e5e5] pb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-[#666]">Subtotal ({cartItems.reduce((s, i) => s + i.qty, 0)} items)</span><span className="font-semibold">৳{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-[#666]">Shipping</span><span className={shipping === 0 ? "font-semibold text-emerald-600" : "font-semibold"}>{shipping === 0 ? "FREE" : `৳${shipping}`}</span></div>
            {shipping > 0 && <p className="text-xs text-[#999] bg-[#fff3f7] p-2.5 rounded-lg">Add ৳{(2000 - subtotal).toLocaleString()} more for free shipping!</p>}
          </div>
          {/* Promo */}
          <div className="border-t border-[#e5e5e5] pt-4">
            <p className="text-xs font-semibold text-[#444] mb-2">Promo Code</p>
            <div className="flex gap-2">
              <input value={promo} onChange={e => setPromo(e.target.value)} placeholder="Enter code" className="flex-1 border border-[#e5e5e5] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#C2185B] transition-colors" />
              <button className="bg-[#111] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#333] transition-colors">Apply</button>
            </div>
          </div>
          <div className="flex justify-between border-t border-[#e5e5e5] pt-4">
            <span className="font-bold text-[#1a1a1a]">Total</span>
            <span className="font-bold text-[#C2185B] text-xl">৳{total.toLocaleString()}</span>
          </div>
          <button onClick={() => navigate("checkout")} disabled={cartItems.length === 0} className="w-full rounded-2xl bg-[#C2185B] py-3.5 text-sm font-bold tracking-wide text-white transition-colors hover:bg-[#a3154e] disabled:bg-gray-300">Proceed to Checkout</button>
          <div className="flex items-center justify-center gap-3 pt-1">
            {["bKash", "Nagad", "Visa", "COD"].map(p => <span key={p} className="text-[10px] font-bold text-[#999] bg-[#fafafa] border border-[#e5e5e5] px-1.5 py-0.5 rounded">{p}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECKOUT PAGE
// ─────────────────────────────────────────────────────────────────────────────
function CheckoutPage({ cartItems, navigate, onOrderSuccess }: {
  cartItems: CartItem[]; navigate: NavFn; onOrderSuccess: () => void;
}) {
  const [payment, setPayment] = useState("bkash");
  const [agreed, setAgreed] = useState(false);
  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal >= 2000 ? 0 : 80;
  const total = subtotal + shipping;

  const InputField = ({ label, placeholder, type = "text", required = false }: { label: string; placeholder: string; type?: string; required?: boolean }) => (
    <div>
      <label className="text-xs font-semibold text-[#444] block mb-1.5">{label}{required && <span className="text-[#C2185B] ml-0.5">*</span>}</label>
      <input type={type} placeholder={placeholder} className="w-full border border-[#e5e5e5] bg-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#C2185B] transition-colors placeholder-[#bbb]" />
    </div>
  );

  return (
    <div className="bg-[#fafafa] min-h-screen">
      <div className="bg-white border-b border-[#e5e5e5]">
        <div className="max-w-[1440px] mx-auto px-6 py-6">
          <Breadcrumb items={[{ label: "Cart", page: "cart" }, { label: "Checkout" }]} navigate={navigate} />
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>Checkout</h1>
            <div className="hidden md:flex items-center gap-2 text-xs text-[#666]">
              {["Cart", "Checkout", "Confirmation"].map((step, i) => (
                <span key={step} className="flex items-center gap-2">
                  {i > 0 && <ChevronRight className="w-3 h-3 opacity-40" />}
                  <span className={i === 1 ? "text-[#C2185B] font-semibold" : ""}>{step}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-8 grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        {/* Form */}
        <div className="space-y-5">
          {/* Contact */}
          <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6">
            <h3 className="font-bold text-[#1a1a1a] text-sm mb-4 flex items-center gap-2"><span className="w-6 h-6 bg-[#C2185B] text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>Contact Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <InputField label="First Name" placeholder="Fatima" required />
              <InputField label="Last Name" placeholder="Malik" required />
              <InputField label="Email Address" placeholder="fatima@example.com" type="email" required />
              <InputField label="Phone Number" placeholder="+880 1700-000000" required />
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6">
            <h3 className="font-bold text-[#1a1a1a] text-sm mb-4 flex items-center gap-2"><span className="w-6 h-6 bg-[#C2185B] text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>Shipping Address</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><InputField label="Street Address" placeholder="House 12, Road 5, Block C" required /></div>
              <div className="sm:col-span-2"><InputField label="Apartment / Suite (optional)" placeholder="Apartment, floor, etc." /></div>
              <InputField label="City" placeholder="Dhaka" required />
              <InputField label="Postal Code" placeholder="1212" />
            </div>
          </div>

          {/* Shipping Area */}
          <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6">
            <h3 className="font-bold text-[#1a1a1a] text-sm mb-4 flex items-center gap-2"><span className="w-6 h-6 bg-[#C2185B] text-white rounded-full text-xs flex items-center justify-center font-bold">3</span>Shipping Area</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[{ label: "Inside Dhaka", sub: "Delivery in 2–3 days", price: "৳80" }, { label: "Outside Dhaka", sub: "Delivery in 4–7 days", price: "৳120" }].map(opt => (
                <label key={opt.label} className="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors border-[#e5e5e5] hover:border-[#C2185B]/40">
                  <input type="radio" name="area" className="mt-0.5 accent-[#C2185B]" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#1a1a1a]">{opt.label}</p>
                    <p className="text-xs text-[#666] mt-0.5">{opt.sub}</p>
                  </div>
                  <span className="text-sm font-bold text-[#C2185B]">{subtotal >= 2000 ? "FREE" : opt.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6">
            <h3 className="font-bold text-[#1a1a1a] text-sm mb-4 flex items-center gap-2"><span className="w-6 h-6 bg-[#C2185B] text-white rounded-full text-xs flex items-center justify-center font-bold">4</span>Payment Method</h3>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              {[
                { id: "bkash", label: "bKash", icon: <Banknote className="w-4 h-4" />, color: "#E2136E" },
                { id: "nagad", label: "Nagad", icon: <Banknote className="w-4 h-4" />, color: "#F04E23" },
                { id: "card", label: "Credit/Debit Card", icon: <CreditCard className="w-4 h-4" />, color: "#1a1a1a" },
                { id: "cod", label: "Cash on Delivery", icon: <Banknote className="w-4 h-4" />, color: "#2d9e5f" },
              ].map(pm => (
                <label key={pm.id} onClick={() => setPayment(pm.id)} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${payment === pm.id ? "border-[#C2185B] bg-[#fff3f7]" : "border-[#e5e5e5] hover:border-[#C2185B]/40"}`}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: pm.color + "20", color: pm.color }}>{pm.icon}</div>
                  <span className="text-sm font-semibold text-[#1a1a1a]">{pm.label}</span>
                  {payment === pm.id && <Check className="w-4 h-4 text-[#C2185B] ml-auto" />}
                </label>
              ))}
            </div>
            {payment === "bkash" && (
              <div className="bg-[#fff3f7] rounded-xl p-4 border border-[#C2185B]/20">
                <p className="text-xs font-semibold text-[#C2185B] mb-2">bKash Instructions</p>
                <p className="text-xs text-[#666]">You will receive a bKash payment request on your registered number. Confirm the payment to complete your order.</p>
                <InputField label="bKash Number" placeholder="01XXXXXXXXX" required />
              </div>
            )}
            {payment === "card" && (
              <div className="space-y-3 mt-2">
                <InputField label="Card Number" placeholder="1234 5678 9012 3456" required />
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Expiry Date" placeholder="MM / YY" required />
                  <div>
                    <label className="text-xs font-semibold text-[#444] block mb-1.5">CVV <span className="text-[#C2185B]">*</span></label>
                    <div className="relative"><input placeholder="•••" className="w-full border border-[#e5e5e5] bg-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#C2185B] pr-8 placeholder-[#bbb]" /><Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#999]" /></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6 sticky top-[73px] space-y-4">
          <h3 className="font-bold text-[#1a1a1a] text-base border-b border-[#e5e5e5] pb-4">Order Summary</h3>
          <div className="space-y-3 max-h-56 overflow-y-auto">
            {cartItems.map(item => (
              <div key={item.product.id} className="flex gap-3 items-center">
                <div className="relative">
                  <img src={item.product.image} alt={item.product.name} className="w-14 h-16 object-cover rounded-lg" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#666] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{item.qty}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1a1a1a] line-clamp-2">{item.product.name}</p>
                  <p className="text-xs text-[#999]">{item.product.brand} · {item.size}</p>
                </div>
                <p className="text-sm font-bold shrink-0">৳{(item.product.price * item.qty).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-[#e5e5e5] pt-4 space-y-2.5">
            <div className="flex justify-between text-sm"><span className="text-[#666]">Subtotal</span><span className="font-semibold">৳{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-[#666]">Shipping</span><span className={shipping === 0 ? "text-emerald-600 font-semibold" : "font-semibold"}>{shipping === 0 ? "FREE" : `৳${shipping}`}</span></div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-[#e5e5e5]"><span>Total</span><span className="text-[#C2185B]">৳{total.toLocaleString()}</span></div>
          </div>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <div onClick={() => setAgreed(!agreed)} className={`w-4 h-4 rounded border-2 mt-0.5 shrink-0 flex items-center justify-center transition-colors ${agreed ? "bg-[#C2185B] border-[#C2185B]" : "border-[#e5e5e5] hover:border-[#C2185B]"}`}>
              {agreed && <Check className="w-2.5 h-2.5 text-white" />}
            </div>
            <span className="text-xs text-[#666] leading-relaxed">I agree to the <button onClick={() => navigate("policy")} className="text-[#C2185B] underline">Terms of Service</button> and <button onClick={() => navigate("policy")} className="text-[#C2185B] underline">Privacy Policy</button>.</span>
          </label>
          <button onClick={() => { if (agreed) onOrderSuccess(); }} disabled={!agreed || cartItems.length === 0} className="w-full bg-[#C2185B] hover:bg-[#a3154e] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-sm tracking-wide transition-colors">
            Place Order — ৳{total.toLocaleString()}
          </button>
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#999]"><Shield className="w-3 h-3 text-[#C2185B]" />Secured with SSL encryption</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY CATEGORY PAGE
// ─────────────────────────────────────────────────────────────────────────────
function EmptyCategoryPage({ category, navigate }: { category: string; navigate: NavFn }) {
  return (
    <div className="bg-[#fafafa] min-h-screen">
      <div className="bg-white border-b border-[#e5e5e5]">
        <div className="max-w-[1440px] mx-auto px-6 py-6">
          <Breadcrumb items={[{ label: "Shop", page: "shop" }, { label: category }]} navigate={navigate} />
          <h1 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>{category}</h1>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-6 py-8 flex gap-7">
        <FilterSidebar />
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 rounded-full bg-[#fff3f7] flex items-center justify-center mb-6">
            <AlertCircle className="w-12 h-12 text-[#C2185B]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3" style={{ fontFamily: "var(--font-display)" }}>No Products Found</h2>
          <p className="text-[#666] text-sm mb-2 max-w-md">We couldn&apos;t find any products matching your current filters in <strong>{category}</strong>.</p>
          <p className="text-[#999] text-xs mb-8">Try removing some filters or explore other categories below.</p>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {CATEGORIES_DATA.filter(c => c.label !== category).slice(0, 4).map(c => (
              <button key={c.label} onClick={() => navigate("category", { category: c.label })} className="px-5 py-2.5 border-2 border-[#e5e5e5] rounded-full text-sm font-medium text-[#444] hover:border-[#C2185B] hover:text-[#C2185B] transition-colors">{c.label}</button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("shop")} className="bg-[#C2185B] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-[#a3154e] transition-colors">Browse All Products</button>
            <button onClick={() => navigate("home")} className="border border-[#e5e5e5] text-[#444] px-8 py-3 rounded-full font-semibold text-sm hover:border-[#C2185B] hover:text-[#C2185B] transition-colors">Back to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH RESULTS PAGE
// ─────────────────────────────────────────────────────────────────────────────
function SearchResultsPage({ query, navigate, onAddToCart, wishlistIds, onToggleWishlist }: {
  query: string; navigate: NavFn; onAddToCart: (p: Product) => void; wishlistIds: number[]; onToggleWishlist: (id: number) => void;
}) {
  const results = query ? ALL_PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())) : [];
  return (
    <ProductListingPage
      title={`Results for "${query}"`}
      description={`${results.length} product${results.length !== 1 ? "s" : ""} found`}
      breadcrumb={[{ label: "Search" }, { label: `"${query}"` }]}
      products={results}
      navigate={navigate}
      onAddToCart={onAddToCart}
      wishlistIds={wishlistIds}
      onToggleWishlist={onToggleWishlist}
      emptyMessage={`No results found for "${query}". Try different keywords or browse all products.`}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BRANDS DIRECTORY
// ─────────────────────────────────────────────────────────────────────────────
function BrandsDirectoryPage({ navigate }: { navigate: NavFn }) {
  const [filter, setFilter] = useState("all");
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#111] text-white">
        <div className="max-w-[1440px] mx-auto px-6 py-14 text-center">
          <Breadcrumb items={[{ label: "Brands" }]} navigate={navigate} />
          <p className="text-xs font-semibold text-[#C2185B] uppercase tracking-widest mb-3">Curated Selection</p>
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Our Brands</h1>
          <p className="text-white/60 text-sm max-w-lg mx-auto">Discover premium fashion from South Asia&apos;s most trusted names. All authentic, all curated for you.</p>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-6 py-10">
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {["all", "Lawn", "Bridal", "Western", "Formal", "Pret"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f ? "bg-[#C2185B] text-white" : "bg-[#fafafa] border border-[#e5e5e5] text-[#666] hover:border-[#C2185B]"}`}>{f === "all" ? "All Brands" : f}</button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BRANDS_DATA.map(brand => (
            <button key={brand.slug} onClick={() => navigate("brand-detail", { brand: brand.slug })} className="group bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden hover:shadow-xl hover:border-[#C2185B]/20 transition-all duration-300 text-left hover:-translate-y-1">
              <div className="h-32 flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: brand.bg }}>
                <span className="text-5xl font-bold text-white/20 absolute" style={{ fontFamily: "var(--font-display)" }}>{brand.name}</span>
                <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center text-2xl font-bold text-white relative z-10" style={{ fontFamily: "var(--font-display)" }}>{brand.logo}</div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-[#1a1a1a] text-base">{brand.name}</h3>
                  <span className="text-xs bg-[#fff3f7] text-[#C2185B] px-2 py-0.5 rounded-full font-medium">{brand.count}+ Products</span>
                </div>
                <p className="text-xs text-[#666] leading-relaxed mb-3">{brand.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {brand.categories.map(c => <span key={c} className="text-[10px] px-2 py-0.5 bg-[#fafafa] border border-[#e5e5e5] rounded-full text-[#666]">{c}</span>)}
                </div>
                <div className="flex items-center justify-between text-xs text-[#999]">
                  <span>Est. {brand.founded}</span>
                  <span className="text-[#C2185B] font-semibold group-hover:gap-2 flex items-center gap-1 transition-all">Shop Now <ArrowRight className="w-3 h-3" /></span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BRAND DETAIL PAGE
// ─────────────────────────────────────────────────────────────────────────────
function BrandDetailPage({ brandSlug, navigate, onAddToCart, wishlistIds, onToggleWishlist }: {
  brandSlug: string; navigate: NavFn; onAddToCart: (p: Product) => void; wishlistIds: number[]; onToggleWishlist: (id: number) => void;
}) {
  const brand = BRANDS_DATA.find(b => b.slug === brandSlug) || BRANDS_DATA[0];
  const products = ALL_PRODUCTS.filter(p => p.brand === brand.name);

  return (
    <div className="bg-white min-h-screen">
      <Breadcrumb items={[{ label: "Brands", page: "brands" }, { label: brand.name }]} navigate={navigate} />
      <div className="h-56 relative flex items-end" style={{ backgroundColor: brand.bg }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)` }} />
        <div className="max-w-[1440px] mx-auto px-6 pb-0 flex items-end gap-6 relative z-10 w-full">
          <div className="w-24 h-24 rounded-2xl border-4 border-white flex items-center justify-center text-3xl font-bold text-white mb-[-2rem] shadow-xl" style={{ backgroundColor: brand.bg, fontFamily: "var(--font-display)" }}>{brand.logo}</div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-6 pt-12 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-[#e5e5e5] pb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>{brand.name}</h1>
            <p className="text-sm text-[#666] mt-1 max-w-xl">{brand.description}</p>
            <div className="flex gap-4 mt-3">
              <span className="text-xs text-[#999]">Est. {brand.founded}</span>
              <span className="text-xs text-[#999]">{brand.website}</span>
              <span className="text-xs font-semibold text-[#C2185B]">{brand.count}+ Products</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {brand.categories.map(c => <span key={c} className="text-xs px-3 py-1 bg-[#fafafa] border border-[#e5e5e5] rounded-full text-[#666]">{c}</span>)}
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <button className="flex items-center gap-2 border border-[#e5e5e5] px-4 py-2.5 rounded-full text-sm font-medium hover:border-[#C2185B] hover:text-[#C2185B] transition-colors"><Heart className="w-4 h-4" />Follow Brand</button>
            <button className="bg-[#C2185B] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#a3154e] transition-colors">Shop All {brand.name}</button>
          </div>
        </div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#1a1a1a]">{products.length} Products from {brand.name}</h2>
          <select className="border border-[#e5e5e5] bg-white rounded-xl px-3 py-2 text-sm text-[#444] outline-none focus:border-[#C2185B] transition-colors">
            <option>Sort: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-16"><AlertCircle className="w-12 h-12 text-[#e5e5e5] mx-auto mb-3" /><p className="text-[#666]">No products listed for this brand yet.</p></div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map(p => <ProductCard key={p.id} product={p} navigate={navigate} onAddToCart={onAddToCart} wishlistIds={wishlistIds} onToggleWishlist={onToggleWishlist} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
function LoginPage({ navigate }: { navigate: NavFn }) {
  const [showPw, setShowPw] = useState(false);
  return (
    <div className="min-h-[80vh] bg-[#fafafa] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#C2185B] flex items-center justify-center mx-auto mb-4"><span className="text-white text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>M</span></div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>Welcome Back</h1>
          <p className="text-sm text-[#666] mt-1">Sign in to your Moonlight BD account</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#e5e5e5] p-8 shadow-sm space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#444] block mb-1.5">Email Address</label>
            <div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb]" /><input type="email" placeholder="you@example.com" className="w-full border border-[#e5e5e5] rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-[#C2185B] transition-colors" /></div>
          </div>
          <div>
            <div className="flex justify-between mb-1.5"><label className="text-xs font-semibold text-[#444]">Password</label><button className="text-xs text-[#C2185B] hover:underline">Forgot password?</button></div>
            <div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb]" /><input type={showPw ? "text" : "password"} placeholder="••••••••" className="w-full border border-[#e5e5e5] rounded-xl pl-10 pr-10 py-3 text-sm outline-none focus:border-[#C2185B] transition-colors" /><button onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#bbb] hover:text-[#666] transition-colors text-xs">{showPw ? "Hide" : "Show"}</button></div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-4 h-4 rounded border border-[#e5e5e5] hover:border-[#C2185B] flex items-center justify-center transition-colors" />
            <span className="text-xs text-[#666]">Remember me for 30 days</span>
          </label>
          <button className="w-full bg-[#C2185B] hover:bg-[#a3154e] text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition-colors">Sign In</button>
          <div className="relative flex items-center gap-3"><div className="flex-1 h-px bg-[#e5e5e5]" /><span className="text-xs text-[#999] shrink-0">or continue with</span><div className="flex-1 h-px bg-[#e5e5e5]" /></div>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 border border-[#e5e5e5] rounded-xl py-2.5 text-sm font-medium hover:border-[#C2185B]/40 transition-colors"><Globe className="w-4 h-4 text-blue-500" />Google</button>
            <button className="flex items-center justify-center gap-2 border border-[#e5e5e5] rounded-xl py-2.5 text-sm font-medium hover:border-[#C2185B]/40 transition-colors"><Facebook className="w-4 h-4 text-blue-700" />Facebook</button>
          </div>
          <p className="text-center text-xs text-[#666]">Don&apos;t have an account? <button onClick={() => navigate("register")} className="text-[#C2185B] font-semibold hover:underline">Create one</button></p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER PAGE
// ─────────────────────────────────────────────────────────────────────────────
function RegisterPage({ navigate }: { navigate: NavFn }) {
  const [agreed, setAgreed] = useState(false);
  return (
    <div className="min-h-[80vh] bg-[#fafafa] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#C2185B] flex items-center justify-center mx-auto mb-4"><span className="text-white text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>M</span></div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>Create Account</h1>
          <p className="text-sm text-[#666] mt-1">Join Moonlight BD for exclusive offers and easy checkout</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#e5e5e5] p-8 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold text-[#444] block mb-1.5">First Name <span className="text-[#C2185B]">*</span></label><input placeholder="Fatima" className="w-full border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C2185B] transition-colors" /></div>
            <div><label className="text-xs font-semibold text-[#444] block mb-1.5">Last Name <span className="text-[#C2185B]">*</span></label><input placeholder="Malik" className="w-full border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C2185B] transition-colors" /></div>
          </div>
          <div><label className="text-xs font-semibold text-[#444] block mb-1.5">Email Address <span className="text-[#C2185B]">*</span></label><div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb]" /><input type="email" placeholder="you@example.com" className="w-full border border-[#e5e5e5] rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-[#C2185B] transition-colors" /></div></div>
          <div><label className="text-xs font-semibold text-[#444] block mb-1.5">Phone Number <span className="text-[#C2185B]">*</span></label><div className="relative"><Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb]" /><input type="tel" placeholder="+880 17XXXXXXXX" className="w-full border border-[#e5e5e5] rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-[#C2185B] transition-colors" /></div></div>
          <div><label className="text-xs font-semibold text-[#444] block mb-1.5">Password <span className="text-[#C2185B]">*</span></label><div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb]" /><input type="password" placeholder="Min. 8 characters" className="w-full border border-[#e5e5e5] rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-[#C2185B] transition-colors" /></div></div>
          <div><label className="text-xs font-semibold text-[#444] block mb-1.5">Confirm Password <span className="text-[#C2185B]">*</span></label><div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb]" /><input type="password" placeholder="Re-enter password" className="w-full border border-[#e5e5e5] rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-[#C2185B] transition-colors" /></div></div>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <div onClick={() => setAgreed(!agreed)} className={`w-4 h-4 mt-0.5 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${agreed ? "bg-[#C2185B] border-[#C2185B]" : "border-[#e5e5e5] hover:border-[#C2185B]"}`}>{agreed && <Check className="w-2.5 h-2.5 text-white" />}</div>
            <span className="text-xs text-[#666] leading-relaxed">I agree to the <button onClick={() => navigate("policy")} className="text-[#C2185B] underline">Terms of Service</button> and <button onClick={() => navigate("policy")} className="text-[#C2185B] underline">Privacy Policy</button>.</span>
          </label>
          <button disabled={!agreed} className="w-full bg-[#C2185B] hover:bg-[#a3154e] disabled:bg-gray-300 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition-colors">Create My Account</button>
          <p className="text-center text-xs text-[#666]">Already have an account? <button onClick={() => navigate("login")} className="text-[#C2185B] font-semibold hover:underline">Sign in</button></p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MY ACCOUNT DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function AccountDashboardPage({ navigate }: { navigate: NavFn }) {
  const [tab, setTab] = useState("orders");
  const MOCK_ORDERS = [
    { id: "MBD-20251", date: "June 22, 2025", total: 7200, status: "Delivered", items: 2, image: ALL_PRODUCTS[0].image },
    { id: "MBD-20236", date: "June 14, 2025", total: 18500, status: "Processing", items: 1, image: ALL_PRODUCTS[1].image },
    { id: "MBD-20198", date: "May 30, 2025", total: 3200, status: "Delivered", items: 3, image: ALL_PRODUCTS[2].image },
    { id: "MBD-20145", date: "May 12, 2025", total: 9800, status: "Cancelled", items: 1, image: ALL_PRODUCTS[4].image },
  ];
  const STATUS_COLOR: Record<string, string> = { Delivered: "text-emerald-600 bg-emerald-50", Processing: "text-blue-600 bg-blue-50", Cancelled: "text-red-500 bg-red-50", Shipped: "text-orange-600 bg-orange-50" };
  const sideLinks = [
    { id: "orders", icon: <Package className="w-4 h-4" />, label: "My Orders" },
    { id: "wishlist", icon: <Heart className="w-4 h-4" />, label: "Wishlist" },
    { id: "addresses", icon: <MapPin className="w-4 h-4" />, label: "Addresses" },
    { id: "profile", icon: <User className="w-4 h-4" />, label: "Profile Settings" },
    { id: "password", icon: <Lock className="w-4 h-4" />, label: "Change Password" },
  ];

  return (
    <div className="bg-[#fafafa] min-h-screen">
      <div className="bg-white border-b border-[#e5e5e5]">
        <div className="max-w-[1440px] mx-auto px-6 py-6">
          <Breadcrumb items={[{ label: "My Account" }]} navigate={navigate} />
          <h1 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>My Account</h1>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-6 py-8 grid lg:grid-cols-[240px_1fr] gap-7 items-start">
        {/* Sidebar */}
        <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden sticky top-[73px]">
          <div className="p-5 bg-gradient-to-br from-[#C2185B] to-[#8b0039] text-white">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>FM</div>
            <p className="font-bold text-sm">Fatima Malik</p>
            <p className="text-white/70 text-xs">fatima@example.com</p>
          </div>
          <nav className="py-2">
            {sideLinks.map(l => (
              <button key={l.id} onClick={() => { if (l.id === "wishlist") navigate("wishlist"); else setTab(l.id); }} className={`flex items-center gap-3 w-full px-5 py-3 text-sm font-medium transition-colors ${tab === l.id ? "text-[#C2185B] bg-[#fff3f7]" : "text-[#444] hover:text-[#C2185B] hover:bg-[#fafafa]"}`}>
                <span className={tab === l.id ? "text-[#C2185B]" : "text-[#999]"}>{l.icon}</span>{l.label}
              </button>
            ))}
            <div className="border-t border-[#e5e5e5] my-2" />
            <button onClick={() => navigate("home")} className="flex items-center gap-3 w-full px-5 py-3 text-sm font-medium text-red-400 hover:bg-red-50 transition-colors"><X className="w-4 h-4" />Sign Out</button>
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[{ label: "Total Orders", val: "14", icon: <Package className="w-5 h-5" /> }, { label: "Delivered", val: "11", icon: <CheckCircle className="w-5 h-5" /> }, { label: "Wishlist", val: "8", icon: <Heart className="w-5 h-5" /> }, { label: "Total Spent", val: "৳74,300", icon: <ShoppingBag className="w-5 h-5" /> }].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-[#e5e5e5] p-5">
                <div className="w-9 h-9 rounded-xl bg-[#fff3f7] flex items-center justify-center text-[#C2185B] mb-3">{s.icon}</div>
                <p className="text-xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>{s.val}</p>
                <p className="text-xs text-[#666] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Orders table */}
          <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5e5]">
              <h3 className="font-bold text-[#1a1a1a] text-sm">Recent Orders</h3>
              <button className="text-xs text-[#C2185B] font-semibold hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#fafafa] border-b border-[#e5e5e5]">
                  <tr>
                    {["Order", "Date", "Items", "Total", "Status", "Action"].map(h => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-[#999] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f5f5]">
                  {MOCK_ORDERS.map(order => (
                    <tr key={order.id} className="hover:bg-[#fafafa] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={order.image} alt="" className="w-10 h-12 object-cover rounded-lg" />
                          <span className="text-sm font-semibold text-[#1a1a1a]">{order.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#666]">{order.date}</td>
                      <td className="px-6 py-4 text-sm text-[#666]">{order.items} item{order.items > 1 ? "s" : ""}</td>
                      <td className="px-6 py-4 text-sm font-bold text-[#1a1a1a]">৳{order.total.toLocaleString()}</td>
                      <td className="px-6 py-4"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[order.status]}`}>{order.status}</span></td>
                      <td className="px-6 py-4">
                        <button onClick={() => navigate("order-tracking")} className="text-xs text-[#C2185B] font-semibold hover:underline">Track</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Profile quick view */}
          <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1a1a1a] text-sm">Profile Information</h3>
              <button className="text-xs text-[#C2185B] font-semibold hover:underline">Edit</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[["Full Name", "Fatima Malik"], ["Email", "fatima@example.com"], ["Phone", "+880 1712-345678"], ["Date of Birth", "March 15, 1995"], ["Location", "Dhaka, Bangladesh"], ["Member Since", "January 2024"]].map(([label, value]) => (
                <div key={String(label)}>
                  <p className="text-xs text-[#999] mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-[#1a1a1a]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WISHLIST PAGE
// ─────────────────────────────────────────────────────────────────────────────
function WishlistPage({ wishlistIds, navigate, onAddToCart, onToggleWishlist }: {
  wishlistIds: number[]; navigate: NavFn; onAddToCart: (p: Product) => void; onToggleWishlist: (id: number) => void;
}) {
  const items = ALL_PRODUCTS.filter(p => wishlistIds.includes(p.id));
  return (
    <div className="bg-[#fafafa] min-h-screen">
      <div className="bg-white border-b border-[#e5e5e5]">
        <div className="max-w-[1440px] mx-auto px-6 py-6">
          <Breadcrumb items={[{ label: "Wishlist" }]} navigate={navigate} />
          <div className="flex items-center justify-between">
            <div><h1 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>My Wishlist</h1><p className="text-sm text-[#666] mt-1">{items.length} saved items</p></div>
            {items.length > 0 && <button className="bg-[#C2185B] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#a3154e] transition-colors">Move All to Cart</button>}
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-[#fff3f7] flex items-center justify-center mb-5"><Heart className="w-10 h-10 text-[#C2185B]" /></div>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-2" style={{ fontFamily: "var(--font-display)" }}>Your wishlist is empty</h2>
            <p className="text-sm text-[#666] mb-7">Save items you love by clicking the heart icon on any product.</p>
            <button onClick={() => navigate("shop")} className="bg-[#C2185B] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-[#a3154e] transition-colors">Explore Products</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {items.map(p => <ProductCard key={p.id} product={p} navigate={navigate} onAddToCart={onAddToCart} wishlistIds={wishlistIds} onToggleWishlist={onToggleWishlist} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDER SUCCESS PAGE
// ─────────────────────────────────────────────────────────────────────────────
function OrderSuccessPage({ navigate }: { navigate: NavFn }) {
  const orderId = "MBD-" + Math.floor(20000 + Math.random() * 10000);
  return (
    <div className="bg-[#fafafa] min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2" style={{ fontFamily: "var(--font-display)" }}>Order Placed!</h1>
        <p className="text-[#666] text-sm mb-1">Thank you for shopping with Moonlight BD.</p>
        <p className="text-[#666] text-sm mb-6">A confirmation has been sent to your email.</p>

        <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6 mb-6 text-left space-y-3">
          <div className="flex justify-between items-center border-b border-[#f0f0f0] pb-3">
            <span className="text-sm font-bold text-[#1a1a1a]">Order Number</span>
            <span className="text-sm font-bold text-[#C2185B]">{orderId}</span>
          </div>
          {[["Date", new Date().toLocaleDateString("en-BD", { year: "numeric", month: "long", day: "numeric" })], ["Payment", "bKash — Confirmed"], ["Estimated Delivery", "June 27–29, 2025"], ["Shipping Address", "House 12, Road 5, Dhaka 1212"]].map(([k, v]) => (
            <div key={String(k)} className="flex justify-between gap-4">
              <span className="text-xs text-[#999]">{k}</span>
              <span className="text-xs font-semibold text-[#1a1a1a] text-right">{v}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => navigate("order-tracking")} className="flex items-center gap-2 bg-[#C2185B] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#a3154e] transition-colors"><Package className="w-4 h-4" />Track Order</button>
          <button onClick={() => navigate("shop")} className="flex items-center gap-2 border border-[#e5e5e5] text-[#444] px-6 py-3 rounded-full font-semibold text-sm hover:border-[#C2185B] hover:text-[#C2185B] transition-colors"><ShoppingBag className="w-4 h-4" />Continue Shopping</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDER TRACKING PAGE
// ─────────────────────────────────────────────────────────────────────────────
function OrderTrackingPage({ navigate }: { navigate: NavFn }) {
  const currentStep = 3;
  const STEPS = [
    { label: "Order Placed", sub: "June 22, 2025 · 10:34 AM", icon: <CheckCircle className="w-5 h-5" /> },
    { label: "Order Confirmed", sub: "June 22, 2025 · 11:15 AM", icon: <CheckCircle className="w-5 h-5" /> },
    { label: "Processing", sub: "June 23, 2025 · 9:00 AM", icon: <Package className="w-5 h-5" /> },
    { label: "Shipped", sub: "Estimated: June 24", icon: <Truck className="w-5 h-5" /> },
    { label: "Out for Delivery", sub: "Estimated: June 25", icon: <MapPinned className="w-5 h-5" /> },
    { label: "Delivered", sub: "Estimated: June 25–27", icon: <CheckCircle className="w-5 h-5" /> },
  ];

  return (
    <div className="bg-[#fafafa] min-h-screen">
      <div className="bg-white border-b border-[#e5e5e5]">
        <div className="max-w-[1440px] mx-auto px-6 py-6">
          <Breadcrumb items={[{ label: "My Account", page: "account" }, { label: "Track Order" }]} navigate={navigate} />
          <h1 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>Track Your Order</h1>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-6 py-8 grid lg:grid-cols-[1fr_360px] gap-7 items-start">
        {/* Tracker */}
        <div className="space-y-5">
          {/* Search */}
          <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6">
            <p className="text-sm font-semibold text-[#444] mb-3">Enter Order Number</p>
            <div className="flex gap-3">
              <input defaultValue="MBD-20251" className="flex-1 border border-[#e5e5e5] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#C2185B] transition-colors" placeholder="e.g. MBD-20251" />
              <button className="bg-[#C2185B] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#a3154e] transition-colors">Track</button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-[#999]">Order</p>
                <p className="text-base font-bold text-[#1a1a1a]">MBD-20251</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full">Processing</span>
            </div>
            <div className="relative">
              <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-[#e5e5e5]" />
              <div className="space-y-6">
                {STEPS.map((step, i) => {
                  const done = i < currentStep;
                  const active = i === currentStep;
                  return (
                    <div key={step.label} className="relative flex gap-4 items-start">
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 relative z-10 transition-all ${done ? "bg-emerald-500 border-emerald-500 text-white" : active ? "bg-[#C2185B] border-[#C2185B] text-white scale-110 shadow-lg shadow-[#C2185B]/30" : "bg-white border-[#e5e5e5] text-[#ccc]"}`}>
                        {step.icon}
                      </div>
                      <div className="flex-1 pt-1.5">
                        <p className={`text-sm font-semibold ${done || active ? "text-[#1a1a1a]" : "text-[#bbb]"}`}>{step.label}</p>
                        <p className={`text-xs mt-0.5 ${done || active ? "text-[#666]" : "text-[#ccc]"}`}>{step.sub}</p>
                        {active && <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#C2185B] bg-[#fff3f7] px-2.5 py-1 rounded-full"><div className="w-1.5 h-1.5 rounded-full bg-[#C2185B] animate-pulse" />Current Status</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6">
            <h3 className="font-bold text-[#1a1a1a] text-sm mb-4 border-b border-[#e5e5e5] pb-3">Order Details</h3>
            <div className="flex gap-3 mb-4">
              <img src={ALL_PRODUCTS[0].image} alt="" className="w-16 h-20 object-cover rounded-xl" />
              <div>
                <p className="text-xs text-[#C2185B] font-medium">{ALL_PRODUCTS[0].brand}</p>
                <p className="text-sm font-semibold text-[#1a1a1a] leading-tight">{ALL_PRODUCTS[0].name}</p>
                <p className="text-xs text-[#999] mt-1">Size: M · Qty: 1</p>
                <p className="text-sm font-bold text-[#1a1a1a] mt-1">৳{ALL_PRODUCTS[0].price.toLocaleString()}</p>
              </div>
            </div>
            <div className="border-t border-[#f0f0f0] pt-4 space-y-2.5">
              {[["Order Date", "June 22, 2025"], ["Payment", "bKash · ৳7,200"], ["Deliver to", "House 12, Road 5, Dhaka"]].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between gap-4"><span className="text-xs text-[#999]">{k}</span><span className="text-xs font-semibold text-[#1a1a1a] text-right">{v}</span></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#e5e5e5] p-5">
            <p className="text-sm font-semibold text-[#1a1a1a] mb-3">Need Help?</p>
            <div className="space-y-2.5">
              <button className="flex items-center gap-2.5 w-full text-sm text-[#444] hover:text-[#C2185B] transition-colors"><Phone className="w-4 h-4 text-[#C2185B]" />+880 1700-000000</button>
              <button onClick={() => navigate("contact")} className="flex items-center gap-2.5 w-full text-sm text-[#444] hover:text-[#C2185B] transition-colors"><MessageSquare className="w-4 h-4 text-[#C2185B]" />Contact Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT US PAGE
// ─────────────────────────────────────────────────────────────────────────────
function AboutUsPage({ navigate }: { navigate: NavFn }) {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative bg-[#111] overflow-hidden h-72 flex items-center">
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=600&fit=crop&auto=format" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 text-center w-full">
          <p className="text-xs font-semibold text-[#C2185B] uppercase tracking-widest mb-3">Our Story</p>
          <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>About Moonlight BD</h1>
          <p className="text-white/70 text-sm mt-3 max-w-lg mx-auto">Bangladesh&apos;s premier destination for authentic South Asian fashion from trusted brands.</p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-14 space-y-16">
        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold text-[#C2185B] uppercase tracking-widest mb-3">Who We Are</p>
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-5 leading-snug" style={{ fontFamily: "var(--font-display)" }}>Bringing the Best of South Asian Fashion to Your Doorstep</h2>
            <p className="text-[#555] text-sm leading-relaxed mb-4">Moonlight BD was founded in 2021 with a simple mission: to make premium South Asian fashion accessible to every woman in Bangladesh. We partner exclusively with verified, authentic brands — so you never have to worry about quality or authenticity.</p>
            <p className="text-[#555] text-sm leading-relaxed mb-6">From everyday casual wear to stunning bridal lehengas, we curate collections across all occasions and budgets. We believe every woman deserves to feel confident, beautiful, and celebrated.</p>
            <button onClick={() => navigate("shop")} className="inline-flex items-center gap-2 bg-[#C2185B] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#a3154e] transition-colors">Explore Our Collection <ArrowRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=350&h=350&fit=crop&auto=format","https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=350&h=350&fit=crop&auto=format","https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=350&h=350&fit=crop&auto=format","https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=350&h=350&fit=crop&auto=format"].map((img, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden ${i === 0 ? "row-span-2" : ""}`}><img src={img} alt="" className="w-full h-full object-cover" style={{ minHeight: i === 0 ? "280px" : "130px" }} /></div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-[#111] rounded-3xl p-10 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[{ n: "25,000+", l: "Happy Customers" }, { n: "1,200+", l: "Products" }, { n: "50+", l: "Trusted Brands" }, { n: "4.8★", l: "Average Rating" }].map(s => (
            <div key={s.l}><div className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>{s.n}</div><div className="text-sm text-white/50">{s.l}</div></div>
          ))}
        </div>

        {/* Values */}
        <div>
          <div className="text-center mb-9">
            <p className="text-xs font-semibold text-[#C2185B] uppercase tracking-widest mb-2">What We Stand For</p>
            <h2 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>Our Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[{ icon: <Award className="w-6 h-6" />, title: "100% Authentic", text: "Every product is sourced directly from official brand channels. No counterfeits — ever." }, { icon: <Users className="w-6 h-6" />, title: "Customer First", text: "From easy returns to 24/7 support, we put your experience at the heart of everything." }, { icon: <TrendingUp className="w-6 h-6" />, title: "Curated Quality", text: "Our team personally reviews every brand and product before it's listed on our platform." }, { icon: <Globe className="w-6 h-6" />, title: "Nationwide Delivery", text: "We deliver to every district in Bangladesh with tracked, reliable shipping." }].map(v => (
              <div key={v.title} className="bg-[#fafafa] rounded-2xl p-6 border border-[#e5e5e5] hover:border-[#C2185B]/20 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#fff3f7] flex items-center justify-center text-[#C2185B] mb-4">{v.icon}</div>
                <h3 className="font-bold text-[#1a1a1a] text-sm mb-2">{v.title}</h3>
                <p className="text-xs text-[#666] leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT US PAGE
// ─────────────────────────────────────────────────────────────────────────────
function ContactUsPage({ navigate }: { navigate: NavFn }) {
  return (
    <div className="bg-[#fafafa] min-h-screen">
      <div className="bg-white border-b border-[#e5e5e5]">
        <div className="max-w-[1440px] mx-auto px-6 py-6">
          <Breadcrumb items={[{ label: "Contact Us" }]} navigate={navigate} />
          <h1 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>Contact Us</h1>
          <p className="text-sm text-[#666] mt-1">We&apos;re here to help. Reach out and we&apos;ll get back to you promptly.</p>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-6 py-10 grid lg:grid-cols-[1fr_380px] gap-8">
        {/* Form */}
        <div className="bg-white rounded-2xl border border-[#e5e5e5] p-8 space-y-5">
          <h2 className="font-bold text-[#1a1a1a] text-lg" style={{ fontFamily: "var(--font-display)" }}>Send us a Message</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="text-xs font-semibold text-[#444] block mb-1.5">Full Name <span className="text-[#C2185B]">*</span></label><input placeholder="Your name" className="w-full border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C2185B] transition-colors" /></div>
            <div><label className="text-xs font-semibold text-[#444] block mb-1.5">Email Address <span className="text-[#C2185B]">*</span></label><input type="email" placeholder="you@example.com" className="w-full border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C2185B] transition-colors" /></div>
          </div>
          <div><label className="text-xs font-semibold text-[#444] block mb-1.5">Phone Number</label><input type="tel" placeholder="+880 1XXXXXXXXX" className="w-full border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C2185B] transition-colors" /></div>
          <div>
            <label className="text-xs font-semibold text-[#444] block mb-1.5">Subject <span className="text-[#C2185B]">*</span></label>
            <select className="w-full border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C2185B] transition-colors bg-white text-[#444] cursor-pointer">
              <option>Select a topic</option>
              <option>Order Inquiry</option>
              <option>Return / Exchange</option>
              <option>Payment Issue</option>
              <option>Product Question</option>
              <option>Other</option>
            </select>
          </div>
          <div><label className="text-xs font-semibold text-[#444] block mb-1.5">Order Number (optional)</label><input placeholder="e.g. MBD-20251" className="w-full border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C2185B] transition-colors" /></div>
          <div><label className="text-xs font-semibold text-[#444] block mb-1.5">Message <span className="text-[#C2185B]">*</span></label><textarea rows={5} placeholder="Describe your issue or question in detail..." className="w-full border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C2185B] transition-colors resize-none" /></div>
          <button className="bg-[#C2185B] hover:bg-[#a3154e] text-white px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-colors">Send Message</button>
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6">
            <h3 className="font-bold text-[#1a1a1a] text-sm mb-5">Contact Information</h3>
            <div className="space-y-4">
              {[{ icon: <Phone className="w-4 h-4" />, label: "Phone", value: "+880 1700-000000", sub: "Mon–Sat, 10am–8pm" }, { icon: <Mail className="w-4 h-4" />, label: "Email", value: "support@moonlightbd.com", sub: "Response within 24 hours" }, { icon: <MapPin className="w-4 h-4" />, label: "Head Office", value: "Bashundhara City, Level 4", sub: "Dhaka 1229, Bangladesh" }].map(c => (
                <div key={c.label} className="flex gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#fff3f7] flex items-center justify-center text-[#C2185B] shrink-0">{c.icon}</div>
                  <div><p className="text-xs text-[#999] mb-0.5">{c.label}</p><p className="text-sm font-semibold text-[#1a1a1a]">{c.value}</p><p className="text-xs text-[#999]">{c.sub}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6">
            <h3 className="font-bold text-[#1a1a1a] text-sm mb-4">Business Hours</h3>
            <div className="space-y-2">
              {[["Saturday – Thursday", "10:00 AM – 8:00 PM"], ["Friday", "2:00 PM – 8:00 PM"], ["Public Holidays", "11:00 AM – 6:00 PM"]].map(([day, hrs]) => (
                <div key={String(day)} className="flex justify-between text-sm"><span className="text-[#666]">{day}</span><span className="font-semibold text-[#1a1a1a]">{hrs}</span></div>
              ))}
            </div>
          </div>
          <div className="bg-[#111] rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-2">Follow us on Social Media</p>
            <p className="text-white/50 text-xs mb-4">Stay updated with new arrivals and exclusive deals.</p>
            <div className="flex gap-3">
              {[{ icon: <Instagram className="w-4 h-4" />, label: "Instagram" }, { icon: <Facebook className="w-4 h-4" />, label: "Facebook" }, { icon: <Youtube className="w-4 h-4" />, label: "YouTube" }].map(s => (
                <a key={s.label} href="#" aria-label={s.label} className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#C2185B] flex items-center justify-center transition-colors">{s.icon}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ PAGE
// ─────────────────────────────────────────────────────────────────────────────
function FAQPage({ navigate }: { navigate: NavFn }) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openItem, setOpenItem] = useState<string | null>(null);
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#fafafa] border-b border-[#e5e5e5]">
        <div className="max-w-[1440px] mx-auto px-6 py-10 text-center">
          <p className="text-xs font-semibold text-[#C2185B] uppercase tracking-widest mb-2">Help Center</p>
          <h1 className="text-3xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>Frequently Asked Questions</h1>
          <p className="text-sm text-[#666] mt-2 max-w-sm mx-auto">Find answers to common questions. Can&apos;t find what you&apos;re looking for?</p>
          <button onClick={() => navigate("contact")} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C2185B] hover:underline">Contact our team <ArrowRight className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="max-w-[900px] mx-auto px-6 py-10">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 justify-center">
          {FAQ_DATA.map((cat, i) => (
            <button key={cat.category} onClick={() => setActiveCategory(i)} className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === i ? "bg-[#C2185B] text-white" : "bg-[#fafafa] border border-[#e5e5e5] text-[#666] hover:border-[#C2185B]"}`}>{cat.category}</button>
          ))}
        </div>
        <div className="space-y-3">
          {FAQ_DATA[activeCategory].items.map((item, i) => {
            const key = `${activeCategory}-${i}`;
            const open = openItem === key;
            return (
              <div key={key} className={`border rounded-2xl overflow-hidden transition-all ${open ? "border-[#C2185B]/30" : "border-[#e5e5e5]"}`}>
                <button onClick={() => setOpenItem(open ? null : key)} className="flex items-center justify-between w-full px-6 py-4 text-left gap-4 hover:bg-[#fafafa] transition-colors">
                  <span className={`text-sm font-semibold ${open ? "text-[#C2185B]" : "text-[#1a1a1a]"}`}>{item.q}</span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${open ? "bg-[#C2185B] text-white" : "bg-[#fafafa] text-[#999]"}`}>{open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</div>
                </button>
                {open && <div className="px-6 pb-5 text-sm text-[#555] leading-relaxed border-t border-[#e5e5e5] pt-4">{item.a}</div>}
              </div>
            );
          })}
        </div>
        <div className="mt-10 bg-[#fff3f7] border border-[#C2185B]/20 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-[#1a1a1a] mb-2">Still have questions?</h3>
          <p className="text-sm text-[#666] mb-4">Our customer support team is available 6 days a week to help you.</p>
          <button onClick={() => navigate("contact")} className="bg-[#C2185B] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#a3154e] transition-colors">Contact Support</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POLICY PAGE
// ─────────────────────────────────────────────────────────────────────────────
function PolicyPage({ navigate }: { navigate: NavFn }) {
  const [activeTab, setActiveTab] = useState("privacy");
  const TABS = [{ id: "privacy", label: "Privacy Policy" }, { id: "terms", label: "Terms of Use" }, { id: "shipping", label: "Shipping Policy" }, { id: "returns", label: "Refund & Returns" }];
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-7">
      <h3 className="text-base font-bold text-[#1a1a1a] mb-3">{title}</h3>
      <div className="text-sm text-[#555] leading-relaxed space-y-2">{children}</div>
    </div>
  );
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#fafafa] border-b border-[#e5e5e5]">
        <div className="max-w-[1440px] mx-auto px-6 py-8">
          <Breadcrumb items={[{ label: "Policies" }]} navigate={navigate} />
          <h1 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>Legal & Policies</h1>
          <p className="text-sm text-[#666] mt-1">Last updated: June 1, 2025</p>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-6 py-8 grid lg:grid-cols-[220px_1fr] gap-8">
        {/* Sidebar tabs */}
        <div className="space-y-1 sticky top-[73px]">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${activeTab === tab.id ? "bg-[#fff3f7] text-[#C2185B] font-semibold" : "text-[#444] hover:bg-[#fafafa]"}`}>
              {activeTab === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-[#C2185B]" />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-3xl">
          {activeTab === "privacy" && <>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-6 border-b border-[#e5e5e5] pb-4" style={{ fontFamily: "var(--font-display)" }}>Privacy Policy</h2>
            <Section title="1. Information We Collect"><p>We collect information you provide when creating an account, placing an order, or contacting us. This includes your name, email address, phone number, shipping address, and payment details.</p><p>We also collect non-personal data such as browser type, device type, and pages visited to improve our services.</p></Section>
            <Section title="2. How We Use Your Information"><p>Your information is used to process orders, send delivery updates, respond to inquiries, and improve our platform. We may send promotional emails if you opt in — you can unsubscribe at any time.</p></Section>
            <Section title="3. Data Security"><p>We use SSL encryption and secure payment processors. We never store full card details on our servers. Your data is never sold to third parties.</p></Section>
            <Section title="4. Cookies"><p>We use essential cookies for cart and session management, and analytics cookies to understand site usage. You can manage cookies in your browser settings.</p></Section>
          </>}
          {activeTab === "terms" && <>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-6 border-b border-[#e5e5e5] pb-4" style={{ fontFamily: "var(--font-display)" }}>Terms of Use</h2>
            <Section title="1. Acceptance of Terms"><p>By accessing and using Moonlight BD, you agree to these Terms of Use. If you do not agree, please do not use our services.</p></Section>
            <Section title="2. Account Responsibility"><p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p></Section>
            <Section title="3. Product Accuracy"><p>We strive to display product images, colors, and descriptions as accurately as possible. Minor variations in color due to photography lighting are not grounds for return.</p></Section>
            <Section title="4. Prohibited Conduct"><p>You agree not to: impersonate others, submit false orders, scrape our website, or engage in any fraudulent activity.</p></Section>
          </>}
          {activeTab === "shipping" && <>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-6 border-b border-[#e5e5e5] pb-4" style={{ fontFamily: "var(--font-display)" }}>Shipping Policy</h2>
            <Section title="Delivery Timelines">
              <div className="overflow-x-auto"><table className="w-full border border-[#e5e5e5] rounded-xl overflow-hidden text-xs"><thead className="bg-[#fafafa]"><tr>{["Location","Standard Delivery","Express Delivery"].map(h => <th key={h} className="px-4 py-2.5 text-left font-semibold text-[#444]">{h}</th>)}</tr></thead><tbody className="divide-y divide-[#f5f5f5]">{[["Inside Dhaka","2–3 business days","Same day (order by 12pm)"],["Outside Dhaka","4–7 business days","2–3 business days"],["Chittagong / Sylhet","5–6 business days","3–4 business days"]].map(([loc,std,exp]) => (<tr key={String(loc)} className="hover:bg-[#fafafa]">{[loc,std,exp].map((v,i) => <td key={i} className="px-4 py-3">{v}</td>)}</tr>))}</tbody></table></div>
            </Section>
            <Section title="Delivery Charges"><p>Orders above ৳2,000: FREE delivery nationwide. Orders below ৳2,000: ৳80 inside Dhaka, ৳120 outside Dhaka. Express delivery charges vary.</p></Section>
            <Section title="Order Tracking"><p>Once shipped, you will receive an SMS and email with your tracking number. Track your order from My Account &gt; My Orders, or on our Order Tracking page.</p></Section>
          </>}
          {activeTab === "returns" && <>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-6 border-b border-[#e5e5e5] pb-4" style={{ fontFamily: "var(--font-display)" }}>Refund & Returns Policy</h2>
            <Section title="Return Eligibility"><p>Items must be returned within 7 days of delivery. Products must be unused, unwashed, with all tags intact and in original packaging. The following items are non-returnable: sale items, custom stitched pieces, undergarments.</p></Section>
            <Section title="How to Return"><p>1. Log in to My Account and navigate to My Orders. 2. Select the item and click &quot;Return Item.&quot; 3. Fill in the reason and submit. 4. Our team will arrange a pickup within 2 business days.</p></Section>
            <Section title="Refund Timeline"><p>After we receive and inspect the returned item, refunds are processed within 5–7 business days. The amount is credited to your original payment method (bKash, card, etc.).</p></Section>
            <Section title="Exchange Policy"><p>We offer size exchanges within 7 days of delivery, subject to stock availability. Contact our support team to initiate an exchange.</p></Section>
          </>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP ROUTER
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [categoryParam, setCategoryParam] = useState("Wedding Collection");
  const [selectedProductId, setSelectedProductId] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState("gul-ahmed");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  const navigate: NavFn = (page, params) => {
    if (params?.category) setCategoryParam(params.category);
    if (params?.productId) setSelectedProductId(params.productId);
    if (params?.brand) setSelectedBrand(params.brand);
    if (params?.query) setSearchQuery(params.query);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product: Product) => {
    const SIZES = ["XS", "S", "M", "L", "XL"];
    setCartItems(prev => {
      const ex = prev.find(i => i.product.id === product.id);
      if (ex) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1, size: product.sizes?.[1] || SIZES[Math.floor(Math.random() * SIZES.length)] }];
    });
  };

  const removeFromCart = (id: number) => setCartItems(prev => prev.filter(i => i.product.id !== id));
  const changeQty = (id: number, delta: number) => setCartItems(prev => prev.map(i => i.product.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  const toggleWishlist = (id: number) => setWishlistIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const handleOrderSuccess = () => { setCartItems([]); navigate("order-success"); };

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const selectedProduct = ALL_PRODUCTS.find(p => p.id === selectedProductId) || ALL_PRODUCTS[0];

  const sharedProps = { navigate, onAddToCart: addToCart, wishlistIds, onToggleWishlist: toggleWishlist };

  const renderPage = () => {
    switch (currentPage) {
      case "home": return <HomePage {...sharedProps} />;
      case "shop": return <ShopPage {...sharedProps} />;
      case "category": return <CategoryPage category={categoryParam} {...sharedProps} />;
      case "product": return <ProductDetailPage product={selectedProduct} {...sharedProps} />;
      case "cart": return <CartPage cartItems={cartItems} navigate={navigate} onRemove={removeFromCart} onQty={changeQty} />;
      case "checkout": return <CheckoutPage cartItems={cartItems} navigate={navigate} onOrderSuccess={handleOrderSuccess} />;
      case "empty-category": return <EmptyCategoryPage category="Accessories" navigate={navigate} />;
      case "search": return <SearchResultsPage query={searchQuery} {...sharedProps} />;
      case "brands": return <BrandsDirectoryPage navigate={navigate} />;
      case "brand-detail": return <BrandDetailPage brandSlug={selectedBrand} {...sharedProps} />;
      case "login": return <LoginPage navigate={navigate} />;
      case "register": return <RegisterPage navigate={navigate} />;
      case "account": return <AccountDashboardPage navigate={navigate} />;
      case "wishlist": return <WishlistPage wishlistIds={wishlistIds} navigate={navigate} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} />;
      case "order-success": return <OrderSuccessPage navigate={navigate} />;
      case "order-tracking": return <OrderTrackingPage navigate={navigate} />;
      case "about": return <AboutUsPage navigate={navigate} />;
      case "contact": return <ContactUsPage navigate={navigate} />;
      case "faq": return <FAQPage navigate={navigate} />;
      case "policy": return <PolicyPage navigate={navigate} />;
      default: return <HomePage {...sharedProps} />;
    }
  };

  return (
    <PageLayout navigate={navigate} currentPage={currentPage} cartCount={cartCount} wishlistCount={wishlistIds.length} searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      {renderPage()}
    </PageLayout>
  );
}
