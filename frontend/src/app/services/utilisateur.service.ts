import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utilisateur } from '../models/utilisateur.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private http = inject(HttpClient);
  private api = 'http://localhost:3000/utilisateurs';

  utilisateurConnecte = signal<Utilisateur | null>(null);

  login(email: string, password: string) {
    return this.http.post<Utilisateur>(`${this.api}/login`, { email, password })
      .pipe(
        tap(user => this.utilisateurConnecte.set(user))
      );
  }

  logout() {
    this.utilisateurConnecte.set(null);
  }

  estConnecte(): boolean {
    return this.utilisateurConnecte() !== null;
  }

  estAdmin(): boolean {
    return this.utilisateurConnecte()?.admin ?? false;
  }
}
