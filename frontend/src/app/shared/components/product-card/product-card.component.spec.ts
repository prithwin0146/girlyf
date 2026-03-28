import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductCardComponent } from './product-card.component';
import { CartService } from '@core/services/cart.service';
import { WishlistService } from '@core/services/wishlist.service';
import { AuthService } from '@core/services/auth.service';
import { Product } from '@core/models';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  const mockProduct: Product = {
    id: 1,
    name: 'Gold Ring 22KT',
    slug: 'gold-ring-22kt',
    sku: 'GR-001',
    description: 'Beautiful gold ring',
    categoryId: 1,
    categoryName: 'Rings',
    metal: 'Gold',
    karat: '22KT',
    grossWeight: 5,
    netWeight: 4.8,
    makingChargePercent: 12,
    wastagePercent: 3,
    stonePrice: 0,
    calculatedPrice: 25000,
    gender: 'Women',
    collection: 'Classic',
    isBestSeller: true,
    isFeatured: false,
    isNewArrival: false,
    isActive: true,
    stockQuantity: 10,
    averageRating: 4.5,
    reviewCount: 12,
    images: [
      { id: 1, imageUrl: '/assets/images/products/ring.avif', isPrimary: true },
    ],
  };

  const mockAuthService = {
    isLoggedIn: () => false,
    token: () => null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display product name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Gold Ring 22KT');
  });

  it('should display formatted price', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('25,000');
  });

  it('should show bestseller badge', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Bestseller');
  });

  it('should return primary image from getter', () => {
    expect(component.primaryImage).toBe('/assets/images/products/ring.avif');
  });

  it('should return placeholder when no images', () => {
    component.product = { ...mockProduct, images: [] };
    expect(component.primaryImage).toBe('/assets/images/misc/placeholder.svg');
  });

  it('should add item to cart', () => {
    const cartService = TestBed.inject(CartService);
    spyOn(cartService, 'addItem');
    component.addToCart();
    expect(cartService.addItem).toHaveBeenCalledWith(
      jasmine.objectContaining({
        productId: 1,
        productName: 'Gold Ring 22KT',
        unitPrice: 25000,
      })
    );
  });
});
