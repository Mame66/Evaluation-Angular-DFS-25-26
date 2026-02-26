import { Component, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-create-session',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './create-session.component.html',
  styleUrl: './create-session.component.css'
})
export class CreateSessionComponent {
  form = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(3)]]
  });
  loading = signal(false);
  errorMessage = signal('');

  constructor(private fb: FormBuilder, private sessionService: SessionService, private router: Router) {}

  onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorMessage.set('');
    this.sessionService.createSession(this.form.value.nom!).subscribe({
      next: () => this.router.navigate(['/sessions']),
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Erreur lors de la création');
        this.loading.set(false);
      }
    });
  }
}
