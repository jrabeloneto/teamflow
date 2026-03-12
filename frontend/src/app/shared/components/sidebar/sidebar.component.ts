import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, MatIconModule, MatTooltipModule],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <div class="sidebar-brand">
        <div class="brand-icon">TF</div>
        <span class="brand-name" *ngIf="!collapsed">TeamFlow</span>
      </div>
      <nav class="sidebar-nav">
        <a *ngFor="let item of navItems"
           [routerLink]="item.route"
           routerLinkActive="active"
           class="nav-item"
           [matTooltip]="collapsed ? item.label : ''"
           matTooltipPosition="right">
          <mat-icon>{{ item.icon }}</mat-icon>
          <span class="nav-label" *ngIf="!collapsed">{{ item.label }}</span>
        </a>
      </nav>
      <div class="sidebar-footer" *ngIf="!collapsed">
        <span class="version">v1.0.0</span>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px; height: 100vh; background: #0f172a; color: white;
      display: flex; flex-direction: column; position: fixed; left: 0; top: 0; z-index: 100;
      transition: width 0.3s ease; overflow: hidden;
    }
    .sidebar.collapsed { width: 72px; }
    .sidebar-brand {
      display: flex; align-items: center; gap: 12px; padding: 20px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .brand-icon {
      width: 40px; height: 40px; background: #3b82f6; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 14px; flex-shrink: 0;
    }
    .brand-name { font-size: 18px; font-weight: 700; white-space: nowrap; }
    .sidebar-nav { flex: 1; padding: 16px 8px; display: flex; flex-direction: column; gap: 4px; }
    .nav-item {
      display: flex; align-items: center; gap: 12px; padding: 12px;
      border-radius: 10px; color: rgba(255,255,255,0.6); text-decoration: none;
      transition: all 0.2s; cursor: pointer;
    }
    .nav-item:hover { background: rgba(255,255,255,0.08); color: white; }
    .nav-item.active { background: #3b82f6; color: white; }
    .nav-label { font-size: 14px; font-weight: 500; white-space: nowrap; }
    .sidebar-footer { padding: 16px; border-top: 1px solid rgba(255,255,255,0.1); }
    .version { font-size: 12px; color: rgba(255,255,255,0.3); }
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Equipes', icon: 'groups', route: '/teams' },
    { label: 'Membros', icon: 'person', route: '/members' }
  ];
}
