import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '@core/services/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- HERO -->
    <section class="bg-primary-900 py-16">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <p class="text-gold-400 font-accent text-xs uppercase tracking-[0.3em] mb-3">Our Story</p>
        <h1 class="font-heading text-3xl md:text-4xl text-white">About Girlyf Jewellery</h1>
        <div class="gold-divider mx-auto mt-4"></div>
      </div>
    </section>

    <!-- LEGACY -->
    <section class="py-12 bg-white">
      <div class="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <p class="text-gold-500 font-accent text-xs uppercase tracking-[0.2em] mb-2">Since 2005</p>
          <h2 class="font-heading text-2xl text-primary-900">A Legacy of Trust</h2>
          <div class="gold-divider mt-3 mb-4"></div>
          <p class="text-sm text-gray-600 leading-relaxed">Girlyf Jewellery was born from a passion for making exquisite, certified jewellery accessible to every Indian family. Founded in 2005, we have grown from a single boutique to a loved brand trusted by over 500,000 customers.</p>
          <p class="text-sm text-gray-600 leading-relaxed mt-3">Every piece that bears the Girlyf name is crafted by master artisans and certified for purity. Our commitment to quality and transparency has earned us the trust of families across generations.</p>
        </div>
        <div class="bg-brown-200 aspect-square flex items-center justify-center rounded-lg">
          <span class="text-8xl">🏛️</span>
        </div>
      </div>
    </section>

    <!-- MILESTONES -->
    <section class="py-12 bg-brown-200/30">
      <div class="max-w-5xl mx-auto px-4">
        <h2 class="section-title text-center">Our Milestones</h2>
        <div class="gold-divider mx-auto mb-8"></div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          @for (m of milestones; track m.year) {
            <div class="text-center py-6 bg-white border border-gray-100 hover:border-gold-500/20 hover:shadow-sm transition-all">
              <p class="font-heading text-2xl text-gold-500 font-bold">{{ m.year }}</p>
              <p class="text-xs text-gray-600 mt-2 px-2">{{ m.event }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- VALUES -->
    <section class="py-12 bg-white">
      <div class="max-w-5xl mx-auto px-4">
        <h2 class="section-title text-center">Our Values</h2>
        <div class="gold-divider mx-auto mb-8"></div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (v of values; track v.title) {
            <div class="text-center p-6">
              <span class="text-4xl">{{ v.icon }}</span>
              <h3 class="font-heading text-sm uppercase tracking-wider text-primary-900 mt-4">{{ v.title }}</h3>
              <p class="text-xs text-gray-500 mt-2 leading-relaxed">{{ v.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- TEAM -->
    <section class="py-12 bg-brown-200/30">
      <div class="max-w-5xl mx-auto px-4">
        <h2 class="section-title text-center">Leadership Team</h2>
        <div class="gold-divider mx-auto mb-8"></div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          @for (t of team; track t.name) {
            <div class="text-center">
              <div class="w-24 h-24 mx-auto bg-primary-900 rounded-full flex items-center justify-center text-3xl text-white">{{ t.name.charAt(0) }}</div>
              <h4 class="font-heading text-sm text-primary-900 mt-3">{{ t.name }}</h4>
              <p class="text-[10px] text-gray-500">{{ t.role }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- COLLECTIONS -->
    <section class="py-12 bg-white">
      <div class="max-w-5xl mx-auto px-4">
        <h2 class="section-title text-center">Our Collections</h2>
        <div class="gold-divider mx-auto mb-8"></div>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          @for (col of collections; track col.name) {
            <a [routerLink]="['/collections', col.slug]" class="group text-center p-4 bg-brown-200/20 hover:bg-gold-500/10 border border-transparent hover:border-gold-500/20 transition-all">
              <span class="text-3xl">{{ col.icon }}</span>
              <h3 class="font-heading text-sm text-primary-900 mt-2">{{ col.name }}</h3>
              <p class="text-[10px] text-gray-500 mt-1">{{ col.tagline }}</p>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-12 bg-primary-900 text-center">
      <h2 class="font-heading text-2xl text-white mb-2">Visit Us Today</h2>
      <p class="text-white/60 text-sm mb-6">Come experience our jewellery collection at our Bangalore showroom</p>
      <div class="flex justify-center gap-3">
        <a routerLink="/contact" class="btn-gold text-sm">GET DIRECTIONS</a>
        <a routerLink="/products" class="btn-outline border-white text-white hover:bg-white hover:text-primary-900 text-sm">SHOP ONLINE</a>
      </div>
    </section>
  `,
})
export class AboutComponent implements OnInit {
  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.update({
      title: 'About Girlyf Jewellery — Our Story, Legacy & Values',
      description: 'Discover the story of Girlyf Jewellery. Our commitment to purity, craftsmanship, and trust with BIS Hallmarked gold and diamond jewellery.',
      keywords: 'about Girlyf, jewellery company, BIS hallmarked, gold jewellery India, Girlyf history',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'About Us', url: '/about' },
      ],
    });
  }

  milestones = [
    { year: '2005', event: 'Founded with a single boutique in Bangalore' },
    { year: '2013', event: 'Launched exclusive diamond collections' },
    { year: '2018', event: 'Launched Girlyf online store' },
    { year: '2022', event: 'Won National Jewellery Design Award' },
    { year: '2024', event: '20K+ happy customers across India' },
  ];

  values = [
    { icon: '🏆', title: 'Purity', desc: 'Every piece is BIS Hallmarked and certified. We never compromise on quality.' },
    { icon: '✨', title: 'Craftsmanship', desc: 'Master artisans with decades of experience create each piece with love.' },
    { icon: '🤝', title: 'Trust', desc: 'Trusted by millions of families for over 60 years. Lifetime exchange guarantee.' },
  ];

  team = [
    { name: 'Girlyf Family', role: 'Founder Legacy' },
    { name: 'Rajan Nair', role: 'Chairman & Founder' },
    { name: 'Priya Sharma', role: 'Managing Director' },
    { name: 'Arun Menon', role: 'Creative Director' },
  ];

  collections = [
    { name: 'Ivy', slug: 'ivy', icon: '🌿', tagline: 'Nature-inspired' },
    { name: 'Butterfly', slug: 'butterfly', icon: '🦋', tagline: 'Graceful' },
    { name: 'Mirage', slug: 'mirage', icon: '✨', tagline: 'Illusion' },
    { name: 'Orchid', slug: 'orchid', icon: '🌸', tagline: 'Floral' },
    { name: 'Solo', slug: 'solo', icon: '💎', tagline: 'Solitaire' },
    { name: 'Lumina', slug: 'lumina', icon: '🌟', tagline: 'Radiant Light' },
    { name: 'Ethereal', slug: 'ethereal', icon: '🪷', tagline: 'Timeless Beauty' },
  ];
}
