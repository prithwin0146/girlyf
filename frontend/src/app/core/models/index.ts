// ── Product Models ──
export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  sku: string;
  categoryId: number;
  categoryName: string;
  metal: string;
  karat: string;
  grossWeight: number;
  netWeight: number;
  makingChargePercent: number;
  wastagePercent: number;
  stonePrice: number;
  calculatedPrice: number;
  gender?: string;
  collection?: string;
  isBestSeller: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  stockQuantity: number;
  images: ProductImage[];
  averageRating: number;
  reviewCount: number;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
}

export interface ProductFilter {
  categoryId?: number;
  categorySlug?: string;
  karat?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  minWeight?: number;
  maxWeight?: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  sortBy?: string;
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ── Category Models ──
export interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;
  description?: string;
  parentCategoryId?: number;
  subCategories: Category[];
  productCount: number;
}

// ── Gold Rate Models ──
export interface GoldRate {
  karat: string;
  ratePerGram: number;
  effectiveDate: string;
  city: string;
}

// ── Auth Models ──
export interface AuthResponse {
  token: string;
  name: string;
  email: string;
  role: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ── Order Models ──
export interface Order {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress?: Address;
}

export interface OrderItem {
  productId: number;
  productName: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateOrder {
  shippingAddressId: number;
  paymentMethod: string;
  notes?: string;
  items: { productId: number; quantity: number }[];
}

// ── Address Models ──
export interface Address {
  id: number;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pinCode: string;
  country?: string;
  isDefault: boolean;
}

// ── Cart Models (client-side) ──
export interface CartItem {
  productId: number;
  productName: string;
  slug: string;
  imageUrl: string;
  karat: string;
  grossWeight: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// ── CMS Models ──
export interface CmsSection {
  id: number;
  sectionKey: string;
  title: string;
  subTitle?: string;
  description?: string;
  linkUrl?: string;
  linkText?: string;
  displayOrder: number;
  items: CmsSectionItem[];
}

export interface CmsSectionItem {
  id: number;
  title: string;
  subTitle?: string;
  imageUrl?: string;
  mobileImageUrl?: string;
  videoUrl?: string;
  linkUrl?: string;
  extraData?: string;
  displayOrder: number;
}

// ── Banner Models ──
export interface Banner {
  id: number;
  title: string;
  subTitle?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl?: string;
  position: string;
  displayOrder: number;
}

// ── Blog Models ──
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featuredImageUrl?: string;
  author?: string;
  tags?: string;
  publishedAt: string;
}

// ── Store Location Models ──
export interface StoreLocation {
  id: number;
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  imageUrl?: string;
  latitude: number;
  longitude: number;
  openingHours?: string;
}

// ── Testimonial Models ──
export interface Testimonial {
  id: number;
  customerName: string;
  customerImage?: string;
  location?: string;
  rating: number;
  comment: string;
}

// ── Review Models ──
export interface Review {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

// ── Coupon Models ──
export interface CouponValidation {
  isValid: boolean;
  message?: string;
  discountAmount: number;
  discountType?: string;
}
