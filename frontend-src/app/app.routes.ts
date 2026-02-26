import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'sessions', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'sessions',
    canActivate: [authGuard],
    loadComponent: () => import('./components/sessions/sessions.component').then(m => m.SessionsComponent)
  },
  {
    path: 'sessions/create',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./components/create-session/create-session.component').then(m => m.CreateSessionComponent)
  },
  {
    path: 'sessions/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./components/game/game.component').then(m => m.GameComponent)
  },
  {
    path: 'sessions/:id/classement',
    canActivate: [authGuard],
    loadComponent: () => import('./components/classement/classement.component').then(m => m.ClassementComponent)
  },
  { path: '**', redirectTo: 'sessions' }
];
