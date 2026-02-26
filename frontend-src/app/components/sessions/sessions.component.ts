import { Component, signal, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/session.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.css'
})
export class SessionsComponent implements OnInit {
  sessions = signal<any[]>([]);
  loading = signal(true);

  constructor(public auth: AuthService, private sessionService: SessionService, private router: Router) {}

  ngOnInit() {
    this.sessionService.getSessions().subscribe({
      next: (data) => { this.sessions.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  joinSession(id: number) {
    this.sessionService.rejoindreSession(id).subscribe({
      next: () => this.router.navigate(['/sessions', id]),
      error: () => this.router.navigate(['/sessions', id])
    });
  }
}
