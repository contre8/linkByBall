import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthNavigationService {
  constructor(private router: Router) {}

  navigateToRegistration(type: string) {
    switch (type) {
      case 'futbolista':
        this.router.navigate(['/auth/register/futbolista']);
        break;
      case 'entrenador':
        this.router.navigate(['/auth/register/entrenador']);
        break;
      case 'club':
        this.router.navigate(['/auth/register/club']);
        break;
      default:
        this.router.navigate(['/auth/register/futbolista']);
        break;
    }
  }
}
