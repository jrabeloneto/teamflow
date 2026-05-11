import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

// Demo credentials — backend offline, this is a portfolio mock.
const DEMO_USERS: Array<{ email: string; password: string; name: string; role: string }> = [
  { email: 'admin@teamflow.com', password: 'admin123', name: 'Admin User', role: 'ADMIN' }
];

function fakeJwt(email: string): string {
  // Not a real JWT — just an opaque token that satisfies the storage contract.
  const payload = btoa(JSON.stringify({ sub: email, iat: Date.now() }));
  return `mock.${payload}.signature`;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'teamflow_token';
  private readonly USER_KEY = 'teamflow_user';
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    const user = DEMO_USERS.find(
      u => u.email.toLowerCase() === request.email.trim().toLowerCase() && u.password === request.password
    );
    if (!user) {
      return throwError(() => ({ status: 401, error: { message: 'Credenciais inválidas' } })).pipe(delay(300));
    }
    const response: AuthResponse = {
      token: fakeJwt(user.email),
      name: user.name,
      email: user.email,
      role: user.role
    };
    this.storeAuth(response);
    return of(response).pipe(delay(300));
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    const response: AuthResponse = {
      token: fakeJwt(request.email),
      name: request.name,
      email: request.email,
      role: request.role ?? 'USER'
    };
    this.storeAuth(response);
    return of(response).pipe(delay(300));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  private storeAuth(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response));
    this.currentUserSubject.next(response);
  }

  private getStoredUser(): AuthResponse | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}
