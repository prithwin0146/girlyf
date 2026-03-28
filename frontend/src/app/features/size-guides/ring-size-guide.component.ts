import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ring-size-guide',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-primary-900 py-10 text-center">
        <h1 class="font-heading text-3xl text-white">Ring Size Guide</h1>
        <p class="text-white/60 text-sm mt-2">Find your perfect ring size in 3 easy methods</p>
      </div>

      <div class="max-w-5xl mx-auto px-4 py-12">

        <!-- Methods Toggle -->
        <div class="flex flex-wrap gap-2 justify-center mb-8">
          @for (method of methods; track method.id) {
            <button (click)="activeMethod.set(method.id)"
              class="px-5 py-2.5 rounded-xl text-sm font-heading transition-all"
              [ngClass]="activeMethod() === method.id ? 'bg-primary-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gold-300'">
              {{ method.label }}
            </button>
          }
        </div>

        <!-- Method 1: Measure Existing Ring -->
        @if (activeMethod() === 'measure-ring') {
          <div class="bg-white rounded-2xl shadow-sm p-8">
            <h2 class="font-heading text-xl text-gray-800 mb-6">Measure Using an Existing Ring</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div>
                <div class="space-y-4 mb-6">
                  @for (step of measureRingSteps; track step.num) {
                    <div class="flex gap-3">
                      <div class="w-7 h-7 bg-gold-500 rounded-full flex items-center justify-center text-primary-900 font-bold text-xs flex-shrink-0 mt-0.5">{{ step.num }}</div>
                      <p class="text-sm text-gray-600">{{ step.text }}</p>
                    </div>
                  }
                </div>
                <div class="bg-trust rounded-xl p-4 text-sm text-gray-600">
                  <strong class="text-primary-900">Pro Tip:</strong> Measure the inner diameter of the ring for the most accurate sizing. The diameter is the straight line across the inside of the ring.
                </div>
              </div>
              <div class="bg-gray-50 rounded-2xl p-6 text-center">
                <div class="text-8xl mb-4">💍</div>
                <p class="text-sm text-gray-500">Place your ring on a ruler or measuring tape to get the inner diameter in mm.</p>
              </div>
            </div>
          </div>
        }

        <!-- Method 2: Measure Your Finger -->
        @if (activeMethod() === 'measure-finger') {
          <div class="bg-white rounded-2xl shadow-sm p-8">
            <h2 class="font-heading text-xl text-gray-800 mb-6">Measure Your Finger</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div class="space-y-4">
                @for (step of measureFingerSteps; track step.num) {
                  <div class="flex gap-3">
                    <div class="w-7 h-7 bg-gold-500 rounded-full flex items-center justify-center text-primary-900 font-bold text-xs flex-shrink-0 mt-0.5">{{ step.num }}</div>
                    <p class="text-sm text-gray-600">{{ step.text }}</p>
                  </div>
                }
              </div>
              <div class="bg-trust rounded-xl p-5 text-sm text-gray-600 space-y-2">
                <p class="font-heading text-primary-900">Important Notes:</p>
                <p>• Fingers swell in warm weather or after exercise. Measure when relaxed.</p>
                <p>• Measure at the end of the day when fingers are at their largest.</p>
                <p>• For knuckle-fitting rings, measure the knuckle circumference.</p>
                <p>• If between sizes, order the larger size.</p>
              </div>
            </div>
          </div>
        }

        <!-- Size Chart (always visible) -->
        <div class="bg-white rounded-2xl shadow-sm p-8 mt-8">
          <h2 class="font-heading text-xl text-gray-800 mb-6">Ring Size Chart</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-primary-900 text-white">
                  <th class="px-4 py-3 text-left font-heading text-xs uppercase tracking-wider">Indian Size</th>
                  <th class="px-4 py-3 text-left font-heading text-xs uppercase tracking-wider">US Size</th>
                  <th class="px-4 py-3 text-left font-heading text-xs uppercase tracking-wider">UK/AU Size</th>
                  <th class="px-4 py-3 text-left font-heading text-xs uppercase tracking-wider">Diameter (mm)</th>
                  <th class="px-4 py-3 text-left font-heading text-xs uppercase tracking-wider">Circumference (mm)</th>
                </tr>
              </thead>
              <tbody>
                @for (row of sizeChart; track row.india; let i = $index) {
                  <tr [ngClass]="i % 2 === 0 ? 'bg-white' : 'bg-gray-50'" class="border-b border-gray-100">
                    <td class="px-4 py-3 font-heading font-bold text-primary-900">{{ row.india }}</td>
                    <td class="px-4 py-3">{{ row.us }}</td>
                    <td class="px-4 py-3">{{ row.uk }}</td>
                    <td class="px-4 py-3">{{ row.diameter }}</td>
                    <td class="px-4 py-3">{{ row.circumference }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- CTA -->
        <div class="text-center mt-8">
          <p class="text-gray-500 text-sm mb-4">Still unsure? Visit your nearest Girlyf store for a free ring sizing.</p>
          <a routerLink="/stores" class="btn-primary inline-block py-3 px-8 text-sm">FIND A STORE</a>
        </div>
      </div>
    </div>
  `
})
export class RingSizeGuideComponent {
  activeMethod = signal('measure-ring');

  methods = [
    { id: 'measure-ring', label: '💍 Using Existing Ring' },
    { id: 'measure-finger', label: '📏 Measure Your Finger' },
  ];

  measureRingSteps = [
    { num: '1', text: 'Take a ring that fits the finger you want to wear the new ring on.' },
    { num: '2', text: 'Place the ring on a ruler and measure the inside diameter of the ring in millimetres.' },
    { num: '3', text: 'Find the diameter in the size chart below to find your ring size.' },
  ];

  measureFingerSteps = [
    { num: '1', text: 'Cut a thin strip of paper about 1 cm wide and 10 cm long.' },
    { num: '2', text: 'Wrap it around the base of your finger snugly but not too tight.' },
    { num: '3', text: 'Mark where the paper overlaps and measure that length in millimetres.' },
    { num: '4', text: 'This is your finger\'s circumference. Find it in the size chart below.' },
  ];

  sizeChart = [
    { india: '1', us: '1', uk: 'A', diameter: '11.6', circumference: '36.5' },
    { india: '2', us: '1.5', uk: 'B', diameter: '11.9', circumference: '37.3' },
    { india: '3', us: '2', uk: 'C', diameter: '12.3', circumference: '38.1' },
    { india: '5', us: '2.5', uk: 'D', diameter: '12.7', circumference: '39.3' },
    { india: '6', us: '3', uk: 'F', diameter: '13.5', circumference: '41.3' },
    { india: '7', us: '3.5', uk: 'G', diameter: '13.9', circumference: '42.2' },
    { india: '8', us: '4', uk: 'H', diameter: '14.4', circumference: '43.2' },
    { india: '9', us: '4.5', uk: 'I', diameter: '14.8', circumference: '44.2' },
    { india: '10', us: '5', uk: 'J', diameter: '15.3', circumference: '45.1' },
    { india: '11', us: '5.5', uk: 'K', diameter: '15.7', circumference: '46.1' },
    { india: '12', us: '6', uk: 'L', diameter: '16.2', circumference: '47.0' },
    { india: '13', us: '6.5', uk: 'M', diameter: '16.6', circumference: '48.0' },
    { india: '14', us: '7', uk: 'N', diameter: '17.0', circumference: '49.0' },
    { india: '15', us: '7.5', uk: 'O', diameter: '17.5', circumference: '50.0' },
    { india: '16', us: '8', uk: 'P', diameter: '17.9', circumference: '51.0' },
    { india: '17', us: '8.5', uk: 'Q', diameter: '18.3', circumference: '52.1' },
    { india: '18', us: '9', uk: 'R', diameter: '18.8', circumference: '53.1' },
    { india: '19', us: '9.5', uk: 'S', diameter: '19.2', circumference: '54.0' },
    { india: '20', us: '10', uk: 'T', diameter: '19.6', circumference: '55.1' },
  ];
}
