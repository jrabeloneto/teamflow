import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService } from '../../core/services/dashboard.service';
import { Dashboard } from '../../core/models/dashboard.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div class="dashboard">
      <div class="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Bem-vindo, {{ currentUser?.name }}. Aqui está o resumo do sistema.</p>
        </div>
        <div class="header-actions">
          <a mat-raised-button color="primary" routerLink="/teams/new">
            <mat-icon>add</mat-icon> Nova Equipe
          </a>
          <a mat-stroked-button routerLink="/members/new">
            <mat-icon>person_add</mat-icon> Novo Membro
          </a>
        </div>
      </div>

      <div *ngIf="loading" class="loading-state">
        <mat-spinner diameter="48"></mat-spinner>
      </div>

      <ng-container *ngIf="!loading && data">
        <div class="stats-grid">
          <div class="stat-card blue">
            <div class="stat-icon"><mat-icon>groups</mat-icon></div>
            <div class="stat-info">
              <span class="stat-value">{{ data.totalTeams }}</span>
              <span class="stat-label">Total de Equipes</span>
              <span class="stat-sub">{{ data.activeTeams }} ativas</span>
            </div>
          </div>
          <div class="stat-card green">
            <div class="stat-icon"><mat-icon>person</mat-icon></div>
            <div class="stat-info">
              <span class="stat-value">{{ data.totalMembers }}</span>
              <span class="stat-label">Total de Membros</span>
              <span class="stat-sub">{{ data.activeMembers }} ativos</span>
            </div>
          </div>
          <div class="stat-card orange">
            <div class="stat-icon"><mat-icon>beach_access</mat-icon></div>
            <div class="stat-info">
              <span class="stat-value">{{ data.onLeaveMembers }}</span>
              <span class="stat-label">Em Férias</span>
              <span class="stat-sub">membros ausentes</span>
            </div>
          </div>
          <div class="stat-card red">
            <div class="stat-icon"><mat-icon>person_off</mat-icon></div>
            <div class="stat-info">
              <span class="stat-value">{{ data.inactiveMembers }}</span>
              <span class="stat-label">Inativos</span>
              <span class="stat-sub">membros inativos</span>
            </div>
          </div>
        </div>

        <div class="content-grid">
          <div class="card">
            <div class="card-header">
              <h3>Equipes Recentes</h3>
              <a routerLink="/teams" mat-button color="primary">Ver todas</a>
            </div>
            <div class="list">
              <div *ngFor="let team of data.recentTeams" class="list-item">
                <div class="item-avatar blue">{{ team.name[0] }}</div>
                <div class="item-info">
                  <span class="item-name">{{ team.name }}</span>
                  <span class="item-sub">{{ team.department || 'Sem departamento' }} · {{ team.memberCount }} membros</span>
                </div>
                <span class="badge" [class]="'badge-' + team.status.toLowerCase()">{{ getStatusLabel(team.status) }}</span>
              </div>
              <div *ngIf="data.recentTeams.length === 0" class="empty-list">Nenhuma equipe cadastrada</div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3>Membros Recentes</h3>
              <a routerLink="/members" mat-button color="primary">Ver todos</a>
            </div>
            <div class="list">
              <div *ngFor="let member of data.recentMembers" class="list-item">
                <div class="item-avatar green">{{ member.name[0] }}</div>
                <div class="item-info">
                  <span class="item-name">{{ member.name }}</span>
                  <span class="item-sub">{{ member.position || 'Sem cargo' }} · {{ member.teamName || 'Sem equipe' }}</span>
                </div>
                <span class="badge" [class]="'badge-' + member.status.toLowerCase()">{{ getMemberStatusLabel(member.status) }}</span>
              </div>
              <div *ngIf="data.recentMembers.length === 0" class="empty-list">Nenhum membro cadastrado</div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .dashboard { max-width: 1200px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
    .page-header h1 { font-size: 28px; font-weight: 700; color: #0f172a; margin: 0 0 4px; }
    .page-header p { color: #64748b; margin: 0; }
    .header-actions { display: flex; gap: 12px; }
    .loading-state { display: flex; justify-content: center; padding: 80px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 28px; }
    .stat-card {
      background: white; border-radius: 16px; padding: 24px;
      display: flex; gap: 16px; align-items: center;
      box-shadow: 0 1px 8px rgba(0,0,0,0.06); border-left: 4px solid;
    }
    .stat-card.blue { border-color: #3b82f6; }
    .stat-card.green { border-color: #10b981; }
    .stat-card.orange { border-color: #f59e0b; }
    .stat-card.red { border-color: #ef4444; }
    .stat-icon { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .blue .stat-icon { background: #eff6ff; color: #3b82f6; }
    .green .stat-icon { background: #ecfdf5; color: #10b981; }
    .orange .stat-icon { background: #fffbeb; color: #f59e0b; }
    .red .stat-icon { background: #fef2f2; color: #ef4444; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 32px; font-weight: 800; color: #0f172a; line-height: 1; }
    .stat-label { font-size: 14px; font-weight: 600; color: #374151; margin-top: 4px; }
    .stat-sub { font-size: 12px; color: #9ca3af; margin-top: 2px; }
    .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 8px rgba(0,0,0,0.06); }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .card-header h3 { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0; }
    .list { display: flex; flex-direction: column; gap: 12px; }
    .list-item { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
    .list-item:last-child { border-bottom: none; }
    .item-avatar { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; flex-shrink: 0; }
    .item-avatar.blue { background: #3b82f6; }
    .item-avatar.green { background: #10b981; }
    .item-info { flex: 1; display: flex; flex-direction: column; }
    .item-name { font-size: 14px; font-weight: 600; color: #1e293b; }
    .item-sub { font-size: 12px; color: #94a3b8; }
    .badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .badge-active { background: #ecfdf5; color: #059669; }
    .badge-inactive { background: #fef2f2; color: #dc2626; }
    .badge-on_leave { background: #fffbeb; color: #d97706; }
    .badge-archived { background: #f1f5f9; color: #64748b; }
    .empty-list { text-align: center; color: #94a3b8; padding: 20px; font-size: 14px; }
    @media (max-width: 768px) { .content-grid { grid-template-columns: 1fr; } .header-actions { flex-direction: column; } }
  `]
})
export class DashboardComponent implements OnInit {
  data: Dashboard | null = null;
  loading = true;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  get currentUser() { return this.authService.getCurrentUser(); }

  ngOnInit(): void {
    this.dashboardService.getDashboard().subscribe({
      next: (data) => { this.data = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = { ACTIVE: 'Ativa', INACTIVE: 'Inativa', ARCHIVED: 'Arquivada' };
    return map[status] || status;
  }

  getMemberStatusLabel(status: string): string {
    const map: Record<string, string> = { ACTIVE: 'Ativo', INACTIVE: 'Inativo', ON_LEAVE: 'Férias', SUSPENDED: 'Suspenso' };
    return map[status] || status;
  }
}
