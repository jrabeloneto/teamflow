import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, CommonModule],
  template: `
    <div class="layout">
      <app-sidebar [collapsed]="sidebarCollapsed"></app-sidebar>
      <div class="main-content" [class.expanded]="sidebarCollapsed">
        <app-header (toggleSidebar)="toggleSidebar()"></app-header>
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout { display: flex; height: 100vh; overflow: hidden; background: #f5f7fa; }
    .main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; margin-left: 260px; transition: margin-left 0.3s ease; }
    .main-content.expanded { margin-left: 72px; }
    .page-content { flex: 1; overflow-y: auto; padding: 24px; }
    @media (max-width: 768px) { .main-content { margin-left: 0 !important; } }
  `]
})
export class LayoutComponent {
  sidebarCollapsed = false;
  toggleSidebar() { this.sidebarCollapsed = !this.sidebarCollapsed; }
}
