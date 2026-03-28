import { Component, OnInit, OnDestroy, signal, computed, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, interval, Subscription } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { CartService } from '@core/services/cart.service';
import { Product, Category, GoldRate, Banner, BlogPost, Testimonial, CmsSection } from '@core/models';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    <!-- ═══════ HERO VIDEO / IMAGE BANNER ═══════ -->
    <section class="relative w-full overflow-hidden" style="height:75vh;min-height:500px">
      <!-- Video Background -->
      <div class="absolute inset-0 z-0">
        @if (heroVideoUrl()) {
          <video #heroVideo [src]="heroVideoUrl()" autoplay muted loop playsinline
            class="w-full h-full object-cover">
          </video>
        } @else {
          <!-- Fallback Image Carousel -->
          <div class="relative w-full h-full">
            @for (banner of banners(); track banner.id; let i = $index) {
              <img [src]="banner.imageUrl" [alt]="banner.title"
                class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                [class.opacity-100]="currentSlide() === i"
                [class.opacity-0]="currentSlide() !== i">
            }
          </div>
        }
        <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </div>

      <!-- Hero Content Overlay -->
      <div class="relative z-10 flex flex-col items-center justify-end h-full pb-16 text-center px-4">
        <h1 class="text-white text-3xl md:text-5xl font-heading font-bold tracking-wider drop-shadow-lg animate-fade-in-up">
          Timeless Elegance, Crafted for You
        </h1>
        <p class="text-white/90 mt-3 text-sm md:text-base max-w-xl tracking-wide animate-fade-in-up" style="animation-delay:.2s">
          Explore our exquisite collection of gold, diamond & platinum jewellery
        </p>
        <div class="mt-6 flex gap-4 animate-fade-in-up" style="animation-delay:.4s">
          <a routerLink="/gold-jewellery" class="btn-gold px-8 py-3">SHOP NOW</a>
          <a routerLink="/our-brands" class="btn-outline border-white text-white hover:bg-white hover:text-primary-900 px-8 py-3">OUR BRANDS</a>
        </div>
      </div>

      <!-- Slide Indicators -->
      @if (!heroVideoUrl() && banners().length > 1) {
        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          @for (b of banners(); track b.id; let i = $index) {
            <button (click)="goToSlide(i)"
              class="w-2.5 h-2.5 rounded-full transition-all duration-300"
              [ngClass]="currentSlide() === i ? 'bg-gold-500 w-8' : 'bg-white/50'">
            </button>
          }
        </div>
      }

      <!-- Video Mute Toggle -->
      @if (heroVideoUrl()) {
        <button (click)="toggleMute()" class="absolute bottom-6 right-6 z-10 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/40 transition">
          @if (isMuted()) {
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/></svg>
          } @else {
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
          }
        </button>
      }
    </section>

    <!-- ═══════ GOLD RATE TICKER STRIP ═══════ -->
    @if (goldRates().length) {
      <div class="bg-primary-900 text-white py-2 overflow-hidden">
        <div class="ticker-wrap">
          <div class="ticker-content">
            @for (rate of duplicatedGoldRates(); track $index) {
              <span class="inline-flex items-center gap-2 mx-8 text-xs whitespace-nowrap">
                <span class="text-gold-500 font-bold">{{ rate.karat }}</span>
                <span>Gold Rate:</span>
                <span class="font-price font-bold text-gold-400">₹{{ rate.ratePerGram | number:'1.0-0' }}/g</span>
                <span class="text-white/50">|</span>
              </span>
            }
          </div>
        </div>
      </div>
    }

    <!-- ═══════ CATEGORY CAROUSEL ═══════ -->
    <section class="py-10 md:py-14 bg-white scroll-reveal">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="section-title">SHOP BY CATEGORY</h2>
        <div class="gold-divider"></div>
        <p class="section-subtitle mb-8">Discover jewellery for every occasion</p>

        <div class="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
          @for (cat of categories(); track cat.id) {
            <a [routerLink]="['/category', cat.slug]"
              class="flex-shrink-0 snap-center group text-center w-28 md:w-32">
              <div class="category-ring w-24 h-24 md:w-28 md:h-28 mx-auto rounded-full overflow-hidden border-2 border-transparent group-hover:border-gold-500 transition-all duration-300 bg-brown-200">
                <img [src]="cat.imageUrl || '/assets/images/misc/placeholder.svg'" [alt]="cat.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
              </div>
              <p class="mt-3 text-xs font-heading font-semibold text-gray-700 group-hover:text-primary-900 uppercase tracking-wider transition-colors">{{ cat.name }}</p>
              <p class="text-[10px] text-gray-400">{{ cat.productCount }} Products</p>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- ═══════ BRAND COLLECTIONS ═══════ -->
    <section class="py-10 md:py-14 bg-brown-200 scroll-reveal">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="section-title">OUR COLLECTIONS</h2>
        <div class="gold-divider"></div>
        <p class="section-subtitle mb-8">Curated collections for the modern woman</p>

        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          @for (collection of collections; track collection.name) {
            <a [routerLink]="['/collections', collection.slug]"
              class="group relative overflow-hidden rounded bg-white shadow-sm hover:shadow-lg transition-all duration-500">
              <div class="aspect-[3/4] overflow-hidden">
                <img [src]="collection.image" [alt]="collection.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 p-4 text-center">
                <h3 class="text-white font-heading text-sm font-bold tracking-wider uppercase">{{ collection.name }}</h3>
                <span class="inline-block mt-2 text-gold-400 text-[10px] uppercase tracking-widest border-b border-gold-400 pb-0.5 group-hover:text-gold-300">Explore</span>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- ═══════ SHOP BY GENDER ═══════ -->
    <section class="py-10 md:py-14 bg-white scroll-reveal">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="section-title">SHOP FOR</h2>
        <div class="gold-divider"></div>

        <div class="grid grid-cols-3 gap-4 md:gap-6 mt-8">
          @for (gc of genderCards; track gc.label) {
            <a [routerLink]="gc.link" [queryParams]="gc.params"
              class="group relative overflow-hidden rounded bg-brown-200">
              <div class="aspect-[4/5] overflow-hidden">
                <img [src]="gc.image" [alt]="gc.label"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div class="absolute bottom-4 left-0 right-0 text-center">
                <h3 class="text-white text-lg md:text-xl font-heading font-bold tracking-wider">{{ gc.label }}</h3>
                <span class="inline-block mt-1 text-gold-400 text-xs uppercase tracking-widest group-hover:text-gold-300">Shop Now →</span>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- ═══════ FEATURED PRODUCTS ═══════ -->
    @if (featured().length) {
      <section class="py-10 md:py-14 bg-gray-50 scroll-reveal">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="section-title">FEATURED JEWELLERY</h2>
          <div class="gold-divider"></div>
          <p class="section-subtitle mb-8">Handpicked pieces from our finest collections</p>

          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            @for (product of featured(); track product.id) {
              <app-product-card [product]="product" />
            }
          </div>

          <div class="text-center mt-8">
            <a routerLink="/products" class="btn-outline">VIEW ALL PRODUCTS</a>
          </div>
        </div>
      </section>
    }

    <!-- ═══════ MID BANNERS (2-col promotional) ═══════ -->
    @if (midBanners().length) {
      <section class="py-6 scroll-reveal">
        <div class="max-w-7xl mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @for (banner of midBanners(); track banner.id) {
              <a [routerLink]="banner.linkUrl || '/products'" class="group block overflow-hidden rounded">
                <img [src]="banner.imageUrl" [alt]="banner.title"
                  class="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-700">
              </a>
            }
          </div>
        </div>
      </section>
    }

    <!-- ═══════ BESTSELLERS ═══════ -->
    @if (bestSellers().length) {
      <section class="py-10 md:py-14 bg-white scroll-reveal">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="section-title">BESTSELLERS</h2>
          <div class="gold-divider"></div>
          <p class="section-subtitle mb-8">Most loved by our customers</p>

          <div class="relative">
            <div class="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
              @for (product of bestSellers(); track product.id) {
                <div class="flex-shrink-0 w-56 md:w-60 snap-start">
                  <app-product-card [product]="product" />
                </div>
              }
            </div>
          </div>
        </div>
      </section>
    }

    <!-- ═══════ EARRING TYPES GRID (JA-specific) ═══════ -->
    <section class="py-10 md:py-14 bg-brown-200 scroll-reveal">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="section-title">SHOP BY EARRING TYPE</h2>
        <div class="gold-divider"></div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          @for (type of earringTypes; track type.label) {
            <a [routerLink]="type.link" class="group text-center bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div class="aspect-square overflow-hidden">
                <img [src]="type.image" [alt]="type.label"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
              </div>
              <div class="p-3">
                <h3 class="text-sm font-heading font-bold text-gray-800 group-hover:text-primary-900 uppercase tracking-wider">{{ type.label }}</h3>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- ═══════ CUSTOMIZATION VIDEO CTA ═══════ -->
    <section class="py-12 md:py-16 bg-primary-900 text-white scroll-reveal">
      <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
        <div class="md:w-1/2">
          <div class="relative rounded-lg overflow-hidden group cursor-pointer" (click)="playCustomVideo = !playCustomVideo">
            @if (playCustomVideo) {
              <video src="/assets/images/misc/customize-banner.jpg" autoplay controls class="w-full aspect-video object-cover" poster="/assets/images/misc/customize-banner.jpg"></video>
            } @else {
              <img src="/assets/images/misc/customize-banner.jpg" alt="Customize" class="w-full aspect-video object-cover">
              <div class="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition">
                <div class="w-16 h-16 rounded-full bg-gold-500 flex items-center justify-center animate-pulse-gold">
                  <svg class="w-8 h-8 text-primary-900 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
            }
          </div>
        </div>
        <div class="md:w-1/2 text-center md:text-left">
          <h2 class="text-2xl md:text-3xl font-heading font-bold tracking-wider">CUSTOMIZE YOUR JEWELLERY</h2>
          <p class="mt-3 text-white/80 text-sm leading-relaxed">
            Can't find what you're looking for? Let our master craftsmen create a bespoke piece just for you.
            Share your design or pick from our catalog — we'll bring your vision to life.
          </p>
          <div class="mt-6 flex gap-4 justify-center md:justify-start">
            <a routerLink="/contact" class="btn-gold">GET STARTED</a>
            <a href="https://wa.me/919876543210" target="_blank" class="btn-outline border-white text-white hover:bg-white hover:text-primary-900">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              WHATSAPP US
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════ NEW ARRIVALS ═══════ -->
    @if (newArrivals().length) {
      <section class="py-10 md:py-14 bg-white scroll-reveal">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="section-title">NEW ARRIVALS</h2>
          <div class="gold-divider"></div>
          <p class="section-subtitle mb-8">The latest additions to our collection</p>

          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            @for (product of newArrivals(); track product.id) {
              <app-product-card [product]="product" />
            }
          </div>
        </div>
      </section>
    }

    <!-- ═══════ PRODUCTS UNDER ₹2K ═══════ -->
    <section class="py-10 md:py-14 bg-gold-50 scroll-reveal">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="section-title">PRODUCTS UNDER ₹2,000</h2>
        <div class="gold-divider"></div>
        <p class="section-subtitle mb-8">Affordable luxury — perfect gifts for every occasion</p>

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          @for (product of under2k(); track product.id) {
            <app-product-card [product]="product" />
          }
        </div>

        <div class="text-center mt-8">
          <a routerLink="/products" [queryParams]="{maxPrice: 2000}" class="btn-primary">VIEW ALL UNDER ₹2K</a>
        </div>
      </div>
    </section>

    <!-- ═══════ DIGI GOLD + GIFT CARDS ═══════ -->
    <section class="py-10 md:py-14 bg-white scroll-reveal">
      <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Digi Gold -->
        <a routerLink="/digi-gold" class="group relative overflow-hidden rounded-lg bg-gradient-to-br from-gold-500 to-gold-700 p-8 md:p-10 text-primary-900 hover:shadow-xl transition-shadow">
          <div class="relative z-10">
            <span class="text-xs font-accent font-bold uppercase tracking-widest opacity-70">Invest Smart</span>
            <h3 class="text-2xl md:text-3xl font-heading font-bold mt-2">DIGI GOLD</h3>
            <p class="mt-2 text-sm opacity-80 max-w-xs">Start investing in 24K digital gold from as low as ₹100. Safe, secure & certified.</p>
            <span class="inline-block mt-4 btn-primary bg-primary-900 text-white text-xs">START INVESTING →</span>
          </div>
          <svg class="absolute -right-8 -bottom-8 w-40 h-40 opacity-10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </a>

        <!-- Gift Cards -->
        <a routerLink="/gift-cards" class="group relative overflow-hidden rounded-lg bg-gradient-to-br from-primary-800 to-primary-900 p-8 md:p-10 text-white hover:shadow-xl transition-shadow">
          <div class="relative z-10">
            <span class="text-xs font-accent font-bold uppercase tracking-widest text-gold-400">Perfect Gift</span>
            <h3 class="text-2xl md:text-3xl font-heading font-bold mt-2">GIFT CARDS</h3>
            <p class="mt-2 text-sm text-white/80 max-w-xs">Give the gift of choice. Girlyf gift cards available from ₹500 to ₹1,00,000.</p>
            <span class="inline-block mt-4 btn-gold text-xs">SHOP GIFT CARDS →</span>
          </div>
          <svg class="absolute -right-8 -bottom-8 w-40 h-40 opacity-10 text-gold-500" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 00-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/></svg>
        </a>
      </div>
    </section>

    <!-- ═══════ TESTIMONIALS ═══════ -->
    @if (testimonials().length) {
      <section class="py-10 md:py-14 bg-brown-200 scroll-reveal">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="section-title">WHAT OUR CUSTOMERS SAY</h2>
          <div class="gold-divider"></div>

          <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            @for (t of testimonials(); track t.id) {
              <div class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div class="flex gap-0.5 mb-3">
                  @for (s of [1,2,3,4,5]; track s) {
                    <svg class="w-4 h-4" [class.text-gold-500]="s <= t.rating" [class.text-gray-200]="s > t.rating" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  }
                </div>
                <p class="text-sm text-gray-600 italic leading-relaxed line-clamp-3">"{{ t.comment }}"</p>
                <div class="mt-4 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-900 font-bold text-sm">
                    {{ t.customerName.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-800">{{ t.customerName }}</p>
                    @if (t.location) {
                      <p class="text-[10px] text-gray-400">{{ t.location }}</p>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>
    }

    <!-- ═══════ RECENTLY VIEWED ═══════ -->
    @if (recentlyViewed().length) {
      <section class="py-10 md:py-14 bg-white scroll-reveal">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="section-title">RECENTLY VIEWED</h2>
          <div class="gold-divider"></div>

          <div class="grid grid-cols-3 md:grid-cols-6 gap-3 mt-8">
            @for (product of recentlyViewed(); track product.id) {
              <app-product-card [product]="product" />
            }
          </div>
        </div>
      </section>
    }

    <!-- ═══════ BLOG ═══════ -->
    @if (blogPosts().length) {
      <section class="py-10 md:py-14 bg-gray-50 scroll-reveal">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="section-title">FROM OUR BLOG</h2>
          <div class="gold-divider"></div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            @for (post of blogPosts(); track post.id) {
              <a [routerLink]="['/blog', post.slug]" class="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div class="aspect-[16/10] overflow-hidden">
                  <img [src]="post.featuredImageUrl || '/assets/images/misc/placeholder.svg'" [alt]="post.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                </div>
                <div class="p-5">
                  <p class="text-[10px] text-gold-600 uppercase font-accent font-bold tracking-wider">{{ post.publishedAt | date:'mediumDate' }}</p>
                  <h3 class="mt-2 text-sm font-heading font-bold text-gray-800 group-hover:text-primary-900 line-clamp-2 transition-colors">{{ post.title }}</h3>
                  <p class="mt-2 text-xs text-gray-500 line-clamp-2">{{ post.excerpt }}</p>
                  <span class="inline-block mt-3 text-xs text-primary-700 font-semibold uppercase tracking-wider group-hover:text-primary-900">Read More →</span>
                </div>
              </a>
            }
          </div>

          <div class="text-center mt-8">
            <a routerLink="/blog" class="btn-outline">VIEW ALL POSTS</a>
          </div>
        </div>
      </section>
    }

    <!-- ═══════ CATEGORY TAGS STRIP ═══════ -->
    <section class="py-6 bg-brown-200">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex flex-wrap gap-2 justify-center">
          @for (tag of categoryTags; track tag.label) {
            <a [routerLink]="tag.link" class="filter-chip text-[11px] hover:bg-primary-900 hover:text-white hover:border-primary-900">{{ tag.label }}</a>
          }
        </div>
      </div>
    </section>

    <!-- ═══════ SEO CONTENT + FAQ ═══════ -->
    <section class="py-10 md:py-14 bg-white">
      <div class="max-w-4xl mx-auto px-4">
        <h2 class="section-title text-lg">BUY JEWELLERY ONLINE AT GIRLYF</h2>
        <div class="gold-divider"></div>

        <div class="mt-6 text-sm text-gray-600 leading-relaxed space-y-3" [class.line-clamp-3]="!showFullSeo">
          <p>Girlyf is India's most trusted online jewellery store, offering a wide range of gold, diamond, platinum, and silver jewellery. From timeless traditional designs to modern contemporary pieces, our collection caters to every taste and occasion.</p>
          <p>Whether you're looking for wedding jewellery, daily wear gold chains, stunning diamond earrings, or elegant platinum rings, Girlyf has it all. Each piece is BIS hallmarked, certified, and crafted by master artisans with decades of experience.</p>
          <p>Shop with confidence knowing every purchase is backed by our lifetime exchange guarantee, certified purity, and secure shipping across India. Explore our exclusive collections like IVY, Butterfly, Mirage, Orchid, and Solo.</p>
        </div>
        <button (click)="showFullSeo = !showFullSeo" class="mt-2 text-xs text-primary-700 font-semibold hover:underline">
          {{ showFullSeo ? 'SHOW LESS' : 'READ MORE' }}
        </button>

        <!-- FAQ Accordion -->
        <div class="mt-8 space-y-2">
          <h3 class="text-sm font-heading font-bold text-gray-800 uppercase tracking-wider mb-4">Frequently Asked Questions</h3>
          @for (faq of homeFaqs; track faq.q; let i = $index) {
            <div class="border border-gray-200 rounded">
              <button (click)="toggleFaq(i)" class="w-full text-left px-4 py-3 flex items-center justify-between text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                {{ faq.q }}
                <svg class="w-4 h-4 transition-transform" [class.rotate-180]="openFaq() === i" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>
              @if (openFaq() === i) {
                <div class="px-4 pb-3 text-xs text-gray-500 leading-relaxed animate-fade-in-up">{{ faq.a }}</div>
              }
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ═══════ WHATSAPP FLOATING BUTTON ═══════ -->
    <a href="https://wa.me/919876543210" target="_blank"
      class="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
      style="animation: whatsappPulse 2s ease-in-out infinite">
      <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
    </a>

    <!-- ═══════ LOADING STATE ═══════ -->
    @if (loading()) {
      <div class="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
        <div class="w-16 h-16 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin"></div>
        <p class="mt-4 text-sm text-gray-400 font-heading tracking-wider">Loading Girlyf...</p>
      </div>
    }
  `,
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  // ── Signals ──
  loading = signal(true);
  banners = signal<Banner[]>([]);
  midBanners = signal<Banner[]>([]);
  categories = signal<Category[]>([]);
  goldRates = signal<GoldRate[]>([]);
  featured = signal<Product[]>([]);
  bestSellers = signal<Product[]>([]);
  newArrivals = signal<Product[]>([]);
  under2k = signal<Product[]>([]);
  testimonials = signal<Testimonial[]>([]);
  blogPosts = signal<BlogPost[]>([]);
  recentlyViewed = signal<Product[]>([]);
  currentSlide = signal(0);
  openFaq = signal<number | null>(null);
  heroVideoUrl = signal<string | null>(null);
  isMuted = signal(true);

  // Computed: duplicate gold rates for seamless ticker loop
  duplicatedGoldRates = computed(() => [...this.goldRates(), ...this.goldRates()]);

  showFullSeo = false;
  playCustomVideo = false;

  private slideInterval?: Subscription;
  private isBrowser: boolean;

  // ── Static Data ──
  collections = [
    { name: 'IVY', slug: 'ivy', image: '/assets/images/collections/ivy.avif' },
    { name: 'Butterfly', slug: 'butterfly', image: '/assets/images/collections/butterfly.avif' },
    { name: 'Mirage', slug: 'mirage', image: '/assets/images/collections/mirage.avif' },
    { name: 'Orchid', slug: 'orchid', image: '/assets/images/collections/orchid.avif' },
    { name: 'Solo', slug: 'solo', image: '/assets/images/collections/solo.avif' },
  ];

  genderCards = [
    { label: 'Women', image: '/assets/images/gender/women.avif', link: '/gold-jewellery', params: { gender: 'Women' } },
    { label: 'Men', image: '/assets/images/gender/men.avif', link: '/gold-jewellery', params: { gender: 'Men' } },
    { label: 'Kids', image: '/assets/images/gender/kids.avif', link: '/kids-jewellery', params: {} },
  ];

  earringTypes = [
    { label: 'Drops', image: '/assets/images/earring-types/drops.avif', link: '/gold-jewellery/earrings' },
    { label: 'Hoops', image: '/assets/images/earring-types/hoops.avif', link: '/gold-jewellery/earrings' },
    { label: 'Jhumkas', image: '/assets/images/earring-types/jhumkas.avif', link: '/gold-jewellery/earrings' },
    { label: 'Studs', image: '/assets/images/earring-types/studs.avif', link: '/gold-jewellery/earrings' },
  ];

  categoryTags = [
    { label: 'Gold Rings', link: '/gold-jewellery/rings' },
    { label: 'Gold Earrings', link: '/gold-jewellery/earrings' },
    { label: 'Gold Necklaces', link: '/gold-jewellery/necklaces' },
    { label: 'Gold Bangles', link: '/gold-jewellery/bangles' },
    { label: 'Gold Chains', link: '/gold-jewellery/chains' },
    { label: 'Diamond Rings', link: '/diamond-jewellery/rings' },
    { label: 'Diamond Earrings', link: '/diamond-jewellery/earrings' },
    { label: 'Diamond Pendants', link: '/diamond-jewellery/pendants' },
    { label: 'Platinum Rings', link: '/platinum-jewellery/rings' },
    { label: 'Silver Jewellery', link: '/silver-jewellery' },
    { label: 'Kids Jewellery', link: '/kids-jewellery' },
    { label: 'Gold Coins', link: '/gold-coin' },
    { label: 'Wedding Jewellery', link: '/gold-jewellery' },
    { label: '18K Jewellery', link: '/18k-jewellery' },
  ];

  homeFaqs = [
    { q: 'Is Girlyf jewellery BIS hallmarked?', a: 'Yes, all gold jewellery sold at Girlyf is BIS hallmarked ensuring purity and quality. Each piece comes with a unique HUID number for verification.' },
    { q: 'Do you offer lifetime exchange?', a: 'Absolutely! We offer lifetime exchange on all gold and diamond jewellery purchased from Girlyf. You can exchange at any of our stores across India.' },
    { q: 'How is the gold rate calculated for pricing?', a: 'Our prices are updated daily based on the prevailing gold rate. The final price includes gold value, making charges, wastage, GST, and stone charges (if applicable).' },
    { q: 'Is Cash on Delivery available?', a: 'Yes, we offer Cash on Delivery for orders up to ₹2,00,000. Additional payment options include UPI, PhonePe, CCAvenue (Credit/Debit/Net Banking), and Digi Gold wallet.' },
    { q: 'What is your return policy?', a: 'We offer a 15-day return/exchange policy. Products must be in original condition with all tags and certificates. Returns are processed within 7 working days.' },
  ];

  constructor(
    private api: ApiService,
    private cart: CartService,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loadData();
    this.loadRecentlyViewed();
    this.startSlideshow();
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.initScrollReveal();
    }
  }

  ngOnDestroy(): void {
    this.slideInterval?.unsubscribe();
  }

  private loadData(): void {
    forkJoin({
      banners: this.api.getBanners('hero'),
      midBanners: this.api.getBanners('mid'),
      categories: this.api.getCategories(),
      goldRates: this.api.getGoldRates(),
      featured: this.api.getFeaturedProducts(10),
      bestSellers: this.api.getBestSellers(10),
      newArrivals: this.api.getNewArrivals(10),
      testimonials: this.api.getTestimonials(6),
      blogPosts: this.api.getLatestPosts(3),
    }).subscribe({
      next: (data) => {
        this.banners.set(data.banners);
        this.midBanners.set(data.midBanners);
        this.categories.set(data.categories);
        this.goldRates.set(data.goldRates);
        this.featured.set(data.featured);
        this.bestSellers.set(data.bestSellers);
        this.newArrivals.set(data.newArrivals);
        this.testimonials.set(data.testimonials);
        this.blogPosts.set(data.blogPosts);

        // Check for video in banners
        const heroVideo = data.banners.find((b: Banner) => b.title?.toLowerCase().includes('video'));
        if (heroVideo?.mobileImageUrl?.endsWith('.mp4')) {
          this.heroVideoUrl.set(heroVideo.mobileImageUrl);
        }

        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    // Load under 2k products separately
    this.api.getProducts({ maxPrice: 2000, pageSize: 6, page: 1 }).subscribe({
      next: (res) => this.under2k.set(res.items),
    });
  }

  private loadRecentlyViewed(): void {
    if (!this.isBrowser) return;
    try {
      const ids: number[] = JSON.parse(localStorage.getItem('girlyf_recently_viewed') || '[]');
      if (ids.length) {
        // Load first 6 recently viewed products
        const requests = ids.slice(0, 6).map(id => this.api.getProductById(id));
        forkJoin(requests).subscribe({
          next: (products) => this.recentlyViewed.set(products.filter(Boolean)),
        });
      }
    } catch {}
  }

  private startSlideshow(): void {
    this.slideInterval = interval(5000).subscribe(() => {
      const total = this.banners().length;
      if (total > 1) {
        this.currentSlide.set((this.currentSlide() + 1) % total);
      }
    });
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
  }

  toggleMute(): void {
    this.isMuted.set(!this.isMuted());
    const video = document.querySelector('video') as HTMLVideoElement;
    if (video) video.muted = this.isMuted();
  }

  toggleFaq(index: number): void {
    this.openFaq.set(this.openFaq() === index ? null : index);
  }

  private initScrollReveal(): void {
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
  }
}
