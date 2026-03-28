import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '@core/models';
import { CartService } from '@core/services/cart.service';
import { WishlistService } from '@core/services/wishlist.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <div class="group relative bg-white border border-gray-100 hover:border-gold-500/30 hover:shadow-lg transition-all duration-300">
      @if (product.isBestSeller) {
        <span class="badge-discount absolute top-2 left-2 z-10">Bestseller</span>
      } @else if (product.isNewArrival) {
        <span class="absolute top-2 left-2 z-10 px-2 py-0.5 bg-green-600 text-white text-[9px] font-accent uppercase">New</span>
      }

      <button (click)="toggleWishlist($event)" class="absolute top-2 right-2 z-10 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white shadow-sm transition-all"
        [class.text-red-500]="wishlist.isInWishlist(product.id)" [class.text-gray-400]="!wishlist.isInWishlist(product.id)">
        <mat-icon class="text-lg">{{ wishlist.isInWishlist(product.id) ? 'favorite' : 'favorite_border' }}</mat-icon>
      </button>

      <a [routerLink]="['/product', product.id]" class="block">
        <div class="aspect-square overflow-hidden bg-gray-50 relative">
          <img [src]="primaryImage" [alt]="product.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy">
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
        </div>

        <div class="p-3">
          <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{{ product.sku }}</p>
          <h3 class="text-xs font-heading text-gray-800 line-clamp-2 min-h-[2rem] leading-tight group-hover:text-primary-900">{{ product.name }}</h3>

          @if (product.grossWeight) {
            <p class="text-[10px] text-gray-400 mt-1">Wt: {{ product.grossWeight }}g · {{ product.karat }}</p>
          }

          <div class="mt-2 flex items-baseline gap-2">
            <span class="price-display text-sm">₹{{ product.calculatedPrice | number:'1.0-0' }}</span>
          </div>
        </div>
      </a>

      <div class="p-3 pt-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button (click)="addToCart()" class="w-full btn-primary text-[10px] py-2">ADD TO BAG</button>
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
