import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '@core/models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'girlyf_cart';
  private _items = signal<CartItem[]>(this.loadCart());

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
  }

  removeItem(productId: number): void {
    this._items.set(this._items().filter((i) => i.productId !== productId));
    this.persist();
  }

  clearCart(): void {
    this._items.set([]);
    this.persist();
  }

  private persist(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._items()));
  }

  private loadCart(): CartItem[] {
    try {
      const json = localStorage.getItem(this.STORAGE_KEY);
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  }
}
