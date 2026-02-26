import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/session.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  sessionId = signal(0);
  sessionData = signal<any>(null);
  loading = signal(true);
  currentIndex = signal(0);
  answered = signal(false);
  submitting = signal(false);
  submitError = signal('');
  lastResult = signal<any>(null);

  form = this.fb.group({
    prix: ['', [Validators.required, Validators.min(0)]]
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public auth: AuthService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!);
    this.sessionId.set(id);
    this.loadSession(id);
  }

  loadSession(id: number) {
    this.sessionService.getSession(id).subscribe({
      next: (data) => {
        this.sessionData.set(data);
        this.currentIndex.set(data.prochainIndex);
        if (data.prochainIndex >= data.produits.length) {
          this.router.navigate(['/sessions', id, 'classement']);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/sessions']);
      }
    });
  }

  currentProduct() {
    return this.sessionData()?.produits?.[this.currentIndex()];
  }

  totalQuestions() { return this.sessionData()?.produits?.length || 4; }
  progressPercent() { return (this.currentIndex() / this.totalQuestions()) * 100; }
  isLastQuestion() { return this.currentIndex() === this.totalQuestions() - 1; }

  onSubmit() {
    if (this.form.invalid) return;
    const prix = parseFloat(this.form.value.prix as string);
    this.submitting.set(true);
    this.submitError.set('');

    this.sessionService.repondre(this.sessionId(), prix).subscribe({
      next: (result) => {
        this.lastResult.set({ ...result, yourAnswer: prix });
        this.answered.set(true);
        this.submitting.set(false);
      },
      error: (err) => {
        this.submitError.set(err.error?.message || "Erreur lors de l'envoi");
        this.submitting.set(false);
      }
    });
  }

  nextQuestion() {
    this.currentIndex.update(i => i + 1);
    this.answered.set(false);
    this.lastResult.set(null);
    this.form.reset();
  }
}
