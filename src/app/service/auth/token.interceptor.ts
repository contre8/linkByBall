import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let token = '';
    // Verificar si estamos en un entorno de navegador
    if (typeof window !== 'undefined' && localStorage) {
      token = localStorage.getItem('token') || ''; // Recupera el token si está disponible
    }

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned); // Pasa la solicitud con el token
    } else {
      return next.handle(req); // Si no hay token, pasa la solicitud sin modificarla
    }
  }
}
