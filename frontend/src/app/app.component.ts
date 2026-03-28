import { Component, signal, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@shared/components/header/header.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { ToastComponent } from '@shared/components/toast/toast.component';
import { SeoService } from '@core/services/seo.service';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, ToastComponent],
  template: `
    <app-header />
    <main class="min-h-screen">
      <router-outlet />
    </main>
    <app-footer />
    <app-toast />

    <!-- WhatsApp Floating (JA has this prominently) -->
    <a href="https://wa.me/918606083922?text=Hi%20Girlyf!%20I%27d%20like%20to%20know%20more%20about%20your%20jewellery."
       target="_blank"
       class="fixed bottom-24 right-4 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
       style="animation: whatsappPulse 2s infinite"
       title="Chat on WhatsApp">
      <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>

    <!-- Back to Top -->
    @if (showBackToTop()) {
      <button (click)="scrollToTop()"
        class="fixed bottom-6 right-4 z-50 w-11 h-11 bg-primary-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-700 transition-all duration-300"
        title="Back to top">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
        </svg>
      </button>
    }

    <!-- Cookie Consent (JA exact style — centered modal with cookie image) -->
    @if (showCookie()) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div class="bg-white rounded-lg shadow-2xl max-w-md mx-4 p-6 relative">
          <button (click)="showCookie.set(false)" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
          <div class="flex flex-col items-center text-center">
            <div class="text-5xl mb-3">🍪</div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">We value your privacy</h3>
            <p class="text-sm text-gray-600 mb-4 leading-relaxed">
              We use first & third-party cookies to improve your experience, provide personalised content, and analyse our traffic.
              By choosing "Accept All", you agree to our use of cookies. For more information, Click
              <a href="#" class="text-primary-700 underline">Privacy Policy</a>
            </p>
            <button (click)="showCookie.set(false)"
              class="btn-primary w-full">ACCEPT ALL</button>
          </div>
        </div>
      </div>
    }
  `,
})
export class AppComponent {
  showBackToTop = signal(false);
  showCookie = signal(true);
  private readonly isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private seo: SeoService,
    private analytics: AnalyticsService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    // Initialize with default SEO tags
    this.seo.resetDefaults();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.isBrowser) {
      this.showBackToTop.set(window.scrollY > 500);
    }
  }

  scrollToTop(): void {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
