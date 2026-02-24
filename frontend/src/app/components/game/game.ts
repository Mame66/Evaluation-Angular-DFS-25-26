import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../services/session.service';
import { ProduitService } from '../../services/produit.service';
import { UtilisateurService } from '../../services/utilisateur.service';
import { Produit } from '../../models/produit.model';
import { Session } from '../../models/session.model';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game.html'
})
export class GameComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private sessionService = inject(SessionService);
  private produitService = inject(ProduitService);
  private userService = inject(UtilisateurService);

  sessionId!: number;
  session!: Session;

  produitsSession = signal<Produit[]>([]);
  indexProduit = signal(0);

  prixPropose = 0;
  prixReel = signal<number | null>(null);
  points = signal<number | null>(null);

  termine = signal(false);

  ngOnInit() {
    this.sessionId = Number(this.route.snapshot.paramMap.get('id'));

    this.sessionService.getSessions().subscribe(sessions => {
      this.session = sessions[this.sessionId];

      this.produitService.getProduits().subscribe(allProduits => {
        const selection = allProduits.filter(p =>
          this.session.produits.includes(p.id)
        );
        this.produitsSession.set(selection);
      });
    });
  }

  envoyer() {
    const produit = this.produitsSession()[this.indexProduit()];
    const difference = Math.abs(produit.prix - this.prixPropose);
    const score = Math.max(100 - difference, 0);

    this.prixReel.set(produit.prix);
    this.points.set(Math.round(score));

    this.sessionService.envoyerReponse(
      this.sessionId,
      this.userService.utilisateurConnecte()?.email || '',
      this.prixPropose
    ).subscribe();
  }

  suivant() {
    this.prixReel.set(null);
    this.points.set(null);
    this.prixPropose = 0;

    if (this.indexProduit() + 1 < this.produitsSession().length) {
      this.indexProduit.update(v => v + 1);
    } else {
      this.termine.set(true);
    }
  }

  totalPoints(): number {
    const participant = this.session.participants.find(
      p => p.utilisateur === this.userService.utilisateurConnecte()?.email
    );

    if (!participant) return 0;

    return participant.reponses.reduce((acc, r, i) => {
      const produit = this.produitsSession()[i];
      const diff = Math.abs(produit.prix - r);
      return acc + Math.max(100 - diff, 0);
    }, 0);
  }
}
