import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';

describe('CartService', () => {
  let service: CartService;

  const mockAuthService = {
    isLoggedIn: () => false,
    token: () => null,
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.removeItem('girlyf_cart');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CartService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: AuthService, useValue: mockAuthService },
      ],
    });
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty cart', () => {
    expect(service.itemCount()).toBe(0);
    expect(service.items().length).toBe(0);
  });

  it('should add an item to cart', () => {
    service.addItem({
      productId: 1,
      productName: 'Gold Ring',
      slug: 'gold-ring',
      imageUrl: '/ring.jpg',
      karat: '22KT',
      grossWeight: 5,
      quantity: 1,
      unitPrice: 25000,
    });
    expect(service.itemCount()).toBe(1);
    expect(service.items()[0].productName).toBe('Gold Ring');
    expect(service.subTotal()).toBe(25000);
  });

  it('should increase quantity on duplicate add', () => {
    const item = {
      productId: 1,
      productName: 'Gold Ring',
      slug: 'gold-ring',
      imageUrl: '/ring.jpg',
      karat: '22KT',
      grossWeight: 5,
      quantity: 1,
      unitPrice: 25000,
    };
    service.addItem(item);
    service.addItem(item);
    expect(service.itemCount()).toBe(2);
    expect(service.items().length).toBe(1); // same product, qty 2
    expect(service.subTotal()).toBe(50000);
  });

  it('should remove an item from cart', () => {
    service.addItem({
      productId: 1,
      productName: 'Gold Ring',
      slug: 'gold-ring',
      imageUrl: '/ring.jpg',
      karat: '22KT',
      grossWeight: 5,
      quantity: 1,
      unitPrice: 25000,
    });
    service.removeItem(1);
    expect(service.itemCount()).toBe(0);
  });

  it('should calculate shipping correctly', () => {
    // Under 50k = 150 shipping
    service.addItem({
      productId: 1,
      productName: 'Silver Ring',
      slug: 'silver-ring',
      imageUrl: '/ring.jpg',
      karat: '92.5',
      grossWeight: 3,
      quantity: 1,
      unitPrice: 2000,
    });
    expect(service.shipping()).toBe(150);
  });

  it('should give free shipping above 50k', () => {
    service.addItem({
      productId: 1,
      productName: 'Diamond Necklace',
      slug: 'diamond-necklace',
      imageUrl: '/necklace.jpg',
      karat: '18KT',
      grossWeight: 15,
      quantity: 1,
      unitPrice: 150000,
    });
    expect(service.shipping()).toBe(0);
  });

  it('should clear the cart', () => {
    service.addItem({
      productId: 1,
      productName: 'Gold Ring',
      slug: 'gold-ring',
      imageUrl: '/ring.jpg',
      karat: '22KT',
      grossWeight: 5,
      quantity: 1,
      unitPrice: 25000,
    });
    service.clearCart();
    expect(service.itemCount()).toBe(0);
  });
});
