import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SeoService, SeoConfig } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let titleService: Title;
  let meta: Meta;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SeoService,
        Title,
        Meta,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: Router, useValue: { events: { pipe: () => ({ subscribe: () => {} }) } } },
        { provide: 'DOCUMENT', useValue: document },
      ],
    });
    service = TestBed.inject(SeoService);
    titleService = TestBed.inject(Title);
    meta = TestBed.inject(Meta);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set page title', () => {
    const config: SeoConfig = {
      title: 'Gold Earrings — Buy Online',
      description: 'Buy gold earrings online at Girlyf.',
    };
    service.update(config);
    expect(titleService.getTitle()).toContain('Gold Earrings');
  });

  it('should set meta description', () => {
    service.update({
      title: 'Test Page',
      description: 'This is a test description for SEO.',
    });
    const descTag = meta.getTag('name="description"');
    expect(descTag?.content).toBe('This is a test description for SEO.');
  });

  it('should set Open Graph tags', () => {
    service.update({
      title: 'Diamond Rings',
      description: 'Beautiful diamond rings.',
      image: '/assets/images/ring.jpg',
      type: 'product',
    });
    const ogTitle = meta.getTag('property="og:title"');
    const ogType = meta.getTag('property="og:type"');
    expect(ogTitle?.content).toContain('Diamond Rings');
    expect(ogType?.content).toBe('product');
  });

  it('should set keywords meta tag', () => {
    service.update({
      title: 'Test',
      keywords: 'gold, jewellery, diamond, rings',
    });
    const keywordsTag = meta.getTag('name="keywords"');
    expect(keywordsTag?.content).toBe('gold, jewellery, diamond, rings');
  });
});
