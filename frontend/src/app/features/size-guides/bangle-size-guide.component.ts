import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bangle-size-guide',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-primary-900 py-10 text-center">
        <h1 class="font-heading text-3xl text-white">Bangle Size Guide</h1>
        <p class="text-white/60 text-sm mt-2">Find your perfect bangle size easily</p>
      </div>

      <div class="max-w-5xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          <!-- How to Measure -->
          <div class="bg-white rounded-2xl shadow-sm p-8">
            <h2 class="font-heading text-xl text-gray-800 mb-6">How to Measure</h2>
            <div class="space-y-4 mb-6">
              @for (step of measureSteps; track step.num) {
                <div class="flex gap-3">
                  <div class="w-7 h-7 bg-gold-500 rounded-full flex items-center justify-center text-primary-900 font-bold text-xs flex-shrink-0 mt-0.5">{{ step.num }}</div>
                  <p class="text-sm text-gray-600">{{ step.text }}</p>
                </div>
              }
            </div>
            <div class="bg-trust rounded-xl p-4 text-sm text-gray-600 space-y-1">
              <p class="font-heading text-primary-900 mb-2">Important Tips:</p>
              <p>• Always measure your dominant hand as it may be slightly larger.</p>
              <p>• Account for knuckle width when sliding the bangle on.</p>
              <p>• If between sizes, choose the larger size for comfort.</p>
              <p>• Bangles should fit snugly but slide over the knuckle with a gentle push.</p>
            </div>
          </div>

          <!-- Interactive Calculator -->
          <div class="bg-white rounded-2xl shadow-sm p-8">
            <h2 class="font-heading text-xl text-gray-800 mb-6">Size Calculator</h2>
            <div class="mb-4">
              <label class="block text-sm text-gray-600 mb-2">Your Hand Circumference (mm)</label>
              <input type="range" [(ngModel)]="circumference" [ngModelOptions]="{standalone: true}"
                min="140" max="220" step="1"
                class="w-full accent-yellow-500 mb-2">
              <div class="flex justify-between text-xs text-gray-400">
                <span>140mm</span>
                <span class="font-heading text-primary-900 text-base font-bold">{{ circumference }}mm</span>
                <span>220mm</span>
              </div>
            </div>
            <div class="bg-gold-50 border border-gold-300 rounded-2xl p-5 text-center">
              <p class="text-xs text-gray-500 mb-1">Your Recommended Bangle Size</p>
              <p class="font-heading text-3xl font-bold text-primary-900">{{ getBangleSize() }}</p>
              <p class="text-xs text-gray-400 mt-1">Inner Diameter: {{ getInnerDiameter() }}mm</p>
            </div>
          </div>
        </div>

        <!-- Size Chart -->
        <div class="bg-white rounded-2xl shadow-sm p-8">
          <h2 class="font-heading text-xl text-gray-800 mb-6">Bangle Size Chart</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-primary-900 text-white">
                  <th class="px-4 py-3 text-left font-heading text-xs uppercase tracking-wider">Size Number</th>
                  <th class="px-4 py-3 text-left font-heading text-xs uppercase tracking-wider">Inner Diameter (mm)</th>
                  <th class="px-4 py-3 text-left font-heading text-xs uppercase tracking-wider">Inner Diameter (inches)</th>
                  <th class="px-4 py-3 text-left font-heading text-xs uppercase tracking-wider">Circumference (mm)</th>
                  <th class="px-4 py-3 text-left font-heading text-xs uppercase tracking-wider">Fits Wrist</th>
                </tr>
              </thead>
              <tbody>
                @for (row of sizeChart; track row.size; let i = $index) {
                  <tr [ngClass]="i % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                    class="border-b border-gray-100 cursor-pointer hover:bg-gold-50 transition-colors"
                    (click)="circumference = row.circumference">
                    <td class="px-4 py-3 font-heading font-bold text-primary-900">{{ row.size }}</td>
                    <td class="px-4 py-3">{{ row.diameter }}</td>
                    <td class="px-4 py-3">{{ row.inches }}</td>
                    <td class="px-4 py-3">{{ row.circumference }}</td>
                    <td class="px-4 py-3 text-xs text-gray-500">{{ row.fits }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <p class="text-xs text-gray-400 mt-3">* Click a row to preview in the calculator above</p>
        </div>

        <!-- Still unsure CTA -->
        <div class="text-center mt-8 bg-white rounded-2xl shadow-sm p-8">
          <p class="font-heading text-lg text-gray-700 mb-2">Still Not Sure About Your Size?</p>
          <p class="text-gray-500 text-sm mb-4">Visit any Girlyf store for a free, professional bangle sizing service.</p>
          <div class="flex flex-wrap justify-center gap-4">
            <a routerLink="/stores" class="btn-primary inline-block py-3 px-8 text-sm">FIND A STORE</a>
            <a href="https://api.whatsapp.com/send?phone=918606083922&text=I%20need%20help%20finding%20my%20bangle%20size" target="_blank"
              class="btn-gold inline-block py-3 px-8 text-sm">ASK ON WHATSAPP</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BangleSizeGuideComponent {
  circumference = 165;

  measureSteps = [
    { num: '1', text: 'Make your hand into a cone shape — bring your thumb and pinky together and tuck in your other fingers tightly.' },
    { num: '2', text: 'Wrap a measuring tape or strip of paper around the widest part of your hand at the knuckles.' },
    { num: '3', text: 'Note the measurement in millimetres. This is your hand circumference.' },
    { num: '4', text: 'Find this measurement in the size chart below to find your bangle size.' },
  ];

  sizeChart = [
    { size: '2/2', diameter: '44', inches: '1.73"', circumference: 140, fits: 'XS Wrist (below 14cm)' },
    { size: '2/4', diameter: '46', inches: '1.81"', circumference: 145, fits: 'XS-S Wrist' },
    { size: '2/6', diameter: '48', inches: '1.89"', circumference: 150, fits: 'S Wrist (14-15cm)' },
    { size: '2/8', diameter: '50', inches: '1.97"', circumference: 157, fits: 'S-M Wrist' },
    { size: '2/10', diameter: '52', inches: '2.05"', circumference: 163, fits: 'M Wrist (15-16cm)' },
    { size: '2/12', diameter: '54', inches: '2.13"', circumference: 170, fits: 'M-L Wrist' },
    { size: '2/14', diameter: '56', inches: '2.20"', circumference: 177, fits: 'L Wrist (16-17cm)' },
    { size: '2/16', diameter: '58', inches: '2.28"', circumference: 182, fits: 'L-XL Wrist' },
    { size: '2/18', diameter: '60', inches: '2.36"', circumference: 188, fits: 'XL Wrist (17-18cm)' },
    { size: '2/20', diameter: '62', inches: '2.44"', circumference: 195, fits: 'XL-XXL Wrist' },
    { size: '2/22', diameter: '64', inches: '2.52"', circumference: 201, fits: 'XXL Wrist (18cm+)' },
    { size: '2/24', diameter: '66', inches: '2.60"', circumference: 207, fits: 'XXL+ Wrist' },
  ];

  getBangleSize(): string {
    const found = this.sizeChart.reduce((prev, curr) =>
      Math.abs(curr.circumference - this.circumference) < Math.abs(prev.circumference - this.circumference) ? curr : prev
    );
    return found.size;
  }

  getInnerDiameter(): string {
    const found = this.sizeChart.reduce((prev, curr) =>
      Math.abs(curr.circumference - this.circumference) < Math.abs(prev.circumference - this.circumference) ? curr : prev
    );
    return found.diameter;
  }
}
