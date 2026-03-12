import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TeamService } from '../../../core/services/team.service';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <button mat-icon-button routerLink="/teams"><mat-icon>arrow_back</mat-icon></button>
        <div>
          <h1>{{ isEdit ? 'Editar Equipe' : 'Nova Equipe' }}</h1>
          <p>{{ isEdit ? 'Atualize as informações da equipe' : 'Preencha os dados para criar uma nova equipe' }}</p>
        </div>
      </div>

      <div class="form-card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nome da Equipe *</mat-label>
              <input matInput formControlName="name" placeholder="Ex: Frontend Squad">
              <mat-error *ngIf="form.get('name')?.hasError('required')">Nome obrigatório</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Departamento</mat-label>
              <input matInput formControlName="department" placeholder="Ex: Engenharia">
            </mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descrição</mat-label>
            <textarea matInput formControlName="description" rows="3" placeholder="Descreva o propósito da equipe..."></textarea>
          </mat-form-field>
          <mat-form-field appearance="outline" style="width: 240px">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="ACTIVE">Ativa</mat-option>
              <mat-option value="INACTIVE">Inativa</mat-option>
              <mat-option value="ARCHIVED">Arquivada</mat-option>
            </mat-select>
          </mat-form-field>
          <div class="form-actions">
            <button mat-stroked-button type="button" routerLink="/teams">Cancelar</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="saving">
              <mat-spinner *ngIf="saving" diameter="20"></mat-spinner>
              <span *ngIf="!saving">{{ isEdit ? 'Salvar Alterações' : 'Criar Equipe' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 800px; }
    .page-header { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
    .page-header h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin: 0 0 4px; }
    .page-header p { color: #64748b; margin: 0; font-size: 14px; }
    .form-card { background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 8px rgba(0,0,0,0.06); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .full-width { width: 100%; margin-bottom: 8px; }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 16px; }
    @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
  `]
})
export class TeamFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  saving = false;
  teamId?: number;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      department: [''],
      status: ['ACTIVE']
    });
  }

  ngOnInit(): void {
    this.teamId = this.route.snapshot.params['id'];
    this.isEdit = !!this.teamId;
    if (this.isEdit && this.teamId) {
      this.teamService.getById(this.teamId).subscribe(team => this.form.patchValue(team));
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const request$ = this.isEdit && this.teamId
      ? this.teamService.update(this.teamId, this.form.value)
      : this.teamService.create(this.form.value);

    request$.subscribe({
      next: () => {
        this.snackBar.open(this.isEdit ? 'Equipe atualizada!' : 'Equipe criada!', 'OK', { duration: 3000 });
        this.router.navigate(['/teams']);
      },
      error: (err) => {
        this.saving = false;
        this.snackBar.open(err.error?.message || 'Erro ao salvar', 'Fechar', { duration: 4000 });
      }
    });
  }
}
