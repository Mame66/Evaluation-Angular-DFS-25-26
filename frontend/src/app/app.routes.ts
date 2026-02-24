import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { SessionListComponent } from './components/session-list/session-list';
import { GameComponent } from './components/game/game';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'sessions', component: SessionListComponent },
  { path: 'game/:id', component: GameComponent },
  { path: '**', redirectTo: '' }
];
