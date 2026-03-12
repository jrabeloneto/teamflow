import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    canActivate: [publicGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'teams',
        loadComponent: () =>
          import('./features/teams/team-list/team-list.component').then(m => m.TeamListComponent)
      },
      {
        path: 'teams/new',
        loadComponent: () =>
          import('./features/teams/team-form/team-form.component').then(m => m.TeamFormComponent)
      },
      {
        path: 'teams/:id/edit',
        loadComponent: () =>
          import('./features/teams/team-form/team-form.component').then(m => m.TeamFormComponent)
      },
      {
        path: 'members',
        loadComponent: () =>
          import('./features/members/member-list/member-list.component').then(m => m.MemberListComponent)
      },
      {
        path: 'members/new',
        loadComponent: () =>
          import('./features/members/member-form/member-form.component').then(m => m.MemberFormComponent)
      },
      {
        path: 'members/:id/edit',
        loadComponent: () =>
          import('./features/members/member-form/member-form.component').then(m => m.MemberFormComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
