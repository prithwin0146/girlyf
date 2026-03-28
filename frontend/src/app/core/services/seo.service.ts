import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '@env/environment';

export interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  product?: {
    name: string;
    description?: string;
    image?: string;
    price: number;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    sku?: string;
    brand?: string;
    category?: string;
    rating?: number;
    reviewCount?: number;
  };
  article?: {
    publishedTime?: string;
    author?: string;
    tags?: string[];
  };
  breadcrumbs?: { name: string; url: string }[];
  faq?: { question: string; answer: string }[];
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly baseUrl = environment.production ? 'https://girlyf.com' : 'http://localhost:4200';
  private readonly siteName = 'Girlyf — Exquisite Jewellery Online';
  private readonly defaultDescription = 'Shop exquisite BIS hallmarked gold, diamond and silver jewellery online at Girlyf. Live gold rates, transparent pricing, free insured shipping across India.';
  private readonly defaultImage = '/assets/images/misc/og-default.jpg';
  private readonly isBrowser: boolean;

  constructor(
    private meta: Meta,
    private titleService: Title,
    private router: Router,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Auto-set canonical on every navigation
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        const nav = e as NavigationEnd;
        this.setCanonicalUrl(`${this.baseUrl}${nav.urlAfterRedirects}`);
      });
  }

  update(config: SeoConfig): void {
    const title = config.title
      ? `${config.title} | ${this.siteName}`
      : this.siteName;
    const description = config.description || this.defaultDescription;
    const image = config.image
      ? (config.image.startsWith('http') ? config.image : `${this.baseUrl}${config.image}`)
      : `${this.baseUrl}${this.defaultImage}`;
    const url = config.url || (this.isBrowser ? window.location.href : this.baseUrl);
    const type = config.type || 'website';

    // Standard meta
    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    // Canonical
    this.setCanonicalUrl(url);

    // Remove existing structured data
    this.removeStructuredData();

    // JSON-LD: Organization (always present)
    this.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Girlyf Jewellery',
      url: this.baseUrl,
      logo: `${this.baseUrl}/assets/images/misc/logo.svg`,
      sameAs: [
        'https://facebook.com/girlyf',
        'https://instagram.com/girlyf',
        'https://twitter.com/girlyf',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-1800-123-4567',
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: 'English',
      },
    });

    // JSON-LD: Breadcrumbs
    if (config.breadcrumbs?.length) {
      this.addStructuredData({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: config.breadcrumbs.map((bc, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: bc.name,
          item: bc.url.startsWith('http') ? bc.url : `${this.baseUrl}${bc.url}`,
        })),
      });
    }

    // JSON-LD: Product
    if (config.product) {
      const p = config.product;
      this.addStructuredData({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: p.name,
        description: p.description || description,
        image: p.image ? (p.image.startsWith('http') ? p.image : `${this.baseUrl}${p.image}`) : image,
        sku: p.sku,
        brand: { '@type': 'Brand', name: p.brand || 'Girlyf' },
        category: p.category,
        offers: {
          '@type': 'Offer',
          url: url,
          priceCurrency: p.currency || 'INR',
          price: p.price.toFixed(2),
          availability: `https://schema.org/${p.availability || 'InStock'}`,
          seller: { '@type': 'Organization', name: 'Girlyf Jewellery' },
        },
        ...(p.rating && p.reviewCount
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: p.rating.toFixed(1),
                reviewCount: p.reviewCount,
                bestRating: '5',
                worstRating: '1',
              },
            }
          : {}),
      });
    }

    // JSON-LD: Article
    if (config.article) {
      this.addStructuredData({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: config.title,
        description: description,
        image: image,
        datePublished: config.article.publishedTime,
        author: {
          '@type': 'Person',
          name: config.article.author || 'Girlyf Team',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Girlyf Jewellery',
          logo: { '@type': 'ImageObject', url: `${this.baseUrl}/assets/images/misc/logo.svg` },
        },
      });
    }

    // JSON-LD: FAQ
    if (config.faq?.length) {
      this.addStructuredData({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: config.faq.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      });
    }
  }

  /** Reset to defaults (e.g. on home page) */
  resetDefaults(): void {
    this.update({
      title: 'Buy Gold, Diamond & Silver Jewellery Online',
      description: this.defaultDescription,
      keywords: 'gold jewellery, diamond jewellery, silver jewellery, BIS hallmarked, online jewellery store India, buy gold online, Girlyf',
    });
  }

  private setCanonicalUrl(url: string): void {
    let link = this.doc.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private addStructuredData(data: object): void {
    const script = this.doc.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('class', 'girlyf-jsonld');
    script.textContent = JSON.stringify(data);
    this.doc.head.appendChild(script);
  }

  private removeStructuredData(): void {
    const scripts = this.doc.querySelectorAll('script.girlyf-jsonld');
    scripts.forEach((s) => s.remove());
  }
}
