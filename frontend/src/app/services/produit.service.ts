import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Produit } from '../models/produit.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  private http = inject(HttpClient);
  private api = 'http://localhost:3000/produits';

  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.api);
  }
}
