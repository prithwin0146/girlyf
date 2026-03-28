import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Analytics service — wires GA4 via GTM dataLayer.
 * Set your GTM container ID in environment before production.
 *
 * Usage:
 *   analytics.trackEvent('add_to_cart', { item_id: 123, value: 5000 });
 *   analytics.trackPageView('/products/gold-ring');
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      window.dataLayer = window.dataLayer || [];

      // Auto-track page views on navigation
      this.router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe((e) => {
          const nav = e as NavigationEnd;
          this.trackPageView(nav.urlAfterRedirects);
        });
    }
  }

  /** Push a GA4 event to the dataLayer */
  trackEvent(eventName: string, params: Record<string, any> = {}): void {
    if (!this.isBrowser) return;
    window.dataLayer.push({ event: eventName, ...params });
  }

  /** Track page view */
  trackPageView(url: string): void {
    this.trackEvent('page_view', { page_path: url });
  }

  /** E-commerce: View Item */
  trackViewItem(item: {
    id: number;
    name: string;
    category: string;
    price: number;
  }): void {
    this.trackEvent('view_item', {
      currency: 'INR',
      value: item.price,
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          price: item.price,
        },
      ],
    });
  }

  /** E-commerce: Add to Cart */
  trackAddToCart(item: {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
  }): void {
    this.trackEvent('add_to_cart', {
      currency: 'INR',
      value: item.price * item.quantity,
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          price: item.price,
          quantity: item.quantity,
        },
      ],
    });
  }

  /** E-commerce: Remove from Cart */
  trackRemoveFromCart(item: { id: number; name: string; price: number }): void {
    this.trackEvent('remove_from_cart', {
      currency: 'INR',
      value: item.price,
      items: [{ item_id: item.id, item_name: item.name, price: item.price }],
    });
  }

  /** E-commerce: Begin Checkout */
  trackBeginCheckout(value: number, items: any[]): void {
    this.trackEvent('begin_checkout', {
      currency: 'INR',
      value,
      items,
    });
  }

  /** E-commerce: Purchase */
  trackPurchase(orderId: string, value: number, items: any[]): void {
    this.trackEvent('purchase', {
      transaction_id: orderId,
      currency: 'INR',
      value,
      items,
    });
  }

  /** User: Sign Up */
  trackSignUp(method: string = 'email'): void {
    this.trackEvent('sign_up', { method });
  }

  /** User: Login */
  trackLogin(method: string = 'email'): void {
    this.trackEvent('login', { method });
  }

  /** Search */
  trackSearch(searchTerm: string): void {
    this.trackEvent('search', { search_term: searchTerm });
  }

  /** Wishlist */
  trackAddToWishlist(item: { id: number; name: string; price: number }): void {
    this.trackEvent('add_to_wishlist', {
      currency: 'INR',
      value: item.price,
      items: [{ item_id: item.id, item_name: item.name, price: item.price }],
    });
  }
}
