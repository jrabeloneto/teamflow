import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TeamService } from '../../../core/services/team.service';
import { Team } from '../../../core/models/team.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule,
    MatSelectModule, MatProgressSpinnerModule, MatSnackBarModule, MatDialogModule, MatPaginatorModule
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Equipes</h1>
          <p>Gerencie todas as equipes da organização</p>
        </div>
        <a mat-raised-button color="primary" routerLink="/teams/new">
          <mat-icon>add</mat-icon> Nova Equipe
        </a>
      </div>

      <div class="filters-bar">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar equipes</mat-label>
          <input matInput [(ngModel)]="searchTerm" (ngModelChange)="onSearch($event)" placeholder="Nome ou departamento...">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Status</mat-label>
          <mat-select [(ngModel)]="statusFilter" (ngModelChange)="loadTeams()">
            <mat-option value="">Todos</mat-option>
            <mat-option value="ACTIVE">Ativa</mat-option>
            <mat-option value="INACTIVE">Inativa</mat-option>
            <mat-option value="ARCHIVED">Arquivada</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div *ngIf="loading" class="loading-state">
        <mat-spinner diameter="48"></mat-spinner>
      </div>

      <div *ngIf="!loading" class="teams-grid">
        <div *ngFor="let team of teams" class="team-card">
          <div class="team-card-header">
            <div class="team-avatar">{{ team.name[0] }}</div>
            <span class="badge" [class]="'badge-' + team.status.toLowerCase()">{{ getStatusLabel(team.status) }}</span>
          </div>
          <h3 class="team-name">{{ team.name }}</h3>
          <p class="team-dept">{{ team.department || 'Sem departamento' }}</p>
          <p class="team-desc">{{ team.description || 'Sem descrição' }}</p>
          <div class="team-meta">
            <span><mat-icon>person</mat-icon> {{ team.memberCount }} membros</span>
            <span *ngIf="team.managerName"><mat-icon>manage_accounts</mat-icon> {{ team.managerName }}</span>
          </div>
          <div class="team-actions">
            <a mat-stroked-button [routerLink]="['/teams', team.id, 'edit']">
              <mat-icon>edit</mat-icon> Editar
            </a>
            <button mat-stroked-button color="warn" (click)="deleteTeam(team)">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>
        <div *ngIf="teams.length === 0" class="empty-state">
          <mat-icon>groups</mat-icon>
          <h3>Nenhuma equipe encontrada</h3>
          <p>Crie a primeira equipe para começar</p>
          <a mat-raised-button color="primary" routerLink="/teams/new">Criar Equipe</a>
        </div>
      </div>

      <mat-paginator
        *ngIf="totalElements > 0"
        [length]="totalElements"
        [pageSize]="pageSize"
        [pageIndex]="pageIndex"
        [pageSizeOptions]="[6, 12, 24]"
        (page)="onPageChange($event)"
        showFirstLastButtons>
      </mat-paginator>
    </div>
  `,
  styles: [`
    .page { max-width: 1200px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
    .page-header h1 { font-size: 28px; font-weight: 700; color: #0f172a; margin: 0 0 4px; }
    .page-header p { color: #64748b; margin: 0; }
    .filters-bar { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
    .search-field { flex: 1; min-width: 240px; }
    .filter-field { width: 180px; }
    .loading-state { display: flex; justify-content: center; padding: 80px; }
    .teams-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-bottom: 24px; }
    .team-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 8px rgba(0,0,0,0.06); transition: transform 0.2s, box-shadow 0.2s; }
    .team-card:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .team-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .team-avatar { width: 48px; height: 48px; background: #3b82f6; color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; }
    .team-name { font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 4px; }
    .team-dept { font-size: 13px; color: #3b82f6; font-weight: 600; margin: 0 0 8px; }
    .team-desc { font-size: 13px; color: #64748b; margin: 0 0 16px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .team-meta { display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap; }
    .team-meta span { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #64748b; }
    .team-meta mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .team-actions { display: flex; gap: 8px; }
    .team-actions a { flex: 1; }
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .badge-active { background: #ecfdf5; color: #059669; }
    .badge-inactive { background: #fef2f2; color: #dc2626; }
    .badge-archived { background: #f1f5f9; color: #64748b; }
    .empty-state { grid-column: 1/-1; text-align: center; padding: 80px 20px; color: #94a3b8; }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; }
    .empty-state h3 { font-size: 20px; color: #374151; margin-bottom: 8px; }
    @media (max-width: 600px) { .teams-grid { grid-template-columns: 1fr; } }
  `]
})
export class TeamListComponent implements OnInit {
  teams: Team[] = [];
  loading = true;
  searchTerm = '';
  statusFilter = '';
  pageIndex = 0;
  pageSize = 6;
  totalElements = 0;
  private searchSubject = new Subject<string>();

  constructor(private teamService: TeamService, private snackBar: MatSnackBar) {
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe(() => {
      this.pageIndex = 0;
      this.loadTeams();
    });
  }

  ngOnInit(): void { this.loadTeams(); }

  loadTeams(): void {
    this.loading = true;
    this.teamService.getAll(this.pageIndex, this.pageSize, this.searchTerm || undefined, this.statusFilter || undefined).subscribe({
      next: (page) => {
        this.teams = page.content;
        this.totalElements = page.totalElements;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onSearch(term: string): void { this.searchSubject.next(term); }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTeams();
  }

  deleteTeam(team: Team): void {
    if (!confirm(`Excluir a equipe "${team.name}"?`)) return;
    this.teamService.delete(team.id).subscribe({
      next: () => { this.snackBar.open('Equipe excluída', 'OK', { duration: 3000 }); this.loadTeams(); },
      error: (err) => this.snackBar.open(err.error?.message || 'Erro ao excluir', 'Fechar', { duration: 4000 })
    });
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = { ACTIVE: 'Ativa', INACTIVE: 'Inativa', ARCHIVED: 'Arquivada' };
    return map[status] || status;
  }
}
