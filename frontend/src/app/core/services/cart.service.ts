import { Injectable, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '@core/models';
import { AuthService } from './auth.service';
import { environment } from '@env/environment';

interface ServerCartResponse {
  items: {
    productId: number;
    productName: string;
    imageUrl: string;
    karat: string;
    grossWeight: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  subTotal: number;
  tax: number;
  shippingCharge: number;
  totalAmount: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'girlyf_cart';
  private readonly apiUrl = `${environment.apiUrl}/cart`;
  private readonly isBrowser: boolean;
  private _items = signal<CartItem[]>([]);

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._items.set(this.loadCart());
  }

  readonly items = this._items.asReadonly();
  readonly itemCount = computed(() =>
    this._items().reduce((sum, i) => sum + i.quantity, 0)
  );
  readonly subTotal = computed(() =>
    this._items().reduce((sum, i) => sum + i.totalPrice, 0)
  );
  readonly tax = computed(() => Math.round(this.subTotal() * 0.03 * 100) / 100);
  readonly shipping = computed(() => (this.subTotal() > 50000 ? 0 : 150));
  readonly total = computed(() => this.subTotal() + this.tax() + this.shipping());

  /** Sync local cart to server after login. Merges local items into server cart. */
  syncOnLogin(): void {
    if (!this.auth.isLoggedIn()) return;
    const localItems = this._items();
    if (localItems.length === 0) {
      // Just fetch server cart
      this.fetchServerCart();
      return;
    }
    const syncPayload = {
      items: localItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    };
    this.http.post<ServerCartResponse>(`${this.apiUrl}/sync`, syncPayload).subscribe({
      next: (res) => this.applyServerCart(res),
      error: () => {} // Silently fail, local cart still works
    });
  }

  /** Fetch cart from server (for logged-in users) */
  private fetchServerCart(): void {
    this.http.get<ServerCartResponse>(this.apiUrl).subscribe({
      next: (res) => this.applyServerCart(res),
      error: () => {}
    });
  }

  private applyServerCart(res: ServerCartResponse): void {
    const items: CartItem[] = res.items.map((i) => ({
      productId: i.productId,
      productName: i.productName,
      slug: '', // Server doesn't return slug, keep local
      imageUrl: i.imageUrl,
      karat: i.karat,
      grossWeight: i.grossWeight,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      totalPrice: i.totalPrice,
    }));
    this._items.set(items);
    this.persist();
  }

  addItem(item: Omit<CartItem, 'totalPrice'>): void {
    const current = [...this._items()];
    const idx = current.findIndex((i) => i.productId === item.productId);
    if (idx >= 0) {
      current[idx] = {
        ...current[idx],
        quantity: current[idx].quantity + item.quantity,
        totalPrice: current[idx].unitPrice * (current[idx].quantity + item.quantity),
      };
    } else {
      current.push({ ...item, totalPrice: item.unitPrice * item.quantity });
    }
    this._items.set(current);
    this.persist();
    this.syncItemToServer(item.productId, item.quantity, 'add');
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(productId);
      return;
    }
    const current = this._items().map((i) =>
      i.productId === productId
        ? { ...i, quantity, totalPrice: i.unitPrice * quantity }
        : i
    );
    this._items.set(current);
    this.persist();
    this.syncItemToServer(productId, quantity, 'update');
  }

  removeItem(productId: number): void {
    this._items.set(this._items().filter((i) => i.productId !== productId));
    this.persist();
    if (this.auth.isLoggedIn()) {
      this.http.delete(`${this.apiUrl}/items/${productId}`).subscribe();
    }
  }

  clearCart(): void {
    this._items.set([]);
    this.persist();
    if (this.auth.isLoggedIn()) {
      this.http.delete(this.apiUrl).subscribe();
    }
  }

  /** Fire-and-forget sync of individual item changes to server */
  private syncItemToServer(productId: number, quantity: number, action: 'add' | 'update'): void {
    if (!this.auth.isLoggedIn()) return;
    if (action === 'add') {
      this.http.post(`${this.apiUrl}/items/${productId}?quantity=${quantity}`, {}).subscribe();
    } else {
      this.http.put(`${this.apiUrl}/items/${productId}?quantity=${quantity}`, {}).subscribe();
    }
  }

  private persist(): void {
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._items()));
    }
  }

  private loadCart(): CartItem[] {
    if (!this.isBrowser) return [];
    try {
      const json = localStorage.getItem(this.STORAGE_KEY);
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  }
}
