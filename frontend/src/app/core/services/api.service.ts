import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  Product, PagedResult, ProductFilter, Category,
  GoldRate, Banner, CmsSection, BlogPost,
  StoreLocation, Testimonial, Review, CouponValidation,
} from '@core/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ── Products ──
  getProducts(filter: ProductFilter): Observable<PagedResult<Product>> {
    let params = new HttpParams();
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });
    return this.http.get<PagedResult<Product>>(`${this.base}/products`, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.base}/products/${id}`);
  }

  getProductBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.base}/products/slug/${slug}`);
  }

  getFeaturedProducts(count = 8): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/products/featured?count=${count}`);
  }

  getBestSellers(count = 8): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/products/bestsellers?count=${count}`);
  }

  getNewArrivals(count = 8): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/products/new-arrivals?count=${count}`);
  }

  getRelatedProducts(id: number, count = 6): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/products/${id}/related?count=${count}`);
  }

  // ── Categories ──
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.base}/categories`);
  }

  getCategoryBySlug(slug: string): Observable<Category> {
    return this.http.get<Category>(`${this.base}/categories/${slug}`);
  }

  // ── Gold Rates ──
  getGoldRates(): Observable<GoldRate[]> {
    return this.http.get<GoldRate[]>(`${this.base}/goldrates`);
  }

  // ── Banners ──
  getBanners(position?: string): Observable<Banner[]> {
    const params = position ? `?position=${position}` : '';
    return this.http.get<Banner[]>(`${this.base}/banners${params}`);
  }

  // ── CMS ──
  getHomepageSections(): Observable<CmsSection[]> {
    return this.http.get<CmsSection[]>(`${this.base}/cms/homepage`);
  }

  getCmsSection(key: string): Observable<CmsSection> {
    return this.http.get<CmsSection>(`${this.base}/cms/section/${key}`);
  }

  // ── Blog ──
  getLatestPosts(count = 4): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.base}/blog?count=${count}`);
  }

  getPostBySlug(slug: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.base}/blog/${slug}`);
  }

  // ── Stores ──
  getStores(): Observable<StoreLocation[]> {
    return this.http.get<StoreLocation[]>(`${this.base}/stores`);
  }

  getStoresByCity(city: string): Observable<StoreLocation[]> {
    return this.http.get<StoreLocation[]>(`${this.base}/stores/city/${city}`);
  }

  // ── Testimonials ──
  getTestimonials(count = 6): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.base}/testimonials?count=${count}`);
  }

  // ── Reviews ──
  getProductReviews(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.base}/reviews/product/${productId}`);
  }

  createReview(data: { productId: number; rating: number; comment?: string }): Observable<Review> {
    return this.http.post<Review>(`${this.base}/reviews`, data);
  }

  // ── Coupons ──
  validateCoupon(code: string, orderAmount: number): Observable<CouponValidation> {
    return this.http.get<CouponValidation>(
      `${this.base}/coupons/validate?code=${code}&orderAmount=${orderAmount}`
    );
  }
}
