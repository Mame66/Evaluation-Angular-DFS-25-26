import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/session.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-classement',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './classement.component.html',
  styleUrl: './classement.component.css'
})
export class ClassementComponent implements OnInit {
  classement = signal<any[]>([]);
  loading = signal(true);
  sessionId = signal(0);

  constructor(
    private route: ActivatedRoute,
    public auth: AuthService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!);
    this.sessionId.set(id);
    this.sessionService.getClassement(id).subscribe({
      next: (data) => { this.classement.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
