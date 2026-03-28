import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-heading font-bold text-gray-800">User Management</h1>
          <p class="text-xs text-gray-500 mt-1">{{ filteredUsers().length }} users found</p>
        </div>
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <div class="relative flex-1 sm:flex-none">
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()"
              placeholder="Search users..." class="w-full sm:w-64 pl-9 pr-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-gold-500">
            <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <select [(ngModel)]="roleFilter" (ngModelChange)="applyFilters()" class="px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-gold-500">
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
        </div>
      </div>

      <!-- STATS -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white border border-gray-100 rounded-lg p-4">
          <p class="text-[10px] text-gray-400 uppercase tracking-wider">Total Users</p>
          <p class="text-2xl font-heading font-bold text-gray-800 mt-1">{{ users().length }}</p>
        </div>
        <div class="bg-white border border-gray-100 rounded-lg p-4">
          <p class="text-[10px] text-gray-400 uppercase tracking-wider">Active Users</p>
          <p class="text-2xl font-heading font-bold text-green-600 mt-1">{{ activeCount() }}</p>
        </div>
        <div class="bg-white border border-gray-100 rounded-lg p-4">
          <p class="text-[10px] text-gray-400 uppercase tracking-wider">Admins</p>
          <p class="text-2xl font-heading font-bold text-primary-900 mt-1">{{ adminCount() }}</p>
        </div>
        <div class="bg-white border border-gray-100 rounded-lg p-4">
          <p class="text-[10px] text-gray-400 uppercase tracking-wider">New This Month</p>
          <p class="text-2xl font-heading font-bold text-gold-600 mt-1">{{ newThisMonth() }}</p>
        </div>
      </div>

      @if (loading()) {
        <div class="text-center py-12">
          <div class="w-8 h-8 border-2 border-gold-200 border-t-gold-500 rounded-full animate-spin mx-auto"></div>
          <p class="text-xs text-gray-400 mt-3">Loading users...</p>
        </div>
      } @else {
        <!-- TABLE -->
        <div class="bg-white border border-gray-100 rounded-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th class="text-left px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th class="text-left px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Phone</th>
                  <th class="text-left px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th class="text-left px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Orders</th>
                  <th class="text-left px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Total Spent</th>
                  <th class="text-left px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Joined</th>
                  <th class="text-left px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="text-right px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                @for (user of filteredUsers(); track user.id) {
                  <tr class="hover:bg-gray-50/50 transition-colors">
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          [class.bg-primary-100]="user.role === 'admin'" [class.text-primary-900]="user.role === 'admin'"
                          [class.bg-gray-100]="user.role !== 'admin'" [class.text-gray-600]="user.role !== 'admin'">
                          {{ user.name.charAt(0).toUpperCase() }}
                        </div>
                        <div>
                          <p class="font-semibold text-gray-800 text-xs">{{ user.name }}</p>
                          <p class="text-[10px] text-gray-400">{{ user.email }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-xs text-gray-600 hidden md:table-cell">{{ user.phone || '—' }}</td>
                    <td class="px-4 py-3">
                      <select [ngModel]="user.role" (ngModelChange)="updateRole(user, $event)"
                        class="text-[10px] px-2 py-1 border border-gray-200 rounded focus:outline-none focus:border-gold-500"
                        [class.bg-primary-50]="user.role === 'admin'" [class.text-primary-900]="user.role === 'admin'">
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td class="px-4 py-3 text-xs text-gray-600 hidden lg:table-cell">{{ user.ordersCount }}</td>
                    <td class="px-4 py-3 text-xs font-semibold text-gray-800 hidden lg:table-cell">₹{{ user.totalSpent | number:'1.0-0' }}</td>
                    <td class="px-4 py-3 text-[10px] text-gray-400 hidden md:table-cell">{{ user.createdAt | date:'mediumDate' }}</td>
                    <td class="px-4 py-3">
                      <button (click)="toggleStatus(user)"
                        class="text-[10px] px-2.5 py-1 rounded-full font-semibold transition-colors"
                        [class.bg-green-100]="user.isActive" [class.text-green-700]="user.isActive"
                        [class.bg-red-100]="!user.isActive" [class.text-red-700]="!user.isActive">
                        {{ user.isActive ? 'Active' : 'Blocked' }}
                      </button>
                    </td>
                    <td class="px-4 py-3 text-right">
                      <button (click)="viewUser(user)" class="text-[10px] text-primary-700 hover:text-primary-900 font-semibold mr-2">View</button>
                      <button (click)="confirmDelete(user)" class="text-[10px] text-red-500 hover:text-red-700 font-semibold">Delete</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          @if (filteredUsers().length === 0) {
            <div class="text-center py-10">
              <span class="text-4xl">👤</span>
              <p class="text-sm text-gray-500 mt-3">No users found</p>
            </div>
          }
        </div>
      }

      <!-- USER DETAIL MODAL -->
      @if (selectedUser()) {
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" (click)="selectedUser.set(null)">
          <div class="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
            <div class="p-6 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <h2 class="font-heading text-lg font-bold text-gray-800">User Details</h2>
                <button (click)="selectedUser.set(null)" class="text-gray-400 hover:text-gray-600">✕</button>
              </div>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-900 font-bold text-xl">
                  {{ selectedUser()!.name.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">{{ selectedUser()!.name }}</h3>
                  <p class="text-xs text-gray-500">{{ selectedUser()!.email }}</p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-gray-50 p-3 rounded">
                  <p class="text-[10px] text-gray-400 uppercase">Phone</p>
                  <p class="text-sm font-semibold mt-0.5">{{ selectedUser()!.phone || 'N/A' }}</p>
                </div>
                <div class="bg-gray-50 p-3 rounded">
                  <p class="text-[10px] text-gray-400 uppercase">Role</p>
                  <p class="text-sm font-semibold mt-0.5 capitalize">{{ selectedUser()!.role }}</p>
                </div>
                <div class="bg-gray-50 p-3 rounded">
                  <p class="text-[10px] text-gray-400 uppercase">Orders</p>
                  <p class="text-sm font-semibold mt-0.5">{{ selectedUser()!.ordersCount }}</p>
                </div>
                <div class="bg-gray-50 p-3 rounded">
                  <p class="text-[10px] text-gray-400 uppercase">Total Spent</p>
                  <p class="text-sm font-semibold mt-0.5">₹{{ selectedUser()!.totalSpent | number:'1.0-0' }}</p>
                </div>
                <div class="bg-gray-50 p-3 rounded">
                  <p class="text-[10px] text-gray-400 uppercase">Status</p>
                  <p class="text-sm font-semibold mt-0.5" [class.text-green-600]="selectedUser()!.isActive" [class.text-red-600]="!selectedUser()!.isActive">
                    {{ selectedUser()!.isActive ? 'Active' : 'Blocked' }}
                  </p>
                </div>
                <div class="bg-gray-50 p-3 rounded">
                  <p class="text-[10px] text-gray-400 uppercase">Joined</p>
                  <p class="text-sm font-semibold mt-0.5">{{ selectedUser()!.createdAt | date:'mediumDate' }}</p>
                </div>
              </div>
            </div>
            <div class="p-6 border-t border-gray-100 flex gap-2">
              <button (click)="toggleStatus(selectedUser()!); selectedUser.set(null)" class="btn-primary text-xs flex-1 py-2">
                {{ selectedUser()!.isActive ? 'Block User' : 'Activate User' }}
              </button>
              <button (click)="selectedUser.set(null)" class="btn-outline text-xs flex-1 py-2">Close</button>
            </div>
          </div>
        </div>
      }

      <!-- DELETE CONFIRM -->
      @if (userToDelete()) {
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" (click)="userToDelete.set(null)">
          <div class="bg-white rounded-lg max-w-sm w-full p-6" (click)="$event.stopPropagation()">
            <h3 class="font-heading text-lg font-bold text-gray-800 mb-2">Delete User?</h3>
            <p class="text-sm text-gray-500 mb-4">Are you sure you want to delete <strong>{{ userToDelete()!.name }}</strong>? This cannot be undone.</p>
            <div class="flex gap-2">
              <button (click)="deleteUser()" class="flex-1 bg-red-600 text-white text-xs py-2.5 rounded font-semibold hover:bg-red-700">Delete</button>
              <button (click)="userToDelete.set(null)" class="flex-1 btn-outline text-xs py-2.5">Cancel</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminUsersComponent implements OnInit {
  users = signal<AdminUser[]>([]);
  filteredUsers = signal<AdminUser[]>([]);
  loading = signal(true);
  selectedUser = signal<AdminUser | null>(null);
  userToDelete = signal<AdminUser | null>(null);

  searchQuery = '';
  roleFilter = 'all';

  activeCount = signal(0);
  adminCount = signal(0);
  newThisMonth = signal(0);

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.http.get<AdminUser[]>(`${this.apiUrl}/admin/users`).subscribe({
      next: (users) => {
        this.users.set(users);
        this.computeStats(users);
        this.applyFilters();
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  applyFilters(): void {
    let result = [...this.users()];
    if (this.roleFilter !== 'all') {
      result = result.filter(u => u.role === this.roleFilter);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.includes(q))
      );
    }
    this.filteredUsers.set(result);
  }

  updateRole(user: AdminUser, newRole: string): void {
    this.http.put(`${this.apiUrl}/admin/users/${user.id}/role`, { role: newRole }).subscribe({
      next: () => {
        user.role = newRole;
        this.computeStats(this.users());
      },
    });
  }

  toggleStatus(user: AdminUser): void {
    this.http.put(`${this.apiUrl}/admin/users/${user.id}/status`, { isActive: !user.isActive }).subscribe({
      next: () => {
        user.isActive = !user.isActive;
        this.computeStats(this.users());
      },
    });
  }

  viewUser(user: AdminUser): void {
    this.selectedUser.set(user);
  }

  confirmDelete(user: AdminUser): void {
    this.userToDelete.set(user);
  }

  deleteUser(): void {
    const user = this.userToDelete();
    if (!user) return;
    this.http.delete(`${this.apiUrl}/admin/users/${user.id}`).subscribe({
      next: () => {
        this.users.set(this.users().filter(u => u.id !== user.id));
        this.computeStats(this.users());
        this.applyFilters();
        this.userToDelete.set(null);
      },
    });
  }

  private computeStats(users: AdminUser[]): void {
    this.activeCount.set(users.filter(u => u.isActive).length);
    this.adminCount.set(users.filter(u => u.role === 'admin').length);
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    this.newThisMonth.set(users.filter(u => new Date(u.createdAt) >= monthStart).length);
  }
}
