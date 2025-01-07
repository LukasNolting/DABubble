import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const localUserData = localStorage.getItem('userData');
  const localUserId = JSON.parse(localUserData || '{}');
  const userIdIsValid = await authService.checkUserId(localUserId.userId);

  if (authService.isAuthenticated() && userIdIsValid) {
    if (state.url === '/') {
      router.navigateByUrl('/board'); // Weiterleitung zur Board-Seite
      return false; // Zugriff auf "/" verweigern
    }
    return true; // Zugriff erlauben
  }

  // Benutzer ist nicht eingeloggt
  router.navigate(['/']);
  return false;
}
