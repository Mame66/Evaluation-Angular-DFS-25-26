import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly API = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getSessions() {
    return this.http.get<any[]>(`${this.API}/sessions`);
  }

  getSession(id: number) {
    return this.http.get<any>(`${this.API}/sessions/${id}`);
  }

  createSession(nom: string) {
    return this.http.post<any>(`${this.API}/sessions`, { nom });
  }

  rejoindreSession(id: number) {
    return this.http.post<any>(`${this.API}/sessions/${id}/rejoindre`, {});
  }

  repondre(id: number, prix: number) {
    return this.http.post<any>(`${this.API}/sessions/${id}/repondre`, { prix });
  }

  getClassement(id: number) {
    return this.http.get<any[]>(`${this.API}/sessions/${id}/classement`);
  }
}
