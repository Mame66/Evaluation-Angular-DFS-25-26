import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UtilisateurService } from '../services/utilisateur.service';

export const authGuard: CanActivateFn = () => {

  const userService = inject(UtilisateurService);
  const router = inject(Router);

  if (userService.estConnecte()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
export const adminGuard: CanActivateFn = () => {

  const userService = inject(UtilisateurService);
  const router = inject(Router);

  if (userService.estAdmin()) {
    return true;
  }

  router.navigate(['/sessions']);
  return false;
};
