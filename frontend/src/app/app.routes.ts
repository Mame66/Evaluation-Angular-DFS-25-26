import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { SessionListComponent } from './components/session-list/session-list';
import { GameComponent } from './components/game/game';
import { authGuard, adminGuard } from './guards/auth.guard';
import {CreateSessionComponent} from './components/create-session/create-session';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'sessions', component: SessionListComponent, canActivate: [authGuard] },
  { path: 'game/:id', component: GameComponent, canActivate: [authGuard] },
  { path: 'create-session', component: CreateSessionComponent, canActivate: [adminGuard] }
];
