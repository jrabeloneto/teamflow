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
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule, MatSnackBarModule
  ],
  template: `
    <div class="auth-container">
      <div class="auth-left">
        <div class="auth-brand">
          <div class="brand-icon">TF</div>
          <h1>TeamFlow</h1>
        </div>
        <h2>Gerencie suas equipes com eficiência</h2>
        <p>Plataforma completa para gestão de equipes, membros e projetos em um só lugar.</p>
        <div class="features">
          <div class="feature-item">
            <mat-icon>groups</mat-icon>
            <span>Gestão de equipes</span>
          </div>
          <div class="feature-item">
            <mat-icon>person</mat-icon>
            <span>Controle de membros</span>
          </div>
          <div class="feature-item">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard em tempo real</span>
          </div>
        </div>
      </div>
      <div class="auth-right">
        <div class="auth-card">
          <h2>Bem-vindo de volta</h2>
          <p class="subtitle">Acesse sua conta para continuar</p>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>E-mail</mat-label>
              <input matInput type="email" formControlName="email" placeholder="seu@email.com">
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
            </mat-form-field>
            <div class="demo-hint">
              <mat-icon>info</mat-icon>
              <span>Demo: <strong>admin&#64;teamflow.com</strong> / <strong>admin123</strong></span>
            </div>
            <button mat-raised-button color="primary" type="submit" class="submit-btn" [disabled]="loading">
              <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
              <span *ngIf="!loading">Entrar</span>
            </button>
          </form>
          <p class="register-link">
            Não tem conta? <a routerLink="/auth/register">Criar conta</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; min-height: 100vh; }
    .auth-left {
      flex: 1; background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
      color: white; padding: 60px; display: flex; flex-direction: column; justify-content: center;
    }
    .auth-brand { display: flex; align-items: center; gap: 16px; margin-bottom: 48px; }
    .brand-icon {
      width: 52px; height: 52px; background: #3b82f6; border-radius: 14px;
      display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px;
    }
    .auth-brand h1 { font-size: 28px; font-weight: 800; margin: 0; }
    .auth-left h2 { font-size: 32px; font-weight: 700; margin-bottom: 16px; line-height: 1.3; }
    .auth-left p { color: rgba(255,255,255,0.7); font-size: 16px; margin-bottom: 40px; }
    .features { display: flex; flex-direction: column; gap: 16px; }
    .feature-item { display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.85); }
    .feature-item mat-icon { color: #3b82f6; }
    .auth-right {
      width: 480px; display: flex; align-items: center; justify-content: center;
      background: #f8fafc; padding: 40px;
    }
    .auth-card { width: 100%; max-width: 400px; }
    .auth-card h2 { font-size: 26px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
    .subtitle { color: #64748b; margin-bottom: 32px; }
    .full-width { width: 100%; margin-bottom: 8px; }
    .demo-hint {
      display: flex; align-items: center; gap: 8px; background: #eff6ff;
      border: 1px solid #bfdbfe; border-radius: 8px; padding: 10px 14px;
      font-size: 13px; color: #1d4ed8; margin-bottom: 20px;
    }
    .demo-hint mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .submit-btn { width: 100%; height: 48px; font-size: 16px; font-weight: 600; }
    .register-link { text-align: center; margin-top: 20px; color: #64748b; font-size: 14px; }
    .register-link a { color: #3b82f6; text-decoration: none; font-weight: 600; }
    @media (max-width: 768px) {
      .auth-left { display: none; }
      .auth-right { width: 100%; padding: 24px; }
    }
  `]
})
export class LoginComponent {
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
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.authService.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.message || 'Credenciais inválidas', 'Fechar', { duration: 4000 });
      }
    });
  }
}
