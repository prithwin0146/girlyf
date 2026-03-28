import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly base = `${environment.apiUrl}/wishlist`;
  private _ids = signal<Set<number>>(new Set());

  readonly wishlistIds = this._ids.asReadonly();

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId) && this.auth.isLoggedIn()) {
      this.loadWishlist();
    }
  }

  isInWishlist(productId: number): boolean {
    return this._ids().has(productId);
  }

  toggle(productId: number): void {
    if (!this.auth.isLoggedIn()) return;
    if (this.isInWishlist(productId)) {
      this.remove(productId);
    } else {
      this.add(productId);
    }
  }

  private add(productId: number): void {
    this.http.post(`${this.base}/${productId}`, {}).subscribe(() => {
      const updated = new Set(this._ids());
      updated.add(productId);
      this._ids.set(updated);
    });
  }

  private remove(productId: number): void {
    this.http.delete(`${this.base}/${productId}`).subscribe(() => {
      const updated = new Set(this._ids());
      updated.delete(productId);
      this._ids.set(updated);
    });
  }

  loadWishlist(): void {
    this.http
      .get<{ id: number }[]>(this.base)
      .subscribe((items) => {
        this._ids.set(new Set(items.map((i) => i.id)));
      });
  }
}
