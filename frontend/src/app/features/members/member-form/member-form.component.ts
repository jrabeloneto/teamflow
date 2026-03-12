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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MemberService } from '../../../core/services/member.service';
import { TeamService } from '../../../core/services/team.service';
import { Team } from '../../../core/models/team.model';

@Component({
  selector: 'app-member-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule,
    MatDatepickerModule, MatNativeDateModule
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <button mat-icon-button routerLink="/members"><mat-icon>arrow_back</mat-icon></button>
        <div>
          <h1>{{ isEdit ? 'Editar Membro' : 'Novo Membro' }}</h1>
          <p>{{ isEdit ? 'Atualize as informações do membro' : 'Preencha os dados para adicionar um novo membro' }}</p>
        </div>
      </div>

      <div class="form-card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <h3 class="section-title">Informações Pessoais</h3>
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nome completo *</mat-label>
              <input matInput formControlName="name">
              <mat-error *ngIf="form.get('name')?.hasError('required')">Nome obrigatório</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>E-mail *</mat-label>
              <input matInput type="email" formControlName="email">
              <mat-error *ngIf="form.get('email')?.hasError('required')">E-mail obrigatório</mat-error>
              <mat-error *ngIf="form.get('email')?.hasError('email')">E-mail inválido</mat-error>
            </mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Telefone</mat-label>
              <input matInput formControlName="phone" placeholder="(00) 00000-0000">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Data de Ingresso</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="joinDate">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>
          </div>

          <h3 class="section-title">Informações Profissionais</h3>
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Cargo</mat-label>
              <input matInput formControlName="position" placeholder="Ex: Frontend Developer">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Departamento</mat-label>
              <input matInput formControlName="department" placeholder="Ex: Engenharia">
            </mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Equipe</mat-label>
              <mat-select formControlName="teamId">
                <mat-option [value]="null">Sem equipe</mat-option>
                <mat-option *ngFor="let team of teams" [value]="team.id">{{ team.name }}</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Status</mat-label>
              <mat-select formControlName="status">
                <mat-option value="ACTIVE">Ativo</mat-option>
                <mat-option value="INACTIVE">Inativo</mat-option>
                <mat-option value="ON_LEAVE">Em Férias</mat-option>
                <mat-option value="SUSPENDED">Suspenso</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="form-actions">
            <button mat-stroked-button type="button" routerLink="/members">Cancelar</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="saving">
              <mat-spinner *ngIf="saving" diameter="20"></mat-spinner>
              <span *ngIf="!saving">{{ isEdit ? 'Salvar Alterações' : 'Adicionar Membro' }}</span>
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
    .section-title { font-size: 14px; font-weight: 700; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 2px solid #eff6ff; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 8px; }
    .full-width { width: 100%; }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
    @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
  `]
})
export class MemberFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  saving = false;
  memberId?: number;
  teams: Team[] = [];

  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      position: [''],
      department: [''],
      teamId: [null],
      status: ['ACTIVE'],
      joinDate: [null]
    });
  }

  ngOnInit(): void {
    this.teamService.getAll(0, 100).subscribe(page => this.teams = page.content);
    this.memberId = this.route.snapshot.params['id'];
    this.isEdit = !!this.memberId;
    if (this.isEdit && this.memberId) {
      this.memberService.getById(this.memberId).subscribe(member => {
        this.form.patchValue({
          ...member,
          joinDate: member.joinDate ? new Date(member.joinDate) : null
        });
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const value = { ...this.form.value };
    if (value.joinDate) {
      const d = new Date(value.joinDate);
      value.joinDate = d.toISOString().split('T')[0];
    }

    const request$ = this.isEdit && this.memberId
      ? this.memberService.update(this.memberId, value)
      : this.memberService.create(value);

    request$.subscribe({
      next: () => {
        this.snackBar.open(this.isEdit ? 'Membro atualizado!' : 'Membro adicionado!', 'OK', { duration: 3000 });
        this.router.navigate(['/members']);
      },
      error: (err) => {
        this.saving = false;
        this.snackBar.open(err.error?.message || 'Erro ao salvar', 'Fechar', { duration: 4000 });
      }
    });
  }
}
