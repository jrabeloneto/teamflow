import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule, MatSnackBarModule
  ],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-brand">
          <div class="brand-icon">TF</div>
          <h1>TeamFlow</h1>
        </div>
        <h2>Criar conta</h2>
        <p class="subtitle">Preencha os dados para começar</p>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nome completo</mat-label>
            <input matInput formControlName="name">
            <mat-icon matPrefix>person</mat-icon>
            <mat-error *ngIf="form.get('name')?.hasError('required')">Nome obrigatório</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>E-mail</mat-label>
            <input matInput type="email" formControlName="email">
            <mat-icon matPrefix>email</mat-icon>
            <mat-error *ngIf="form.get('email')?.hasError('required')">E-mail obrigatório</mat-error>
            <mat-error *ngIf="form.get('email')?.hasError('email')">E-mail inválido</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Senha</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
            <mat-icon matPrefix>lock</mat-icon>
            <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
              <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="form.get('password')?.hasError('required')">Senha obrigatória</mat-error>
            <mat-error *ngIf="form.get('password')?.hasError('minlength')">Mínimo 6 caracteres</mat-error>
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" class="submit-btn" [disabled]="loading">
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            <span *ngIf="!loading">Criar conta</span>
          </button>
        </form>
        <p class="login-link">Já tem conta? <a routerLink="/auth/login">Entrar</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f8fafc; padding: 24px; }
    .auth-card { width: 100%; max-width: 420px; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .auth-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
    .brand-icon { width: 44px; height: 44px; background: #3b82f6; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px; color: white; }
    .auth-brand h1 { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0; }
    .auth-card h2 { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
    .subtitle { color: #64748b; margin-bottom: 28px; }
    .full-width { width: 100%; margin-bottom: 8px; }
    .submit-btn { width: 100%; height: 48px; font-size: 16px; font-weight: 600; }
    .login-link { text-align: center; margin-top: 20px; color: #64748b; font-size: 14px; }
    .login-link a { color: #3b82f6; text-decoration: none; font-weight: 600; }
  `]
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.authService.register(this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.message || 'Erro ao criar conta', 'Fechar', { duration: 4000 });
      }
    });
  }
}
