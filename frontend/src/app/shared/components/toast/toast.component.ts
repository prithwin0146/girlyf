import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      @for (msg of toast.messages(); track msg.id) {
        <div
          class="px-5 py-3 rounded-lg shadow-2xl text-white text-sm font-medium animate-slide-up flex items-center gap-3 min-w-[280px]"
          [class.bg-green-600]="msg.type === 'success'"
          [class.bg-red-600]="msg.type === 'error'"
          [class.bg-blue-600]="msg.type === 'info'"
        >
          <span>{{ msg.type === 'success' ? '✓' : msg.type === 'error' ? '✕' : 'ℹ' }}</span>
          <span class="flex-1">{{ msg.text }}</span>
          <button (click)="toast.dismiss(msg.id)" class="text-white/70 hover:text-white">✕</button>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  constructor(public toast: ToastService) {}
}
