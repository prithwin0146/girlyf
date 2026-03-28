import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <!-- NEWSLETTER (JA-style: Subscribe to Girlyf) -->
    <section class="bg-primary-900 text-white py-10">
      <div class="max-w-[1400px] mx-auto px-4 text-center">
        <h3 class="font-heading text-xl md:text-2xl tracking-wider">Subscribe to Girlyf Online</h3>
        <p class="text-white/60 text-sm mt-2 mb-6">Elevate your loved ones' style with dazzling gold jewellery</p>
        <div class="flex max-w-lg mx-auto">
          <div class="flex-1 relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📧</span>
            <input type="email" [(ngModel)]="email" placeholder="Enter your email address" class="w-full pl-10 pr-4 py-3 text-sm text-gray-900 rounded-l focus:outline-none">
          </div>
          <button (click)="subscribe()" class="btn-gold rounded-none rounded-r text-xs px-6 py-3 whitespace-nowrap">SUBSCRIBE</button>
        </div>
      </div>
    </section>

    <!-- TRUST STRIP (JA: 9 badges on peach #f4eeeb) -->
    <section class="bg-brown-200 py-5 border-y border-brown-500/20">
      <div class="max-w-[1400px] mx-auto px-4">
        <div class="flex md:grid md:grid-cols-9 gap-3 overflow-x-auto scrollbar-hide text-center">
          @for (item of trustItems; track item.line1) {
            <div class="flex flex-col items-center gap-1.5 py-2 min-w-[80px] shrink-0 md:min-w-0">
              <span class="text-xl">{{ item.icon }}</span>
              <span class="text-[9px] text-gray-700 font-heading uppercase tracking-wide leading-tight">{{ item.line1 }}</span>
              <span class="text-[8px] text-gray-500 leading-tight">{{ item.line2 }}</span>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- MAIN FOOTER (JA: 4 columns + App Download) -->
    <footer class="bg-white py-10 border-t">
      <div class="max-w-[1400px] mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-5 gap-8">
          <!-- Column 1: SHOPPING -->
          <div>
            <h4 class="footer-heading">Shopping</h4>
            <ul class="space-y-2">
              <li><a routerLink="/gold-jewellery" class="footer-link">Gold Jewellery</a></li>
              <li><a routerLink="/diamond-jewellery" class="footer-link">Diamond Jewellery</a></li>
              <li><a routerLink="/platinum-jewellery" class="footer-link">Platinum Jewellery</a></li>
              <li><a routerLink="/silver-jewellery" class="footer-link">Silver Jewellery</a></li>
              <li><a routerLink="/gold-coin" class="footer-link">Gold Coin</a></li>
              <li><a routerLink="/digi-gold" class="footer-link">Digi Gold</a></li>
              <li><a routerLink="/blog" class="footer-link">Blog</a></li>
              <li><a routerLink="/gold-rate" class="footer-link">Gold Rate</a></li>
            </ul>
          </div>

          <!-- Column 2: CUSTOMER SERVICES -->
          <div>
            <h4 class="footer-heading">Customer Services</h4>
            <ul class="space-y-2">
              <li><a routerLink="/terms-and-conditions" class="footer-link">Terms of Use</a></li>
              <li><a routerLink="/shipping-policy" class="footer-link">Shipping Policy</a></li>
              <li><a routerLink="/cancellation-policy" class="footer-link">Cancellation Policy</a></li>
              <li><a routerLink="/privacy-policy" class="footer-link">Privacy Policy</a></li>
              <li><a routerLink="/return-exchange-policy" class="footer-link">Return / Exchange Policy</a></li>
              <li><a routerLink="/gift-cards" class="footer-link">Gift Card</a></li>
            </ul>
          </div>

          <!-- Column 3: LET US HELP YOU -->
          <div>
            <h4 class="footer-heading">Let Us Help You</h4>
            <ul class="space-y-2">
              <li><a routerLink="/faq" class="footer-link">FAQ</a></li>
              <li><a routerLink="/contact" class="footer-link">Contact Us</a></li>
              <li><a routerLink="/ring-size-guide" class="footer-link">Ring Size Guide</a></li>
              <li><a routerLink="/bangle-size-guide" class="footer-link">Bangle Size Guide</a></li>
              <li><a routerLink="/compare" class="footer-link">Compare Products</a></li>
              <li><a routerLink="/orders" class="footer-link">Track Order</a></li>
            </ul>
          </div>

          <!-- Column 4: OUR COMPANY -->
          <div>
            <h4 class="footer-heading">Our Company</h4>
            <ul class="space-y-2">
              <li><a routerLink="/about" class="footer-link">About Us</a></li>
              <li><a routerLink="/stores" class="footer-link">Store Locator</a></li>
              <li><a routerLink="/our-brands" class="footer-link">Our Brands</a></li>
              <li><a routerLink="/contact" class="footer-link">Feedback</a></li>
            </ul>
            <div class="mt-4">
              <h4 class="footer-heading">Get In Touch</h4>
              <div class="space-y-2 text-[11px] text-gray-500">
                <p class="flex items-start gap-2"><span>📍</span><span>Girlyf Jewellery Pvt Ltd,<br>Chennai, India</span></p>
                <p class="flex items-center gap-2"><span>📞</span> 1800-123-4567 (Toll Free)</p>
                <p class="flex items-center gap-2"><span>📧</span> support&#64;girlyf.com</p>
              </div>
            </div>
          </div>

          <!-- Column 5: APP DOWNLOAD (JA feature) -->
          <div class="col-span-2 md:col-span-1">
            <h4 class="footer-heading">Download Our App</h4>
            <div class="flex flex-col items-start gap-3">
              <!-- QR Code -->
              <div class="w-24 h-24 bg-white border border-gray-200 rounded overflow-hidden">
                <img src="/assets/images/misc/qr-code.svg" alt="Scan to download Girlyf app" class="w-full h-full object-contain p-1">
              </div>
              <div class="flex flex-col gap-2">
                <a href="#" class="block">
                  <img src="/assets/images/misc/google-play.svg" alt="Get it on Google Play" class="h-10">
                </a>
                <a href="#" class="block">
                  <img src="/assets/images/misc/app-store.svg" alt="Download on the App Store" class="h-10">
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- PAYMENT BADGES -->
        <div class="mt-10 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-[10px] text-gray-400 uppercase tracking-wider mr-1">We Accept:</span>
            @for (pm of paymentMethods; track pm.name) {
              <img [src]="pm.icon" [alt]="pm.name" class="h-6 rounded border border-gray-200">
            }
          </div>
          <!-- Social Icons -->
          <div class="flex items-center gap-3">
            @for (social of socialLinks; track social.name) {
              <a [href]="social.url" target="_blank" rel="noopener" class="w-8 h-8 bg-primary-900 text-white rounded-full flex items-center justify-center text-xs hover:bg-gold-500 hover:text-primary-900 transition-colors" [title]="social.name">{{ social.icon }}</a>
            }
          </div>
        </div>

        <!-- COPYRIGHT -->
        <div class="mt-6 text-center">
          <p class="text-[10px] text-gray-400">&copy; {{ currentYear }} Girlyf Jewellery. All Rights Reserved. | Designed with ❤️ for jewellery lovers.</p>
          <p class="text-[9px] text-gray-300 mt-1">Safe and Secure Payments · 100% Authentic Products · Easy Returns</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer-heading { @apply text-[11px] font-heading uppercase tracking-[0.1em] text-primary-900 font-bold mb-3; }
    .footer-link { @apply text-xs text-gray-500 hover:text-primary-900 transition-colors; }
  `]
})
export class FooterComponent {
  email = '';
  currentYear = new Date().getFullYear();

  trustItems = [
    { icon: '🛡️', line1: 'Safe & Secure', line2: 'Delivery' },
    { icon: '🚚', line1: 'Free', line2: 'Shipping' },
    { icon: '💎', line1: 'Certified', line2: 'Diamonds' },
    { icon: '♻️', line1: 'Diamond', line2: 'Exchange' },
    { icon: '🏅', line1: 'BIS HUID', line2: 'Hallmarked' },
    { icon: '↩️', line1: '7 Days', line2: 'Return Policy' },
    { icon: '🔧', line1: 'Lifetime', line2: 'Maintenance' },
    { icon: '🔍', line1: 'Complete', line2: 'Transparency' },
    { icon: '💰', line1: 'Guaranteed', line2: 'Buyback' },
  ];

  paymentMethods = [
    { name: 'Visa', icon: '/assets/images/misc/visa.svg' },
    { name: 'Mastercard', icon: '/assets/images/misc/mastercard.svg' },
    { name: 'UPI', icon: '/assets/images/misc/upi.svg' },
    { name: 'PhonePe', icon: '/assets/images/misc/phonepe.svg' },
    { name: 'CCAvenue', icon: '/assets/images/misc/ccavenue.svg' },
    { name: 'Net Banking', icon: '/assets/images/misc/netbanking.svg' },
    { name: 'COD', icon: '/assets/images/misc/cod.svg' },
  ];

  socialLinks = [
    { name: 'Facebook', icon: 'f', url: '#' },
    { name: 'Twitter', icon: '𝕏', url: '#' },
    { name: 'Instagram', icon: '📸', url: '#' },
    { name: 'YouTube', icon: '▶', url: '#' },
    { name: 'Blog', icon: '✍', url: '/blog' },
  ];

  subscribe(): void {
    if (this.email) { this.email = ''; alert('Subscribed successfully!'); }
  }
}
