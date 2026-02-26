import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:3000';

  private _token = signal<string | null>(localStorage.getItem('token'));
  private _user = signal<{ email: string; admin: boolean } | null>(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  token = this._token.asReadonly();
  user = this._user.asReadonly();
  isLoggedIn = computed(() => !!this._token());
  isAdmin = computed(() => this._user()?.admin === true);

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<{ token: string; user: any }>(`${this.API}/auth/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this._token.set(res.token);
        this._user.set(res.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/login']);
  }
}
