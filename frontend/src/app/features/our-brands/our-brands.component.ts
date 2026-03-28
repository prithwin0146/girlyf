import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-our-brands',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero -->
    <section class="bg-gradient-to-r from-primary-900 to-primary-800 py-16 text-center">
      <p class="text-gold-400 text-xs uppercase tracking-[0.3em] mb-3">Exclusive Collections</p>
      <h1 class="font-heading text-4xl text-white mb-3">Our Exclusive Brands</h1>
      <p class="text-white/60 max-w-2xl mx-auto text-sm">
        Discover our curated range of signature jewellery collections — each with a unique story, crafted for the modern woman.
      </p>
    </section>

    <!-- Brands Grid -->
    <section class="max-w-7xl mx-auto px-4 py-14">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        @for (brand of brands; track brand.name) {
          <div class="group rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-white border border-gray-100">
            <div class="relative overflow-hidden h-64">
              <img [src]="brand.image" [alt]="brand.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 p-5">
                <h2 class="font-heading text-xl text-white">{{ brand.name }}</h2>
                <p class="text-white/70 text-xs mt-1">{{ brand.tagline }}</p>
              </div>
              <div class="absolute top-4 right-4 bg-gold-500 text-primary-900 text-xs px-3 py-1 rounded-full font-heading font-bold">
                {{ brand.badge }}
              </div>
            </div>
            <div class="p-5">
              <p class="text-sm text-gray-600 leading-relaxed mb-4">{{ brand.desc }}</p>
              <div class="flex flex-wrap gap-2 mb-4">
                @for (tag of brand.tags; track tag) {
                  <span class="text-xs bg-trust text-brown-700 px-3 py-1 rounded-full">{{ tag }}</span>
                }
              </div>
              <a [routerLink]="['/products']" [queryParams]="{brand: brand.slug}"
                class="w-full btn-primary text-center py-3 text-sm block">EXPLORE COLLECTION</a>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- Brand Story -->
    <section class="bg-trust py-14">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h2 class="section-title mb-3">Our Design Philosophy</h2>
        <div class="gold-divider mx-auto mb-8"></div>
        <p class="text-gray-600 max-w-3xl mx-auto text-sm leading-relaxed mb-8">
          Every Girlyf brand collection is a result of months of design research, cultural inspiration, and master craftsmanship.
          From the timeless elegance of IVY to the playful spirit of Butterfly, each collection represents a different facet of the modern Indian woman.
        </p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          @for (stat of designStats; track stat.label) {
            <div class="bg-white rounded-2xl p-5 shadow-sm">
              <div class="font-heading text-2xl text-primary-900 font-bold mb-1">{{ stat.value }}</div>
              <div class="text-xs text-gray-500">{{ stat.label }}</div>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class OurBrandsComponent {
  brands = [
    {
      name: 'Ivy Collections',
      tagline: 'Timeless Elegance',
      slug: 'ivy',
      badge: 'Bestseller',
      image: '/assets/images/collections/ivy.avif',
      desc: 'The Ivy collection celebrates the intertwining of nature and elegance. Each piece is inspired by the graceful curves of ivy vines, symbolising strength and eternal beauty.',
      tags: ['Gold', 'Diamond', 'Necklaces', 'Bangles'],
    },
    {
      name: 'Butterfly',
      tagline: 'Freedom & Grace',
      slug: 'butterfly',
      badge: 'New Season',
      image: '/assets/images/collections/butterfly.avif',
      desc: 'Inspired by the delicate beauty of butterflies, this collection features lightweight, intricate designs perfect for everyday elegance and special occasions alike.',
      tags: ['Earrings', 'Pendants', 'Lightweight'],
    },
    {
      name: 'Mirage',
      tagline: 'Dreams in Gold',
      slug: 'mirage',
      badge: 'Trending',
      image: '/assets/images/collections/mirage.avif',
      desc: 'The Mirage collection blurs the line between fantasy and reality. Bold, statement pieces crafted with extraordinary detail for the woman who dares to dream.',
      tags: ['Statement', 'Diamond', 'Rings', 'Necklaces'],
    },
    {
      name: 'Orchid Collection',
      tagline: 'Rare & Beautiful',
      slug: 'orchid',
      badge: 'Exclusive',
      image: '/assets/images/collections/orchid.avif',
      desc: 'Drawing from the rare beauty of orchid flowers, this collection embodies sophisticated femininity. Each piece is a rare bloom of artistic expression and master craftsmanship.',
      tags: ['Platinum', 'Diamond', 'Exclusive'],
    },
    {
      name: 'Solo Collections',
      tagline: 'Singularly Stunning',
      slug: 'solo',
      badge: 'Modern',
      image: '/assets/images/collections/solo.avif',
      desc: 'For the independent woman who shines on her own. Solo collection features minimalist, modern designs that make a powerful statement with understated grace.',
      tags: ['Minimalist', 'Modern', 'Everyday'],
    },
    {
      name: 'Lumina',
      tagline: 'Radiant Light',
      slug: 'lumina',
      badge: 'Premium',
      image: '/assets/images/collections/ensemble.avif',
      desc: 'Lumina captures the brilliance of light in every curve and facet. Ultra-premium pieces for those who carry their own glow — refined, radiant, unforgettable.',
      tags: ['Ultra-light', 'Premium', 'Luxury'],
    },
    {
      name: 'Ethereal',
      tagline: 'Timeless Beauty',
      slug: 'ethereal',
      badge: 'Signature',
      image: '/assets/images/collections/butterfly.avif',
      desc: 'Ethereal transcends trends — each piece evokes the timeless beauty of the natural world. Crafted for the woman who believes in forever.',
      tags: ['Signature', 'Bridal', 'Heritage'],
    },
  ];

  designStats = [
    { value: '500+', label: 'Unique Designs' },
    { value: '7', label: 'Brand Collections' },
    { value: '20+', label: 'Years of Craftsmanship' },
    { value: '100%', label: 'Hallmarked Gold' },
  ];
}
