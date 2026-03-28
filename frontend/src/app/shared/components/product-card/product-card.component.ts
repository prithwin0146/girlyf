import { Component, Input, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '@core/models';
import { CartService } from '@core/services/cart.service';
import { WishlistService } from '@core/services/wishlist.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, NgOptimizedImage],
  template: `
    <div class="group relative bg-white border border-gray-100 rounded-lg overflow-hidden hover:border-gold-500/30 hover:shadow-xl transition-all duration-400" style="transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);">
      @if (product.isBestSeller) {
        <span class="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 bg-primary-900/90 backdrop-blur-sm text-white text-[9px] font-semibold uppercase tracking-wider rounded">Bestseller</span>
      } @else if (product.isNewArrival) {
        <span class="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 bg-emerald-600/90 backdrop-blur-sm text-white text-[9px] font-semibold uppercase tracking-wider rounded">New</span>
      }

      <button (click)="toggleWishlist($event)" class="absolute top-2.5 right-2.5 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all duration-300"
        [class.text-red-500]="wishlist.isInWishlist(product.id)" [class.text-gray-400]="!wishlist.isInWishlist(product.id)">
        <mat-icon class="text-lg">{{ wishlist.isInWishlist(product.id) ? 'favorite' : 'favorite_border' }}</mat-icon>
      </button>

      <a [routerLink]="['/product', product.id]" class="block">
        <div class="aspect-square overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 relative">
          <img [ngSrc]="primaryImage" [alt]="product.name" fill class="object-cover group-hover:scale-105 transition-transform duration-700 ease-out">
          <div class="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div class="p-3.5">
          <p class="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-medium">{{ product.sku }}</p>
          <h3 class="text-xs font-heading text-gray-800 line-clamp-2 min-h-[2rem] leading-snug group-hover:text-primary-900 transition-colors duration-200">{{ product.name }}</h3>

          @if (product.grossWeight) {
            <p class="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1.5">
              <span class="inline-block w-1 h-1 rounded-full bg-gold-500"></span>
              {{ product.grossWeight }}g · {{ product.karat }}
            </p>
          }

          <div class="mt-2.5 flex items-baseline gap-2">
            <span class="price-display text-sm">₹{{ product.calculatedPrice | number:'1.0-0' }}</span>
          </div>
        </div>
      </a>

      <div class="px-3.5 pb-3.5 pt-0 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <button (click)="addToCart()" class="w-full btn-primary text-[10px] py-2.5 rounded">ADD TO BAG</button>
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  get primaryImage(): string {
    const primary = this.product.images?.find(i => i.isPrimary);
    return primary?.imageUrl || this.product.images?.[0]?.imageUrl || '/assets/images/misc/placeholder.svg';
  }

  constructor(private cart: CartService, public wishlist: WishlistService) {}

  toggleWishlist(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.wishlist.toggle(this.product.id);
  }

  addToCart(): void {
    this.cart.addItem({
      productId: this.product.id,
      productName: this.product.name,
      slug: this.product.slug,
      imageUrl: this.primaryImage,
      karat: this.product.karat,
      grossWeight: this.product.grossWeight,
      quantity: 1,
      unitPrice: this.product.calculatedPrice,
    });
  }
}
