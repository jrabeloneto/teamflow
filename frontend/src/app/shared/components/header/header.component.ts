import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule],
  template: `
    <header class="header">
      <button mat-icon-button (click)="toggleSidebar.emit()" class="toggle-btn">
        <mat-icon>menu</mat-icon>
      </button>
      <div class="header-right">
        <div class="user-info" [matMenuTriggerFor]="userMenu">
          <div class="avatar">{{ getInitials() }}</div>
          <span class="user-name">{{ currentUser?.name }}</span>
          <mat-icon>expand_more</mat-icon>
        </div>
        <mat-menu #userMenu="matMenu">
          <div class="menu-header">
            <strong>{{ currentUser?.name }}</strong>
            <small>{{ currentUser?.email }}</small>
          </div>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Sair</span>
          </button>
        </mat-menu>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: 64px; background: white; border-bottom: 1px solid #e2e8f0;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 24px; position: sticky; top: 0; z-index: 50;
    }
    .toggle-btn { color: #64748b; }
    .header-right { display: flex; align-items: center; }
    .user-info {
      display: flex; align-items: center; gap: 10px; cursor: pointer;
      padding: 6px 12px; border-radius: 8px; transition: background 0.2s;
    }
    .user-info:hover { background: #f1f5f9; }
    .avatar {
      width: 36px; height: 36px; background: #3b82f6; color: white;
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-weight: 600; font-size: 13px;
    }
    .user-name { font-size: 14px; font-weight: 500; color: #1e293b; }
    .menu-header { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; }
    .menu-header strong { display: block; font-size: 14px; color: #1e293b; }
    .menu-header small { color: #64748b; font-size: 12px; }
  `]
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

  get currentUser() { return this.authService.getCurrentUser(); }

  getInitials(): string {
    const name = this.currentUser?.name || '';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  logout() { this.authService.logout(); }
}
