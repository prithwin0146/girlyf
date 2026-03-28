import { Component, OnInit, OnDestroy, signal, computed, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ApiService } from '@core/services/api.service';
import { CartService } from '@core/services/cart.service';
import { Product, Category, GoldRate, Banner, BlogPost, Testimonial, CmsSection } from '@core/models';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, CarouselModule, ProductCardComponent],
  template: `
    <!-- TRUST BADGES TICKER (Section 9) -->
    <div class="bg-white border-b border-gray-100 py-2 overflow-hidden">
      <div class="ticker-wrap">
        <div class="ticker-content">
          @for (badge of trustBadgesDuplicated; track $index) {
            <span class="inline-flex items-center gap-2 mx-6 whitespace-nowrap">
              <img [src]="badge.icon" [alt]="badge.label" class="h-8 w-auto">
              <span class="text-xs text-gray-700 font-medium">{{ badge.label }}</span>
            </span>
          }
        </div>
      </div>
    </div>

    <!-- HERO BANNER CAROUSEL (Section 1 - Owl Carousel) -->
    <section class="w-full relative">
      @if (isBrowser && bannersLoaded()) {
        <owl-carousel-o [options]="heroBannerOptions">
          @for (banner of heroBanners; track $index) {
            <ng-template carouselSlide>
              <a [routerLink]="banner.link" class="block w-full cursor-pointer">
                <picture>
                  <source media="(max-width: 768px)" [srcset]="banner.mobile">
                  <img [src]="banner.desktop" [alt]="banner.alt"
                    class="w-full h-auto" style="aspect-ratio: 1920/600" loading="eager">
                </picture>
              </a>
            </ng-template>
          }
        </owl-carousel-o>
      } @else {
        <div class="w-full bg-brown-200 animate-pulse" style="aspect-ratio: 1920/600"></div>
      }
    </section>

    <!-- GOLD RATE TICKER -->
    @if (goldRates().length) {
      <div class="bg-primary-900 text-white py-2 overflow-hidden">
        <div class="ticker-wrap">
          <div class="ticker-content">
            @for (rate of duplicatedGoldRates(); track $index) {
              <span class="inline-flex items-center gap-2 mx-8 text-xs whitespace-nowrap">
                <span class="text-gold-500 font-bold">{{ rate.karat }}</span>
                <span>Gold Rate:</span>
                <span class="font-price font-bold text-gold-400">&#8377;{{ rate.ratePerGram | number:'1.0-0' }}/g</span>
                <span class="text-white/50">|</span>
              </span>
            }
          </div>
        </div>
      </div>
    }

    <!-- SHOP BY CATEGORY (Section 2 - Owl Carousel) -->
    <section class="py-10 md:py-14 bg-white animate__animated animate__fadeIn scroll-reveal">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="section-title">SHOP BY CATEGORY</h2>
        <div class="gold-divider"></div>
        <p class="section-subtitle mb-8">Discover jewellery for every occasion</p>

        @if (isBrowser) {
          <owl-carousel-o [options]="categoryOptions">
            @for (cat of categoryCards; track cat.name) {
              <ng-template carouselSlide>
                <a [routerLink]="cat.link" class="block text-center group px-2">
                  <div class="mx-auto w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-transparent group-hover:border-gold-500 transition-all duration-300 bg-brown-200">
                    <img [src]="cat.image" [alt]="cat.name"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy">
                  </div>
                  <p class="mt-3 text-xs font-heading font-semibold text-gray-700 group-hover:text-primary-900 uppercase tracking-wider">{{ cat.name }}</p>
                </a>
              </ng-template>
            }
          </owl-carousel-o>
        } @else {
          <div class="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
            @for (cat of categoryCards; track cat.name) {
              <a [routerLink]="cat.link" class="flex-shrink-0 text-center w-32">
                <div class="mx-auto w-28 h-28 rounded-full overflow-hidden bg-brown-200">
                  <img [src]="cat.image" [alt]="cat.name" class="w-full h-full object-cover">
                </div>
                <p class="mt-3 text-xs font-heading font-semibold text-gray-700 uppercase tracking-wider">{{ cat.name }}</p>
              </a>
            }
          </div>
        }
      </div>
    </section>

    <!-- JEWELLERY FOR HER BANNER (Section 3) -->
    <section class="scroll-reveal">
      <a routerLink="/gold-jewellery" [queryParams]="{gender: 'Women'}" class="block">
        <img src="/assets/images/misc/jewellery-for-her.avif" alt="Jewellery For Her"
          class="w-full h-auto" loading="lazy">
      </a>
    </section>

    <!-- BRAND COLLECTIONS (Section 4) -->
    <section class="py-10 md:py-14 bg-brown-200 animate__animated animate__fadeIn scroll-reveal">
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
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy">
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

    <!-- CELEBRATION EDIT BANNER (Section 5) -->
    <section class="scroll-reveal">
      <a routerLink="/gold-jewellery" class="block">
        <img src="/assets/images/misc/celebration-edit.avif" alt="Celebration Edit"
          class="w-full h-auto" loading="lazy">
      </a>
    </section>

    <!-- PRODUCTS UNDER 2K (Section 6) -->
    <section class="py-10 md:py-14 bg-white scroll-reveal">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center gap-8 mb-8">
          <img src="/assets/images/misc/ja-logo-section.avif" alt="Girlyf" class="h-10 w-auto" loading="lazy">
          <div class="text-center md:text-left">
            <h2 class="section-title !mb-0">PRODUCTS UNDER &#8377;2,000</h2>
            <p class="section-subtitle">Affordable luxury for every occasion</p>
          </div>
        </div>

        @if (isBrowser && under2k().length) {
          <owl-carousel-o [options]="productCarouselOptions">
            @for (product of under2k(); track product.id) {
              <ng-template carouselSlide>
                <div class="px-2">
                  <app-product-card [product]="product" />
                </div>
              </ng-template>
            }
          </owl-carousel-o>
        } @else {
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            @for (product of under2k(); track product.id) {
              <app-product-card [product]="product" />
            }
          </div>
        }

        <div class="text-center mt-8">
          <a routerLink="/products" [queryParams]="{maxPrice: 2000}" class="btn-primary inline-flex items-center gap-1">
            <mat-icon class="text-sm">arrow_forward</mat-icon> VIEW ALL UNDER &#8377;2K
          </a>
        </div>
      </div>
    </section>

    <!-- FEATURED PRODUCTS (Owl Carousel) -->
    @if (featured().length) {
      <section class="py-10 md:py-14 bg-gray-50 scroll-reveal">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="section-title">FEATURED JEWELLERY</h2>
          <div class="gold-divider"></div>
          <p class="section-subtitle mb-8">Handpicked pieces from our finest collections</p>

          @if (isBrowser) {
            <owl-carousel-o [options]="productCarouselOptions">
              @for (product of featured(); track product.id) {
                <ng-template carouselSlide>
                  <div class="px-2">
                    <app-product-card [product]="product" />
                  </div>
                </ng-template>
              }
            </owl-carousel-o>
          } @else {
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
              @for (product of featured(); track product.id) {
                <app-product-card [product]="product" />
              }
            </div>
          }

          <div class="text-center mt-8">
            <a routerLink="/products" class="btn-outline">VIEW ALL PRODUCTS</a>
          </div>
        </div>
      </section>
    }

    <!-- GIFTS BANNER (Section 8) -->
    <section class="scroll-reveal">
      <a routerLink="/gift-cards" class="block">
        <img src="/assets/images/misc/gifts.avif" alt="Gifts"
          class="w-full h-auto" loading="lazy">
      </a>
    </section>

    <!-- CUSTOMIZATION VIDEO CTA (Section 10) -->
    <section class="py-12 md:py-16 bg-primary-900 text-white scroll-reveal">
      <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
        <div class="md:w-1/2">
          <div class="relative rounded-lg overflow-hidden">
            <video src="/assets/images/videos/customization.mp4" autoplay muted loop playsinline
              class="w-full aspect-video object-cover">
            </video>
          </div>
        </div>
        <div class="md:w-1/2 text-center md:text-left">
          <h2 class="text-2xl md:text-3xl font-heading font-bold tracking-wider">CUSTOMIZE YOUR JEWELLERY</h2>
          <p class="mt-3 text-white/80 text-sm leading-relaxed">
            Let our master craftsmen create a bespoke piece just for you.
            Share your design or pick from our catalog.
          </p>
          <div class="mt-6 flex gap-4 justify-center md:justify-start">
            <a routerLink="/contact" class="btn-gold inline-flex items-center gap-1">
              <mat-icon class="text-base">design_services</mat-icon> GET STARTED
            </a>
            <a href="https://wa.me/919876543210" target="_blank" class="btn-outline border-white text-white hover:bg-white hover:text-primary-900 inline-flex items-center gap-2">
              <mat-icon class="text-base">chat</mat-icon> WHATSAPP
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- AIRA COLLECTION VIDEO (Section 11) -->
    <section class="scroll-reveal">
      <a routerLink="/collections/aira" class="block relative">
        <video class="w-full h-auto hidden md:block" autoplay muted loop playsinline
          src="/assets/images/videos/aira-banner.mp4"></video>
        <video class="w-full h-auto md:hidden" autoplay muted loop playsinline
          src="/assets/images/videos/aira-responsive.mp4"></video>
      </a>
    </section>

    <!-- SHOP BY GENDER (Section 12) -->
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
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy">
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div class="absolute bottom-4 left-0 right-0 text-center">
                <h3 class="text-white text-lg md:text-xl font-heading font-bold tracking-wider">{{ gc.label }}</h3>
                <span class="inline-block mt-1 text-gold-400 text-xs uppercase tracking-widest">Shop Now</span>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- EARRING TYPES (Section 13) -->
    <section class="py-10 md:py-14 bg-brown-200 scroll-reveal">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="section-title">SHOP BY EARRING TYPE</h2>
        <div class="gold-divider"></div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          @for (type of earringTypes; track type.label) {
            <a [routerLink]="type.link" class="group text-center bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div class="aspect-square overflow-hidden">
                <img [src]="type.image" [alt]="type.label"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy">
              </div>
              <div class="p-3">
                <h3 class="text-sm font-heading font-bold text-gray-800 group-hover:text-primary-900 uppercase tracking-wider">{{ type.label }}</h3>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- DIGI GOLD / EASY BUY / GIFT CARD / GOLD COIN (Section 14) -->
    <section class="py-10 md:py-14 bg-white scroll-reveal">
      <div class="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        @for (card of financialCards; track card.label) {
          <a [routerLink]="card.link" class="group block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div class="aspect-[4/3] overflow-hidden">
              <img [src]="card.image" [alt]="card.label"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
            </div>
            <div class="p-3 text-center bg-white">
              <h3 class="text-xs font-heading font-bold text-gray-800 uppercase tracking-wider">{{ card.label }}</h3>
            </div>
          </a>
        }
      </div>
    </section>

    <!-- ENSEMBLE COLLECTION BANNER (Section 15) -->
    <section class="scroll-reveal">
      <a routerLink="/collections/ensemble" class="block">
        <picture>
          <source media="(max-width: 768px)" srcset="/assets/images/collections/ensemble-mobile.avif">
          <img src="/assets/images/collections/ensemble.avif" alt="Ensemble Collection"
            class="w-full h-auto" loading="lazy">
        </picture>
      </a>
    </section>

    <!-- FLUTTER COLLECTION VIDEO (Section 16) -->
    <section class="scroll-reveal">
      <a routerLink="/collections/flutter" class="block relative">
        <video class="w-full h-auto hidden md:block" autoplay muted loop playsinline
          src="/assets/images/videos/flutter-banner.mp4"></video>
        <video class="w-full h-auto md:hidden" autoplay muted loop playsinline
          src="/assets/images/videos/flutter-responsive.mp4"></video>
      </a>
    </section>

    <!-- BESTSELLERS (Owl Carousel) -->
    @if (bestSellers().length) {
      <section class="py-10 md:py-14 bg-white scroll-reveal">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="section-title">BESTSELLERS</h2>
          <div class="gold-divider"></div>
          <p class="section-subtitle mb-8">Most loved by our customers</p>

          @if (isBrowser) {
            <owl-carousel-o [options]="productCarouselOptions">
              @for (product of bestSellers(); track product.id) {
                <ng-template carouselSlide>
                  <div class="px-2">
                    <app-product-card [product]="product" />
                  </div>
                </ng-template>
              }
            </owl-carousel-o>
          } @else {
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
              @for (product of bestSellers(); track product.id) {
                <app-product-card [product]="product" />
              }
            </div>
          }
        </div>
      </section>
    }

    <!-- TESTIMONIALS -->
    @if (testimonials().length) {
      <section class="py-10 md:py-14 bg-brown-200 scroll-reveal">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="section-title">WHAT OUR CUSTOMERS SAY</h2>
          <div class="gold-divider"></div>

          @if (isBrowser) {
            <div class="mt-8">
              <owl-carousel-o [options]="testimonialOptions">
                @for (t of testimonials(); track t.id) {
                  <ng-template carouselSlide>
                    <div class="px-2">
                      <div class="bg-white p-6 rounded-lg shadow-sm h-full">
                        <div class="flex gap-0.5 mb-3">
                          @for (s of [1,2,3,4,5]; track s) {
                            <mat-icon class="text-sm" [ngClass]="s <= t.rating ? 'text-gold-500' : 'text-gray-200'">star</mat-icon>
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
                    </div>
                  </ng-template>
                }
              </owl-carousel-o>
            </div>
          }
        </div>
      </section>
    }

    <!-- BLOG -->
    @if (blogPosts().length) {
      <section class="py-10 md:py-14 bg-gray-50 scroll-reveal">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="section-title">FROM OUR BLOG</h2>
          <div class="gold-divider"></div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            @for (post of blogPosts(); track post.id) {
              <a [routerLink]="['/blog', post.slug]" class="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div class="aspect-[16/10] overflow-hidden">
                  <img [src]="post.featuredImageUrl || '/assets/images/blog/placeholder.avif'" [alt]="post.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
                </div>
                <div class="p-5">
                  <p class="text-[10px] text-gold-600 uppercase font-accent font-bold tracking-wider">{{ post.publishedAt | date:'mediumDate' }}</p>
                  <h3 class="mt-2 text-sm font-heading font-bold text-gray-800 group-hover:text-primary-900 line-clamp-2">{{ post.title }}</h3>
                  <p class="mt-2 text-xs text-gray-500 line-clamp-2">{{ post.excerpt }}</p>
                  <span class="inline-flex items-center gap-1 mt-3 text-xs text-primary-700 font-semibold uppercase tracking-wider group-hover:text-primary-900">
                    Read More <mat-icon class="text-sm">arrow_forward</mat-icon>
                  </span>
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

    <!-- APP DOWNLOAD -->
    <section class="py-10 bg-primary-900 text-white scroll-reveal">
      <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
        <div class="md:w-1/3">
          <img src="/assets/images/misc/mobile-app.avif" alt="Girlyf Mobile App" class="w-48 mx-auto" loading="lazy">
        </div>
        <div class="md:w-2/3 text-center md:text-left">
          <h3 class="text-xl font-heading font-bold tracking-wider">DOWNLOAD OUR APP</h3>
          <p class="mt-2 text-white/70 text-sm">Shop on the go with exclusive app-only offers</p>
          <div class="flex gap-3 mt-4 justify-center md:justify-start">
            <a href="#" class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 text-sm transition-colors">
              <mat-icon>apple</mat-icon> App Store
            </a>
            <a href="#" class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 text-sm transition-colors">
              <mat-icon>shop</mat-icon> Google Play
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- CATEGORY TAGS -->
    <section class="py-6 bg-brown-200">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex flex-wrap gap-2 justify-center">
          @for (tag of categoryTags; track tag.label) {
            <a [routerLink]="tag.link" class="filter-chip text-[11px] hover:bg-primary-900 hover:text-white hover:border-primary-900">{{ tag.label }}</a>
          }
        </div>
      </div>
    </section>

    <!-- SEO + FAQ -->
    <section class="py-10 md:py-14 bg-white">
      <div class="max-w-4xl mx-auto px-4">
        <h2 class="section-title text-lg">BUY JEWELLERY ONLINE AT GIRLYF</h2>
        <div class="gold-divider"></div>

        <div class="mt-6 text-sm text-gray-600 leading-relaxed space-y-3" [class.line-clamp-3]="!showFullSeo">
          <p>Girlyf is India's most trusted online jewellery store, offering a wide range of gold, diamond, platinum, and silver jewellery.</p>
          <p>Whether you're looking for wedding jewellery, daily wear gold chains, stunning diamond earrings, or elegant platinum rings, Girlyf has it all.</p>
          <p>Shop with confidence knowing every purchase is backed by our lifetime exchange guarantee, certified purity, and secure shipping across India.</p>
        </div>
        <button (click)="showFullSeo = !showFullSeo" class="mt-2 text-xs text-primary-700 font-semibold hover:underline">
          {{ showFullSeo ? 'SHOW LESS' : 'READ MORE' }}
        </button>

        <div class="mt-8 space-y-2">
          <h3 class="text-sm font-heading font-bold text-gray-800 uppercase tracking-wider mb-4">Frequently Asked Questions</h3>
          @for (faq of homeFaqs; track faq.q; let i = $index) {
            <div class="border border-gray-200 rounded">
              <button (click)="toggleFaq(i)" class="w-full text-left px-4 py-3 flex items-center justify-between text-sm font-semibold text-gray-700 hover:bg-gray-50">
                {{ faq.q }}
                <mat-icon class="text-base transition-transform" [class.rotate-180]="openFaq() === i">expand_more</mat-icon>
              </button>
              @if (openFaq() === i) {
                <div class="px-4 pb-3 text-xs text-gray-500 leading-relaxed animate__animated animate__fadeIn">{{ faq.a }}</div>
              }
            </div>
          }
        </div>
      </div>
    </section>

    <!-- WHATSAPP FLOATING BUTTON -->
    <a href="https://wa.me/919876543210" target="_blank"
      class="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors animate__animated animate__bounceIn"
      style="animation-delay: 2s">
      <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
    </a>

    <!-- LOADING -->
    @if (loading()) {
      <div class="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
        <div class="w-16 h-16 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin"></div>
        <p class="mt-4 text-sm text-gray-400 font-heading tracking-wider">Loading Girlyf...</p>
      </div>
    }
  `,
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
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
  openFaq = signal<number | null>(null);
  bannersLoaded = signal(false);

  duplicatedGoldRates = computed(() => [...this.goldRates(), ...this.goldRates()]);

  showFullSeo = false;
  isBrowser: boolean;

  private subs: Subscription[] = [];

  heroBannerOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    nav: true,
    navText: [
      '<span class="material-icons">chevron_left</span>',
      '<span class="material-icons">chevron_right</span>'
    ],
    responsive: { 0: { items: 1 }, 768: { items: 1 }, 1024: { items: 1 } },
  };

  categoryOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 500,
    autoplay: true,
    autoplayTimeout: 3000,
    nav: true,
    navText: [
      '<span class="material-icons">chevron_left</span>',
      '<span class="material-icons">chevron_right</span>'
    ],
    responsive: { 0: { items: 3 }, 480: { items: 4 }, 768: { items: 5 }, 1024: { items: 7 } },
  };

  productCarouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 500,
    autoplay: false,
    nav: true,
    navText: [
      '<span class="material-icons">chevron_left</span>',
      '<span class="material-icons">chevron_right</span>'
    ],
    responsive: { 0: { items: 2 }, 480: { items: 3 }, 768: { items: 4 }, 1024: { items: 5 } },
  };

  testimonialOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    dots: true,
    navSpeed: 500,
    autoplay: true,
    autoplayTimeout: 4000,
    nav: false,
    responsive: { 0: { items: 1 }, 768: { items: 2 }, 1024: { items: 3 } },
  };

  heroBanners = [
    { desktop: '/assets/images/banners/desktop/banner-01.avif', mobile: '/assets/images/banners/mobile/banner-01.avif', alt: 'Girlyf Gold Jewellery', link: '/gold-jewellery' },
    { desktop: '/assets/images/banners/desktop/banner-02.avif', mobile: '/assets/images/banners/mobile/banner-02.avif', alt: 'Girlyf Diamond Collection', link: '/diamond-jewellery' },
    { desktop: '/assets/images/banners/desktop/banner-03.avif', mobile: '/assets/images/banners/mobile/banner-03.avif', alt: 'Girlyf New Arrivals', link: '/products' },
    { desktop: '/assets/images/banners/desktop/banner-04.avif', mobile: '/assets/images/banners/mobile/banner-04.avif', alt: 'Girlyf Special Offer', link: '/products' },
  ];

  trustBadges = [
    { icon: '/assets/images/trust-badges/safe.svg', label: 'Safe & Secure' },
    { icon: '/assets/images/trust-badges/shipping.svg', label: 'Free Shipping' },
    { icon: '/assets/images/trust-badges/certified.svg', label: 'Certified Jewellery' },
    { icon: '/assets/images/trust-badges/diamond.svg', label: 'Real Diamonds' },
    { icon: '/assets/images/trust-badges/huid.svg', label: 'HUID Hallmarked' },
    { icon: '/assets/images/trust-badges/return.svg', label: '15 Day Returns' },
    { icon: '/assets/images/trust-badges/maintenance.svg', label: 'Lifetime Maintenance' },
    { icon: '/assets/images/trust-badges/transparency.svg', label: 'Price Transparency' },
    { icon: '/assets/images/trust-badges/buyback.svg', label: '100% Buyback' },
  ];
  trustBadgesDuplicated = [...this.trustBadges, ...this.trustBadges, ...this.trustBadges];

  categoryCards = [
    { name: 'Gold Earrings', image: '/assets/images/categories/earring.avif', link: '/gold-jewellery/earrings' },
    { name: 'Gold Rings', image: '/assets/images/categories/ring.avif', link: '/gold-jewellery/rings' },
    { name: 'Gold Necklaces', image: '/assets/images/categories/necklace.avif', link: '/gold-jewellery/necklaces' },
    { name: 'Gold Bangles', image: '/assets/images/categories/bangle.avif', link: '/gold-jewellery/bangles' },
    { name: 'Diamond Pendants', image: '/assets/images/categories/pendant.avif', link: '/diamond-jewellery/pendants' },
    { name: 'Diamond Rings', image: '/assets/images/categories/diamond-ring.avif', link: '/diamond-jewellery/rings' },
    { name: 'Mangalsutra', image: '/assets/images/categories/mangalsutra.avif', link: '/gold-jewellery/mangalsutras' },
  ];

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

  financialCards = [
    { label: 'Digi Gold', image: '/assets/images/misc/digi-gold.avif', link: '/digi-gold' },
    { label: 'Easy Buy', image: '/assets/images/misc/easy-buy.avif', link: '/products' },
    { label: 'Gift Cards', image: '/assets/images/misc/gift-card.avif', link: '/gift-cards' },
    { label: 'Gold Coins', image: '/assets/images/misc/gold-coin.avif', link: '/gold-coin' },
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
    { q: 'Do you offer lifetime exchange?', a: 'Absolutely! We offer lifetime exchange on all gold and diamond jewellery purchased from Girlyf.' },
    { q: 'How is the gold rate calculated?', a: 'Our prices are updated daily based on the prevailing gold rate. The final price includes gold value, making charges, wastage, GST, and stone charges (if applicable).' },
    { q: 'Is Cash on Delivery available?', a: 'Yes, we offer Cash on Delivery for orders up to 2,00,000. Additional payment options include UPI, PhonePe, Credit/Debit cards, and Net Banking.' },
    { q: 'What is your return policy?', a: 'We offer a 15-day return/exchange policy. Products must be in original condition with all tags and certificates.' },
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
    if (this.isBrowser) {
      setTimeout(() => this.bannersLoaded.set(true), 100);
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.initScrollReveal();
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private loadData(): void {
    forkJoin({
      categories: this.api.getCategories(),
      goldRates: this.api.getGoldRates(),
      featured: this.api.getFeaturedProducts(10),
      bestSellers: this.api.getBestSellers(10),
      newArrivals: this.api.getNewArrivals(10),
      testimonials: this.api.getTestimonials(6),
      blogPosts: this.api.getLatestPosts(3),
    }).subscribe({
      next: (data) => {
        this.categories.set(data.categories);
        this.goldRates.set(data.goldRates);
        this.featured.set(data.featured);
        this.bestSellers.set(data.bestSellers);
        this.newArrivals.set(data.newArrivals);
        this.testimonials.set(data.testimonials);
        this.blogPosts.set(data.blogPosts);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.api.getProducts({ maxPrice: 2000, pageSize: 6, page: 1 }).subscribe({
      next: (res) => this.under2k.set(res.items),
    });
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
