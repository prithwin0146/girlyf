import { Component, OnInit, OnDestroy, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription, forkJoin } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { CartService } from '@core/services/cart.service';
import { WishlistService } from '@core/services/wishlist.service';
import { Product, GoldRate, Review } from '@core/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    @if (loading()) {
      <!-- Skeleton -->
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="skeleton aspect-square rounded"></div>
          <div class="space-y-4">
            <div class="skeleton h-4 w-32"></div>
            <div class="skeleton h-6 w-3/4"></div>
            <div class="skeleton h-4 w-48"></div>
            <div class="skeleton h-8 w-40"></div>
            <div class="skeleton h-32 w-full"></div>
          </div>
        </div>
      </div>
    } @else if (product()) {
      <!-- Breadcrumb -->
      <nav class="bg-brown-200 py-3">
        <div class="max-w-7xl mx-auto px-4 flex items-center gap-2 text-xs text-gray-500">
          <a routerLink="/" class="hover:text-primary-900">Home</a>
          <span>/</span>
          <a [routerLink]="['/category', product()!.categoryName.toLowerCase()]" class="hover:text-primary-900">{{ product()!.categoryName }}</a>
          <span>/</span>
          <span class="text-primary-900 font-semibold line-clamp-1">{{ product()!.name }}</span>
        </div>
      </nav>

      <div class="max-w-7xl mx-auto px-4 py-6 md:py-10">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <!-- ═══════ IMAGE GALLERY ═══════ -->
          <div class="space-y-3">
            <!-- Main Image -->
            <div class="relative aspect-square overflow-hidden bg-gray-50 rounded border border-gray-100 group cursor-zoom-in"
              (mousemove)="onZoom($event)" (mouseleave)="resetZoom()">
              <img [src]="selectedImage()" [alt]="product()!.name"
                class="w-full h-full object-cover transition-transform duration-300"
                [style.transform]="zoomTransform()"
                [style.transform-origin]="zoomOrigin()">

              @if (product()!.isBestSeller) {
                <span class="badge-bestseller">BESTSELLER</span>
              }
              @if (product()!.isNewArrival) {
                <span class="badge-new">NEW</span>
              }

              <!-- Wishlist -->
              <button (click)="toggleWishlist()" class="absolute top-3 right-3 z-10 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-all"
                [class.text-red-500]="wishlist.isInWishlist(product()!.id)" [class.text-gray-400]="!wishlist.isInWishlist(product()!.id)">
                <svg class="w-5 h-5" [attr.fill]="wishlist.isInWishlist(product()!.id) ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              </button>

              <!-- Share -->
              <button (click)="shareProduct()" class="absolute top-3 right-14 z-10 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-all text-gray-400 hover:text-primary-900">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
              </button>
            </div>

            <!-- Thumbnails -->
            @if (product()!.images.length > 1) {
              <div class="flex gap-2 overflow-x-auto scrollbar-hide">
                @for (img of product()!.images; track img.id) {
                  <button (click)="selectedImage.set(img.imageUrl)"
                    class="flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all"
                    [class.border-gold-500]="selectedImage() === img.imageUrl"
                    [class.border-gray-200]="selectedImage() !== img.imageUrl">
                    <img [src]="img.imageUrl" [alt]="product()!.name" class="w-full h-full object-cover">
                  </button>
                }
              </div>
            }
          </div>

          <!-- ═══════ PRODUCT INFO ═══════ -->
          <div class="space-y-5">
            <!-- SKU & Category -->
            <div class="flex items-center gap-3">
              <span class="text-[10px] text-gray-400 uppercase tracking-wider">SKU: {{ product()!.sku }}</span>
              <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span class="text-[10px] text-gold-600 uppercase font-accent font-bold tracking-wider">{{ product()!.categoryName }}</span>
            </div>

            <!-- Name -->
            <h1 class="text-xl md:text-2xl font-heading font-bold text-gray-800 leading-tight">{{ product()!.name }}</h1>

            <!-- Ratings -->
            @if (product()!.reviewCount > 0) {
              <div class="flex items-center gap-2">
                <div class="flex gap-0.5">
                  @for (s of [1,2,3,4,5]; track s) {
                    <svg class="w-4 h-4" [class.text-gold-500]="s <= product()!.averageRating" [class.text-gray-200]="s > product()!.averageRating" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  }
                </div>
                <span class="text-xs text-gray-500">({{ product()!.reviewCount }} reviews)</span>
              </div>
            }

            <!-- Price -->
            <div class="bg-brown-200 p-4 rounded">
              <div class="flex items-baseline gap-2">
                <span class="price-display text-2xl md:text-3xl">₹{{ product()!.calculatedPrice | number:'1.0-0' }}</span>
                <span class="text-xs text-gray-400">(Incl. of all taxes)</span>
              </div>

              <!-- Price Breakdown -->
              @if (goldRate()) {
                <div class="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
                  <div>
                    <p class="text-gray-400">Gold Value</p>
                    <p class="font-price font-bold">₹{{ goldValue() | number:'1.0-0' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-400">Making Charges</p>
                    <p class="font-price font-bold">₹{{ makingCharges() | number:'1.0-0' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-400">Wastage</p>
                    <p class="font-price font-bold">₹{{ wastageCharges() | number:'1.0-0' }}</p>
                  </div>
                  @if (product()!.stonePrice > 0) {
                    <div>
                      <p class="text-gray-400">Stone Price</p>
                      <p class="font-price font-bold">₹{{ product()!.stonePrice | number:'1.0-0' }}</p>
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Product Meta Grid -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              @for (meta of productMeta(); track meta.label) {
                <div class="bg-gray-50 p-3 rounded text-center">
                  <p class="text-[10px] text-gray-400 uppercase">{{ meta.label }}</p>
                  <p class="text-sm font-semibold text-gray-800 mt-0.5">{{ meta.value }}</p>
                </div>
              }
            </div>

            <!-- BIS HUID Hallmark (JA-specific) -->
            <div class="bg-green-50 border border-green-200 rounded p-4 flex items-center gap-4">
              <div class="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <div>
                <p class="text-xs font-bold text-green-800">BIS HALLMARKED — HUID Certified</p>
                <p class="text-[10px] text-green-600 mt-0.5">HUID No: {{ huidNumber() }}</p>
                <p class="text-[10px] text-green-500">Verified purity guarantee by Bureau of Indian Standards</p>
              </div>
            </div>

            <!-- Size Selector -->
            @if (product()!.categoryName.toLowerCase().includes('ring') || product()!.categoryName.toLowerCase().includes('bangle')) {
              <div>
                <div class="flex items-center justify-between mb-2">
                  <p class="text-xs font-heading font-bold text-gray-700 uppercase">Select Size</p>
                  <a [routerLink]="product()!.categoryName.toLowerCase().includes('ring') ? '/ring-size-guide' : '/bangle-size-guide'"
                    class="text-[10px] text-primary-700 hover:underline">SIZE GUIDE</a>
                </div>
                <div class="flex gap-2 flex-wrap">
                  @for (size of availableSizes; track size) {
                    <button (click)="selectedSize = size"
                      class="w-10 h-10 rounded border-2 text-xs font-bold transition-all flex items-center justify-center"
                      [class.border-primary-900]="selectedSize === size"
                      [class.bg-primary-900]="selectedSize === size"
                      [class.text-white]="selectedSize === size"
                      [class.border-gray-200]="selectedSize !== size"
                      [class.text-gray-600]="selectedSize !== size">{{ size }}</button>
                  }
                </div>
              </div>
            }

            <!-- Quantity & Actions -->
            <div class="flex items-center gap-4">
              <div class="flex items-center border border-gray-200 rounded">
                <button (click)="quantity > 1 && quantity = quantity - 1" class="px-3 py-2 hover:bg-gray-50 text-gray-600">−</button>
                <span class="px-4 py-2 text-sm font-bold border-x border-gray-200">{{ quantity }}</span>
                <button (click)="quantity = quantity + 1" class="px-3 py-2 hover:bg-gray-50 text-gray-600">+</button>
              </div>
              <div class="flex-1 flex gap-3">
                <button (click)="addToCart()" class="flex-1 btn-primary py-3">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                  ADD TO BAG
                </button>
                <button (click)="buyNow()" class="flex-1 btn-gold py-3">BUY NOW</button>
              </div>
            </div>

            <!-- Pincode Check -->
            <div class="flex items-center gap-2">
              <div class="relative flex-1">
                <input [(ngModel)]="pincode" placeholder="Enter Pincode" maxlength="6" class="input-field text-sm pr-20">
                <button (click)="checkPincode()" class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary-700 font-bold hover:underline">CHECK</button>
              </div>
              @if (pincodeResult()) {
                <span class="text-xs" [class.text-green-600]="pincodeResult() === 'available'" [class.text-red-500]="pincodeResult() !== 'available'">
                  {{ pincodeResult() === 'available' ? '✓ Delivery available' : '✗ Not serviceable' }}
                </span>
              }
            </div>

            <!-- Trust Badges -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              @for (badge of trustBadges; track badge.label) {
                <div class="text-center">
                  <div class="w-10 h-10 mx-auto bg-brown-200 rounded-full flex items-center justify-center mb-1">
                    <span class="text-lg">{{ badge.icon }}</span>
                  </div>
                  <p class="text-[10px] text-gray-500 font-semibold leading-tight">{{ badge.label }}</p>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- ═══════ CUSTOMIZATION CTA (JA-specific) ═══════ -->
        <div class="mt-10 bg-gradient-to-r from-primary-900 to-primary-800 rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 text-white">
          <div class="flex-shrink-0 w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          </div>
          <div class="flex-1 text-center md:text-left">
            <h3 class="text-lg font-heading font-bold">Looking for a customized product?</h3>
            <p class="text-white/70 text-sm mt-1">Our master craftsmen can create this design in your preferred metal, karat, or with custom modifications.</p>
          </div>
          <div class="flex gap-3">
            <a routerLink="/contact" class="btn-gold text-xs">CUSTOMIZE NOW</a>
            <a href="https://wa.me/919876543210?text=Hi, I'm interested in customizing product: {{ product()!.sku }}" target="_blank" class="btn-outline border-white text-white hover:bg-white hover:text-primary-900 text-xs">
              WHATSAPP US
            </a>
          </div>
        </div>

        <!-- ═══════ DESCRIPTION ═══════ -->
        @if (product()!.description) {
          <div class="mt-10">
            <h2 class="text-lg font-heading font-bold text-gray-800 uppercase tracking-wider mb-4">Product Description</h2>
            <div class="text-sm text-gray-600 leading-relaxed" [innerHTML]="product()!.description"></div>
          </div>
        }

        <!-- ═══════ REVIEWS ═══════ -->
        <div class="mt-10">
          <h2 class="text-lg font-heading font-bold text-gray-800 uppercase tracking-wider mb-6">Customer Reviews</h2>

          @if (reviews().length) {
            <div class="space-y-4">
              @for (review of reviews(); track review.id) {
                <div class="bg-gray-50 p-4 rounded">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-900 text-xs font-bold">
                        {{ review.userName.charAt(0) }}
                      </div>
                      <div>
                        <p class="text-sm font-semibold text-gray-800">{{ review.userName }}</p>
                        <p class="text-[10px] text-gray-400">{{ review.createdAt | date:'mediumDate' }}</p>
                      </div>
                    </div>
                    <div class="flex gap-0.5">
                      @for (s of [1,2,3,4,5]; track s) {
                        <svg class="w-3 h-3" [class.text-gold-500]="s <= review.rating" [class.text-gray-200]="s > review.rating" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      }
                    </div>
                  </div>
                  @if (review.comment) {
                    <p class="mt-2 text-xs text-gray-600">{{ review.comment }}</p>
                  }
                </div>
              }
            </div>
          } @else {
            <p class="text-sm text-gray-400">No reviews yet. Be the first to review this product!</p>
          }

          <!-- Write Review -->
          <div class="mt-6 bg-gray-50 p-4 rounded">
            <p class="text-sm font-heading font-bold text-gray-700 mb-3">Write a Review</p>
            <div class="flex gap-1 mb-3">
              @for (s of [1,2,3,4,5]; track s) {
                <button (click)="reviewRating = s"
                  class="w-8 h-8 flex items-center justify-center transition-colors">
                  <svg class="w-5 h-5" [class.text-gold-500]="s <= reviewRating" [class.text-gray-300]="s > reviewRating" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </button>
              }
            </div>
            <textarea [(ngModel)]="reviewComment" rows="3" placeholder="Share your thoughts about this product..." class="input-field text-sm"></textarea>
            <button (click)="submitReview()" class="btn-primary mt-3 text-xs" [disabled]="reviewRating === 0">SUBMIT REVIEW</button>
          </div>
        </div>

        <!-- ═══════ SIMILAR PRODUCTS CAROUSEL (JA-specific) ═══════ -->
        @if (relatedProducts().length) {
          <div class="mt-10">
            <h2 class="section-title text-lg">YOU MAY ALSO LIKE</h2>
            <div class="gold-divider"></div>

            <div class="relative mt-6">
              <!-- Carousel Arrows -->
              <button (click)="scrollRelated('left')"
                class="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition hidden md:flex">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button (click)="scrollRelated('right')"
                class="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition hidden md:flex">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>

              <!-- Scrollable container -->
              <div #relatedScroll class="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory scroll-smooth">
                @for (rp of relatedProducts(); track rp.id) {
                  <a [routerLink]="['/product', rp.id]" class="flex-shrink-0 w-48 md:w-56 snap-start group">
                    <div class="bg-white border border-gray-100 hover:border-gold-500/30 hover:shadow-lg transition-all duration-300">
                      <div class="aspect-square overflow-hidden bg-gray-50">
                        <img [src]="getImage(rp)" [alt]="rp.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy">
                      </div>
                      <div class="p-3">
                        <p class="text-[10px] text-gray-400 uppercase tracking-wider">{{ rp.sku }}</p>
                        <h3 class="text-xs font-heading text-gray-800 line-clamp-2 mt-1 group-hover:text-primary-900">{{ rp.name }}</h3>
                        <p class="mt-1.5 price-display text-sm">₹{{ rp.calculatedPrice | number:'1.0-0' }}</p>
                      </div>
                    </div>
                  </a>
                }
              </div>
            </div>
          </div>
        }
      </div>
    } @else {
      <div class="max-w-7xl mx-auto px-4 py-20 text-center">
        <p class="text-gray-400 text-lg">Product not found</p>
        <a routerLink="/products" class="btn-primary mt-4 inline-block">BROWSE ALL PRODUCTS</a>
      </div>
    }
  `,
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  // ── Signals ──
  loading = signal(true);
  product = signal<Product | null>(null);
  selectedImage = signal('');
  goldRate = signal<GoldRate | null>(null);
  reviews = signal<Review[]>([]);
  relatedProducts = signal<Product[]>([]);
  pincodeResult = signal('');

  // Computed
  goldValue = computed(() => {
    const p = this.product();
    const r = this.goldRate();
    return p && r ? p.netWeight * r.ratePerGram : 0;
  });
  makingCharges = computed(() => {
    const p = this.product();
    return p ? this.goldValue() * (p.makingChargePercent / 100) : 0;
  });
  wastageCharges = computed(() => {
    const p = this.product();
    return p ? this.goldValue() * (p.wastagePercent / 100) : 0;
  });
  huidNumber = computed(() => {
    const p = this.product();
    // Generate a deterministic HUID from product ID
    return p ? `HUID-${String(p.id * 7919 + 100000).padStart(8, '0')}` : '';
  });
  productMeta = computed(() => {
    const p = this.product();
    if (!p) return [];
    const meta = [
      { label: 'Metal', value: p.metal },
      { label: 'Purity', value: p.karat },
      { label: 'Gross Weight', value: `${p.grossWeight}g` },
      { label: 'Net Weight', value: `${p.netWeight}g` },
    ];
    if (p.gender) meta.push({ label: 'Gender', value: p.gender });
    if (p.collection) meta.push({ label: 'Collection', value: p.collection });
    return meta;
  });

  // Zoom
  zoomTransform = signal('scale(1)');
  zoomOrigin = signal('center center');

  // Form state
  quantity = 1;
  selectedSize = '';
  pincode = '';
  reviewRating = 0;
  reviewComment = '';
  availableSizes = ['6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '2.2', '2.4', '2.6', '2.8'];

  trustBadges = [
    { icon: '🔒', label: 'Secure Checkout' },
    { icon: '📦', label: 'Free Shipping' },
    { icon: '🔄', label: 'Lifetime Exchange' },
    { icon: '✅', label: 'BIS Hallmarked' },
  ];

  private routeSub?: Subscription;
  private isBrowser: boolean;

  constructor(
    private api: ApiService,
    private cart: CartService,
    public wishlist: WishlistService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      const id = params['id'];
      const slug = params['slug'];
      this.loading.set(true);

      const product$ = id ? this.api.getProductById(+id) : this.api.getProductBySlug(slug);
      product$.subscribe({
        next: (p) => {
          this.product.set(p);
          const primary = p.images?.find(i => i.isPrimary);
          this.selectedImage.set(primary?.imageUrl || p.images?.[0]?.imageUrl || '/assets/images/misc/placeholder.svg');
          this.loading.set(false);

          // Track recently viewed
          this.trackRecentlyViewed(p.id);

          // Load related + rates + reviews
          forkJoin({
            related: this.api.getRelatedProducts(p.id, 8),
            rates: this.api.getGoldRates(),
            reviews: this.api.getProductReviews(p.id),
          }).subscribe({
            next: (data) => {
              this.relatedProducts.set(data.related);
              const karatRate = data.rates.find(r => r.karat === p.karat) || data.rates[0];
              if (karatRate) this.goldRate.set(karatRate);
              this.reviews.set(data.reviews);
            },
          });
        },
        error: () => this.loading.set(false),
      });
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  getImage(p: Product): string {
    const primary = p.images?.find(i => i.isPrimary);
    return primary?.imageUrl || p.images?.[0]?.imageUrl || '/assets/images/misc/placeholder.svg';
  }

  // ── Zoom ──
  onZoom(event: MouseEvent): void {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    this.zoomTransform.set('scale(1.8)');
    this.zoomOrigin.set(`${x}% ${y}%`);
  }

  resetZoom(): void {
    this.zoomTransform.set('scale(1)');
    this.zoomOrigin.set('center center');
  }

  // ── Actions ──
  addToCart(): void {
    const p = this.product();
    if (!p) return;
    this.cart.addItem({
      productId: p.id,
      productName: p.name,
      slug: p.slug,
      imageUrl: this.selectedImage(),
      karat: p.karat,
      grossWeight: p.grossWeight,
      quantity: this.quantity,
      unitPrice: p.calculatedPrice,
    });
  }

  buyNow(): void {
    this.addToCart();
    this.router.navigate(['/checkout']);
  }

  toggleWishlist(): void {
    const p = this.product();
    if (p) this.wishlist.toggle(p.id);
  }

  checkPincode(): void {
    if (this.pincode.length === 6) {
      // Simulate availability check
      const available = parseInt(this.pincode) % 2 === 0;
      this.pincodeResult.set(available ? 'available' : 'unavailable');
    }
  }

  submitReview(): void {
    const p = this.product();
    if (!p || this.reviewRating === 0) return;
    this.api.createReview({
      productId: p.id,
      rating: this.reviewRating,
      comment: this.reviewComment || undefined,
    }).subscribe({
      next: (review) => {
        this.reviews.set([review, ...this.reviews()]);
        this.reviewRating = 0;
        this.reviewComment = '';
      },
    });
  }

  shareProduct(): void {
    if (this.isBrowser && navigator.share) {
      navigator.share({
        title: this.product()?.name,
        url: window.location.href,
      }).catch(() => {});
    } else if (this.isBrowser) {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  scrollRelated(direction: 'left' | 'right'): void {
    if (!this.isBrowser) return;
    const container = document.querySelector('[class*="overflow-x-auto"][class*="snap-x"]') as HTMLElement;
    if (container) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  private trackRecentlyViewed(productId: number): void {
    if (!this.isBrowser) return;
    try {
      let ids: number[] = JSON.parse(localStorage.getItem('girlyf_recently_viewed') || '[]');
      ids = ids.filter(id => id !== productId);
      ids.unshift(productId);
      ids = ids.slice(0, 12);
      localStorage.setItem('girlyf_recently_viewed', JSON.stringify(ids));
    } catch {}
  }
}
