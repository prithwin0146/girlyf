import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  mobileImageUrl: string;
  linkUrl: string;
  position: string;
  sortOrder: number;
  isActive: boolean;
}

@Component({
  selector: 'app-admin-banners',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-heading font-bold text-gray-800">Banner Management</h2>
          <p class="text-sm text-gray-500 mt-1">Manage hero banners and promotional slides</p>
        </div>
        <button (click)="showForm.set(true); resetForm()" class="btn-primary text-xs py-2 px-4">+ Add Banner</button>
      </div>

      <!-- BANNER LIST -->
      <div class="grid gap-4">
        @for (banner of banners(); track banner.id) {
          <div class="bg-white border border-gray-100 rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div class="w-40 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              <img [src]="banner.imageUrl || '/assets/images/misc/placeholder.svg'" [alt]="banner.title" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-bold text-gray-800 truncate">{{ banner.title }}</h3>
              <p class="text-xs text-gray-400 mt-1">Position: <span class="font-semibold text-gray-600">{{ banner.position }}</span> · Order: {{ banner.sortOrder }}</p>
              <p class="text-xs text-gray-400">Link: <span class="text-primary-700">{{ banner.linkUrl || 'None' }}</span></p>
            </div>
            <div class="flex items-center gap-3 flex-shrink-0">
              <label class="flex items-center gap-1.5 text-xs">
                <input type="checkbox" [checked]="banner.isActive" (change)="toggleActive(banner)" class="accent-gold-500">
                Active
              </label>
              <button (click)="editBanner(banner)" class="text-xs text-primary-700 font-semibold hover:underline">Edit</button>
              <button (click)="deleteBanner(banner.id)" class="text-xs text-red-600 font-semibold hover:underline">Delete</button>
            </div>
          </div>
        } @empty {
          <div class="text-center py-12 text-gray-400">
            <p class="text-lg mb-2">No banners configured</p>
            <p class="text-sm">Add your first banner to showcase on the homepage.</p>
          </div>
        }
      </div>

      <!-- ADD/EDIT FORM OVERLAY -->
      @if (showForm()) {
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" (click)="showForm.set(false)">
          <div class="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto" (click)="$event.stopPropagation()">
            <div class="p-5 border-b">
              <h3 class="font-heading font-bold text-gray-800">{{ editingId ? 'Edit Banner' : 'Add New Banner' }}</h3>
            </div>
            <div class="p-5 space-y-4">
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Title</label>
                <input type="text" [(ngModel)]="form.title" class="input-field text-sm" placeholder="Banner title">
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Desktop Image URL</label>
                <input type="text" [(ngModel)]="form.imageUrl" class="input-field text-sm" placeholder="https://...">
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Mobile Image URL</label>
                <input type="text" [(ngModel)]="form.mobileImageUrl" class="input-field text-sm" placeholder="https://...">
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Link URL</label>
                <input type="text" [(ngModel)]="form.linkUrl" class="input-field text-sm" placeholder="/products or https://...">
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Position</label>
                  <select [(ngModel)]="form.position" class="input-field text-sm">
                    <option value="hero">Hero</option>
                    <option value="middle">Middle</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Sort Order</label>
                  <input type="number" [(ngModel)]="form.sortOrder" class="input-field text-sm" min="0">
                </div>
              </div>
              <label class="flex items-center gap-2 text-sm">
                <input type="checkbox" [(ngModel)]="form.isActive" class="accent-gold-500">
                Active
              </label>
            </div>
            <div class="p-5 border-t flex justify-end gap-3">
              <button (click)="showForm.set(false)" class="btn-outline text-xs py-2 px-4">Cancel</button>
              <button (click)="saveBanner()" class="btn-primary text-xs py-2 px-4">{{ editingId ? 'Update' : 'Create' }}</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminBannersComponent implements OnInit {
  private readonly api = `${environment.apiUrl}/admin/banners`;
  banners = signal<Banner[]>([]);
  showForm = signal(false);
  editingId: number | null = null;
  form: Partial<Banner> = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBanners();
  }

  loadBanners(): void {
    this.http.get<Banner[]>(this.api).subscribe({
      next: (data) => this.banners.set(data),
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.form = { title: '', imageUrl: '', mobileImageUrl: '', linkUrl: '', position: 'hero', sortOrder: 0, isActive: true };
  }

  editBanner(b: Banner): void {
    this.editingId = b.id;
    this.form = { ...b };
    this.showForm.set(true);
  }

  saveBanner(): void {
    if (this.editingId) {
      this.http.put(`${this.api}/${this.editingId}`, this.form).subscribe({
        next: () => { this.showForm.set(false); this.loadBanners(); },
      });
    } else {
      this.http.post(this.api, this.form).subscribe({
        next: () => { this.showForm.set(false); this.loadBanners(); },
      });
    }
  }

  toggleActive(b: Banner): void {
    this.http.put(`${this.api}/${b.id}`, { ...b, isActive: !b.isActive }).subscribe({
      next: () => this.loadBanners(),
    });
  }

  deleteBanner(id: number): void {
    if (confirm('Are you sure you want to delete this banner?')) {
      this.http.delete(`${this.api}/${id}`).subscribe({
        next: () => this.loadBanners(),
      });
    }
  }
}
