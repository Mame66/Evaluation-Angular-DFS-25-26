import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { UtilisateurService } from '../../services/utilisateur.service';

@Component({
  selector: 'app-create-session',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-session.html'
})
export class CreateSessionComponent {

  private sessionService = inject(SessionService);
  private userService = inject(UtilisateurService);
  private router = inject(Router);

  nom = '';
  erreur = '';

  create() {
    if (!this.nom.trim()) {
      this.erreur = "Nom obligatoire";
      return;
    }

    const user = this.userService.utilisateurConnecte();
    if (!user) return;

    this.sessionService.createSession(this.nom, user.email)
      .subscribe(() => this.router.navigate(['/sessions']));
  }
}
