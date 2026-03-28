import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeoService } from '@core/services/seo.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="bg-primary-900 py-12">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <p class="text-gold-400 font-accent text-xs uppercase tracking-[0.3em] mb-3">Get In Touch</p>
        <h1 class="font-heading text-3xl text-white">Contact Us</h1>
        <div class="gold-divider mx-auto mt-4"></div>
      </div>
    </section>

    <div class="max-w-5xl mx-auto px-4 py-10">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <!-- FORM -->
        <div class="bg-white border border-gray-100 p-6">
          <h2 class="font-heading text-lg text-primary-900 mb-4">Send us a message</h2>
          <form (ngSubmit)="submit()">
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Full Name *</label>
                <input type="text" [(ngModel)]="form.name" name="name" required class="w-full px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-500">
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Email *</label>
                <input type="email" [(ngModel)]="form.email" name="email" required class="w-full px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-500">
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Phone</label>
                <input type="tel" [(ngModel)]="form.phone" name="phone" class="w-full px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-500">
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Subject *</label>
                <select [(ngModel)]="form.subject" name="subject" required class="w-full px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-500">
                  <option value="">Select a subject</option>
                  <option value="order">Order Enquiry</option>
                  <option value="product">Product Information</option>
                  <option value="custom">Custom Jewellery</option>
                  <option value="return">Returns & Exchange</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Message *</label>
                <textarea [(ngModel)]="form.message" name="message" rows="4" required class="w-full px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-500 resize-none"></textarea>
              </div>
              <!-- MATH CAPTCHA (JA-style) -->
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Verify: {{ captchaA }} + {{ captchaB }} = ?</label>
                <input type="number" [(ngModel)]="captchaAnswer" name="captcha" required class="w-full px-3 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold-500">
              </div>
            </div>
            @if (error()) { <p class="text-xs text-red-600 mt-2">{{ error() }}</p> }
            @if (success()) { <p class="text-xs text-green-600 mt-2">{{ success() }}</p> }
            <button type="submit" [disabled]="sending()" class="btn-gold w-full mt-4 py-3 text-sm font-bold">
              @if (sending()) { <span class="animate-spin inline-block mr-1">⏳</span> } SEND MESSAGE
            </button>
          </form>
        </div>

        <!-- INFO -->
        <div class="space-y-6">
          <div class="bg-brown-200/30 p-6 border border-brown-500/10">
            <h3 class="font-heading text-sm uppercase tracking-wider text-primary-900 mb-3">Head Office</h3>
            <div class="space-y-2 text-sm text-gray-600">
              <p class="flex items-start gap-2">📍 Girlyf Jewellery Pvt Ltd,<br>Anna Salai, Chennai, Tamil Nadu 600002</p>
              <p class="flex items-center gap-2">📞 <a href="tel:18001234567" class="text-primary-900 font-semibold">1800-123-4567</a> (Toll Free)</p>
              <p class="flex items-center gap-2">📧 <a href="mailto:support@girlyf.com" class="text-primary-900 font-semibold">support&#64;girlyf.com</a></p>
              <p class="flex items-center gap-2">🕐 Mon-Sat: 10:00 AM - 8:00 PM</p>
            </div>
          </div>

          <div class="bg-brown-200/30 p-6 border border-brown-500/10">
            <h3 class="font-heading text-sm uppercase tracking-wider text-primary-900 mb-3">WhatsApp</h3>
            <p class="text-sm text-gray-600 mb-3">Get instant support on WhatsApp</p>
            <a href="https://wa.me/918001234567" target="_blank" class="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded text-sm font-semibold hover:bg-green-600 transition-colors">
              💬 Chat on WhatsApp
            </a>
          </div>

          <div class="bg-brown-200/30 p-6 border border-brown-500/10">
            <h3 class="font-heading text-sm uppercase tracking-wider text-primary-900 mb-3">Visit Our Store</h3>
            <p class="text-sm text-gray-600 mb-1 font-semibold">Girlyf Jewellery — Bangalore</p>
            <p class="text-xs text-gray-500 mb-3">Jayanagar 4th Block, Bangalore 560011<br>Mon–Sun: 10:00 AM – 9:00 PM</p>
            <a href="https://maps.google.com/?q=Jayanagar+4th+Block+Bangalore" target="_blank" class="btn-primary text-xs inline-block">GET DIRECTIONS →</a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ContactComponent implements OnInit {
  form = { name: '', email: '', phone: '', subject: '', message: '' };
  captchaA = Math.floor(Math.random() * 10) + 1;
  captchaB = Math.floor(Math.random() * 10) + 1;
  captchaAnswer: number | null = null;
  sending = signal(false);
  error = signal('');
  success = signal('');

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.update({
      title: 'Contact Girlyf Jewellery — Customer Support & Enquiries',
      description: 'Get in touch with Girlyf Jewellery. Call 1800-123-4567 (Toll Free), email support@girlyf.com, or visit our nearest showroom.',
      keywords: 'contact Girlyf, customer support, jewellery enquiry, Girlyf phone number',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Contact Us', url: '/contact' },
      ],
    });
  }

  submit(): void {
    this.error.set('');
    this.success.set('');
    if (!this.form.name || !this.form.email || !this.form.subject || !this.form.message) {
      this.error.set('Please fill in all required fields');
      return;
    }
    if (this.captchaAnswer !== this.captchaA + this.captchaB) {
      this.error.set('Incorrect verification answer');
      return;
    }
    this.sending.set(true);
    setTimeout(() => {
      this.sending.set(false);
      this.success.set('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.');
      this.form = { name: '', email: '', phone: '', subject: '', message: '' };
      this.captchaA = Math.floor(Math.random() * 10) + 1;
      this.captchaB = Math.floor(Math.random() * 10) + 1;
      this.captchaAnswer = null;
    }, 1000);
  }
}
