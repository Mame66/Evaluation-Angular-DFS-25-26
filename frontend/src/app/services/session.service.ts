import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Session } from '../models/session.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private http = inject(HttpClient);
  private api = 'http://localhost:3000/sessions';

  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(this.api);
  }

  createSession(nom: string): Observable<Session> {
    return this.http.post<Session>(this.api, { nom });
  }

  envoyerReponse(sessionId: number, reponse: number) {
    return this.http.post(
      `${this.api}/${sessionId}/reponse`,
      { reponse }
    );
  }
}
