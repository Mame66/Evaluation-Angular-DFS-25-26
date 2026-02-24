import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { UtilisateurService } from '../../services/utilisateur.service';
import { Session } from '../../models/session.model';

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-list.html'
})
export class SessionListComponent implements OnInit {

  private sessionService = inject(SessionService);
  private userService = inject(UtilisateurService);
  private router = inject(Router);

  sessions = signal<Session[]>([]);

  ngOnInit() {
    this.sessionService.getSessions().subscribe(data => {
      this.sessions.set(data);
    });
  }

  rejoindre(index: number) {
    this.router.navigate(['/game', index]);
  }

  estAdmin() {
    return this.userService.estAdmin();
  }
}
