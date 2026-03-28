import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '@core/services/wishlist.service';
import { CartService } from '@core/services/cart.service';
import { ApiService } from '@core/services/api.service';
import { Product } from '@core/models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-brown-200/50 py-3">
      <div class="max-w-7xl mx-auto px-4 flex items-center gap-2 text-xs text-gray-500">
        <a routerLink="/" class="hover:text-primary-900">Home</a><span>/</span>
        <span class="text-primary-900 font-semibold">My Wishlist</span>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="font-heading text-lg text-primary-900">My Wishlist ({{ products().length }})</h1>
        @if (products().length > 0) {
          <button class="text-xs text-gray-500 hover:text-primary-900 flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
            Share Wishlist
          </button>
        }
      </div>

      @if (products().length === 0) {
        <div class="text-center py-20">
          <span class="text-6xl">💝</span>
          <h2 class="font-heading text-xl text-gray-700 mt-4">Your wishlist is empty</h2>
          <p class="text-sm text-gray-500 mt-2">Save your favourite pieces for later</p>
          <a routerLink="/products" class="btn-gold text-sm mt-6 inline-block">EXPLORE JEWELLERY</a>
        </div>
      } @else {
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          @for (p of products(); track p.id) {
            <div class="bg-white border border-gray-100 group hover:shadow-md transition-shadow">
              <div class="relative">
                <a [routerLink]="['/product', p.id]" class="block aspect-square overflow-hidden bg-gray-50">
                  <img [src]="getImage(p)" [alt]="p.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                </a>
                <button (click)="removeFromWishlist(p.id)" class="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-red-500 hover:bg-red-50">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                </button>
              </div>
              <div class="p-3">
                <p class="text-[10px] text-gray-400">{{ p.sku }}</p>
                <h3 class="text-xs font-heading mt-1 line-clamp-2">{{ p.name }}</h3>
                <p class="price-display text-sm mt-1">₹{{ p.calculatedPrice | number:'1.0-0' }}</p>
                <div class="flex items-center gap-1 mt-1">
                  <span class="text-[9px] text-gray-400">{{ p.karat }} · {{ p.grossWeight }}g</span>
                </div>
                <button (click)="moveToBag(p)" class="w-full btn-primary text-[10px] py-2 mt-3">MOVE TO BAG</button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class WishlistComponent implements OnInit {
  products = signal<Product[]>([]);

  constructor(public wishlist: WishlistService, private cart: CartService, private api: ApiService) {}

  ngOnInit(): void {
    const ids = Array.from(this.wishlist.wishlistIds());
    if (ids.length > 0) {
      const requests = ids.map(id => this.api.getProductById(id));
      forkJoin(requests).subscribe(products => this.products.set(products));
    }
  }

  getImage(p: Product): string {
    return p.images?.find(i => i.isPrimary)?.imageUrl || p.images?.[0]?.imageUrl || '';
  }

  removeFromWishlist(id: number): void {
    this.wishlist.toggle(id);
    this.products.set(this.products().filter(p => p.id !== id));
  }

  moveToBag(p: Product): void {
    this.cart.addItem({
      productId: p.id, productName: p.name, slug: p.slug,
      imageUrl: this.getImage(p), karat: p.karat, grossWeight: p.grossWeight,
      quantity: 1, unitPrice: p.calculatedPrice,
    });
    this.removeFromWishlist(p.id);
  }
}
