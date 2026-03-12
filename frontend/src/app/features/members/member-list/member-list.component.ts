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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MemberService } from '../../../core/services/member.service';
import { Member } from '../../../core/models/member.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule,
    MatSelectModule, MatProgressSpinnerModule, MatSnackBarModule, MatPaginatorModule, MatTableModule
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Membros</h1>
          <p>Gerencie todos os membros da organização</p>
        </div>
        <a mat-raised-button color="primary" routerLink="/members/new">
          <mat-icon>person_add</mat-icon> Novo Membro
        </a>
      </div>

      <div class="filters-bar">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar membros</mat-label>
          <input matInput [(ngModel)]="searchTerm" (ngModelChange)="onSearch($event)" placeholder="Nome, e-mail ou cargo...">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Status</mat-label>
          <mat-select [(ngModel)]="statusFilter" (ngModelChange)="loadMembers()">
            <mat-option value="">Todos</mat-option>
            <mat-option value="ACTIVE">Ativo</mat-option>
            <mat-option value="INACTIVE">Inativo</mat-option>
            <mat-option value="ON_LEAVE">Em Férias</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div *ngIf="loading" class="loading-state">
        <mat-spinner diameter="48"></mat-spinner>
      </div>

      <div *ngIf="!loading" class="table-card">
        <table mat-table [dataSource]="members" class="members-table">
          <ng-container matColumnDef="member">
            <th mat-header-cell *matHeaderCellDef>Membro</th>
            <td mat-cell *matCellDef="let m">
              <div class="member-cell">
                <div class="avatar">{{ m.name[0] }}</div>
                <div>
                  <div class="member-name">{{ m.name }}</div>
                  <div class="member-email">{{ m.email }}</div>
                </div>
              </div>
            </td>
          </ng-container>
          <ng-container matColumnDef="position">
            <th mat-header-cell *matHeaderCellDef>Cargo</th>
            <td mat-cell *matCellDef="let m">{{ m.position || '-' }}</td>
          </ng-container>
          <ng-container matColumnDef="team">
            <th mat-header-cell *matHeaderCellDef>Equipe</th>
            <td mat-cell *matCellDef="let m">
              <span class="team-chip" *ngIf="m.teamName">{{ m.teamName }}</span>
              <span class="no-team" *ngIf="!m.teamName">Sem equipe</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let m">
              <span class="badge" [class]="'badge-' + m.status.toLowerCase()">{{ getStatusLabel(m.status) }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="joinDate">
            <th mat-header-cell *matHeaderCellDef>Ingresso</th>
            <td mat-cell *matCellDef="let m">{{ m.joinDate ? (m.joinDate | date:'dd/MM/yyyy') : '-' }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let m">
              <a mat-icon-button [routerLink]="['/members', m.id, 'edit']" matTooltip="Editar">
                <mat-icon>edit</mat-icon>
              </a>
              <button mat-icon-button color="warn" (click)="deleteMember(m)" matTooltip="Excluir">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <div *ngIf="members.length === 0" class="empty-state">
          <mat-icon>person</mat-icon>
          <h3>Nenhum membro encontrado</h3>
          <a mat-raised-button color="primary" routerLink="/members/new">Adicionar Membro</a>
        </div>
      </div>

      <mat-paginator
        *ngIf="totalElements > 0"
        [length]="totalElements"
        [pageSize]="pageSize"
        [pageIndex]="pageIndex"
        [pageSizeOptions]="[10, 25, 50]"
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
    .table-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.06); }
    .members-table { width: 100%; }
    .member-cell { display: flex; align-items: center; gap: 12px; padding: 8px 0; }
    .avatar { width: 40px; height: 40px; background: #10b981; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
    .member-name { font-size: 14px; font-weight: 600; color: #1e293b; }
    .member-email { font-size: 12px; color: #94a3b8; }
    .team-chip { background: #eff6ff; color: #3b82f6; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .no-team { color: #94a3b8; font-size: 13px; }
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .badge-active { background: #ecfdf5; color: #059669; }
    .badge-inactive { background: #fef2f2; color: #dc2626; }
    .badge-on_leave { background: #fffbeb; color: #d97706; }
    .empty-state { text-align: center; padding: 60px; color: #94a3b8; }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 12px; }
    .empty-state h3 { color: #374151; margin-bottom: 16px; }
    th.mat-header-cell { font-weight: 700; color: #374151; font-size: 13px; }
    td.mat-cell { font-size: 14px; color: #374151; }
  `]
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  loading = true;
  searchTerm = '';
  statusFilter = '';
  pageIndex = 0;
  pageSize = 10;
  totalElements = 0;
  displayedColumns = ['member', 'position', 'team', 'status', 'joinDate', 'actions'];
  private searchSubject = new Subject<string>();

  constructor(private memberService: MemberService, private snackBar: MatSnackBar) {
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe(() => {
      this.pageIndex = 0;
      this.loadMembers();
    });
  }

  ngOnInit(): void { this.loadMembers(); }

  loadMembers(): void {
    this.loading = true;
    this.memberService.getAll(this.pageIndex, this.pageSize, this.searchTerm || undefined, this.statusFilter || undefined).subscribe({
      next: (page) => {
        this.members = page.content;
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
    this.loadMembers();
  }

  deleteMember(member: Member): void {
    if (!confirm(`Excluir o membro "${member.name}"?`)) return;
    this.memberService.delete(member.id).subscribe({
      next: () => { this.snackBar.open('Membro excluído', 'OK', { duration: 3000 }); this.loadMembers(); },
      error: (err) => this.snackBar.open(err.error?.message || 'Erro ao excluir', 'Fechar', { duration: 4000 })
    });
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = { ACTIVE: 'Ativo', INACTIVE: 'Inativo', ON_LEAVE: 'Férias', SUSPENDED: 'Suspenso' };
    return map[status] || status;
  }
}
