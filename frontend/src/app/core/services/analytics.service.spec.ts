import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let routerEvents$: Subject<any>;

  beforeEach(() => {
    routerEvents$ = new Subject();
    (window as any).dataLayer = [];

    TestBed.configureTestingModule({
      providers: [
        AnalyticsService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: Router,
          useValue: { events: routerEvents$.asObservable() },
        },
      ],
    });
    service = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should push page_view on navigation', () => {
    routerEvents$.next(new NavigationEnd(1, '/products', '/products'));
    const pageViewEvents = (window as any).dataLayer.filter(
      (e: any) => e.event === 'page_view'
    );
    expect(pageViewEvents.length).toBeGreaterThan(0);
    expect(pageViewEvents[0].page_path).toBe('/products');
  });

  it('should track custom events', () => {
    service.trackEvent('add_to_cart', { item_id: 42, value: 5000 });
    const event = (window as any).dataLayer.find(
      (e: any) => e.event === 'add_to_cart'
    );
    expect(event).toBeTruthy();
    expect(event.item_id).toBe(42);
    expect(event.value).toBe(5000);
  });

  it('should track search events', () => {
    service.trackSearch('gold ring');
    const event = (window as any).dataLayer.find(
      (e: any) => e.event === 'search'
    );
    expect(event).toBeTruthy();
    expect(event.search_term).toBe('gold ring');
  });

  it('should track login events', () => {
    service.trackLogin('password');
    const event = (window as any).dataLayer.find(
      (e: any) => e.event === 'login'
    );
    expect(event).toBeTruthy();
    expect(event.method).toBe('password');
  });

  it('should track view_item events', () => {
    service.trackViewItem({
      id: 1,
      name: 'Gold Earring',
      category: 'Earrings',
      price: 15000,
    });
    const event = (window as any).dataLayer.find(
      (e: any) => e.event === 'view_item'
    );
    expect(event).toBeTruthy();
    expect(event.ecommerce.items[0].item_name).toBe('Gold Earring');
  });

  it('should track add_to_cart events', () => {
    service.trackAddToCart({
      id: 2,
      name: 'Diamond Ring',
      category: 'Rings',
      price: 80000,
      quantity: 1,
    });
    const event = (window as any).dataLayer.find(
      (e: any) => e.event === 'add_to_cart'
    );
    expect(event).toBeTruthy();
    expect(event.ecommerce.items[0].item_name).toBe('Diamond Ring');
  });
});
