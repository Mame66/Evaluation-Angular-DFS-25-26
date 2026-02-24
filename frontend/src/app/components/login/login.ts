import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UtilisateurService } from '../../services/utilisateur.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {

  private userService = inject(UtilisateurService);
  private router = inject(Router);

  email = '';
  password = '';
  erreur = '';

  login() {
    if (!this.email || !this.password) {
      this.erreur = "Tous les champs sont obligatoires";
      return;
    }

    this.userService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/sessions']),
      error: () => this.erreur = "Identifiants incorrects"
    });
  }
}
