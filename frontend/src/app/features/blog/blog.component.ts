import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { SeoService } from '@core/services/seo.service';
import { BlogPost } from '@core/models';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-brown-200/50 py-3">
      <div class="max-w-7xl mx-auto px-4 flex items-center gap-2 text-xs text-gray-500">
        <a routerLink="/" class="hover:text-primary-900">Home</a><span>/</span>
        <span class="text-primary-900 font-semibold">Blog</span>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="section-title text-center">Jewellery Blog</h1>
      <div class="gold-divider mx-auto mb-8"></div>
      <p class="text-sm text-gray-500 text-center max-w-2xl mx-auto mb-10">Explore styling tips, jewellery care guides, trend reports and more from the Girlyf editorial team.</p>

      @if (loading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="animate-pulse"><div class="aspect-[16/10] bg-gray-200 rounded"></div><div class="mt-3 h-4 bg-gray-200 rounded w-3/4"></div><div class="mt-2 h-3 bg-gray-200 rounded w-full"></div></div>
          }
        </div>
      } @else if (posts().length === 0) {
        <div class="text-center py-20">
          <span class="text-5xl">📝</span>
          <h3 class="font-heading text-lg text-gray-700 mt-4">No blog posts yet</h3>
          <p class="text-sm text-gray-500 mt-2">Check back soon for jewellery insights and trends.</p>
        </div>
      } @else {
        <!-- FEATURED POST -->
        @if (posts().length > 0) {
          <a [routerLink]="['/blog', posts()[0].slug]" class="block group mb-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div class="aspect-[16/10] md:aspect-auto overflow-hidden bg-gray-100">
                @if (posts()[0].featuredImageUrl) {
                  <img [src]="posts()[0].featuredImageUrl" [alt]="posts()[0].title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                } @else {
                  <div class="w-full h-full flex items-center justify-center text-6xl bg-brown-200">📰</div>
                }
              </div>
              <div class="p-6 flex flex-col justify-center">
                <p class="text-[9px] text-gold-500 uppercase tracking-widest font-bold">Featured</p>
                <h2 class="font-heading text-xl text-primary-900 mt-2 group-hover:text-gold-600">{{ posts()[0].title }}</h2>
                @if (posts()[0].excerpt) { <p class="text-sm text-gray-500 mt-3 line-clamp-3">{{ posts()[0].excerpt }}</p> }
                <div class="mt-4 flex items-center gap-3 text-[10px] text-gray-400">
                  @if (posts()[0].author) { <span>By {{ posts()[0].author }}</span><span>·</span> }
                  <span>{{ posts()[0].publishedAt | date:'mediumDate' }}</span>
                </div>
              </div>
            </div>
          </a>
        }

        <!-- REST -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (post of posts().slice(1); track post.id) {
            <a [routerLink]="['/blog', post.slug]" class="group bg-white border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div class="aspect-[16/10] overflow-hidden bg-gray-100">
                @if (post.featuredImageUrl) {
                  <img [src]="post.featuredImageUrl" [alt]="post.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                } @else {
                  <div class="w-full h-full flex items-center justify-center text-3xl bg-brown-200">📝</div>
                }
              </div>
              <div class="p-4">
                @if (post.tags) { <p class="text-[9px] text-gold-500 uppercase tracking-wider font-bold">{{ post.tags }}</p> }
                <h3 class="text-sm font-heading text-primary-900 mt-1 line-clamp-2 group-hover:text-gold-600">{{ post.title }}</h3>
                @if (post.excerpt) { <p class="text-xs text-gray-500 mt-2 line-clamp-2">{{ post.excerpt }}</p> }
                <div class="mt-3 flex items-center gap-2 text-[10px] text-gray-400">
                  @if (post.author) { <span>{{ post.author }}</span><span>·</span> }
                  <span>{{ post.publishedAt | date:'mediumDate' }}</span>
                </div>
              </div>
            </a>
          }
        </div>
      }
    </div>
  `,
})
export class BlogComponent implements OnInit {
  posts = signal<BlogPost[]>([]);
  loading = signal(true);

  constructor(private api: ApiService, private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.update({
      title: 'Jewellery Blog — Styling Tips, Trends & Care Guides | Girlyf',
      description: 'Read the latest jewellery styling tips, trend reports, care guides, and expert advice from the Girlyf editorial team.',
      keywords: 'jewellery blog, gold jewellery tips, diamond buying guide, jewellery trends, Girlyf blog',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
      ],
    });

    this.api.getLatestPosts(20).subscribe({
      next: (posts) => { this.posts.set(posts); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
