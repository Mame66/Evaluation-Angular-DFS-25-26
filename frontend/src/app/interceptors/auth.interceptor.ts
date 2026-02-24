import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UtilisateurService } from '../services/utilisateur.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const userService = inject(UtilisateurService);
  const user = userService.utilisateurConnecte();

  if (user) {
    const cloned = req.clone({
      setHeaders: {
        email: user.email
      }
    });

    return next(cloned);
  }

  return next(req);
};
