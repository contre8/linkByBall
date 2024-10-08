import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/auth'; // URL base de tu API
  private baseUrl2 = 'http://localhost:5000'; // URL base de tu API sin auth

  constructor(private http: HttpClient) { }

  // Método para iniciar sesión de futbolista
  loginFutbolista(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/futbolista/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);  // Guardar el token
          localStorage.setItem('userType', 'futbolista'); // Guardar el tipo de usuario como 'club'
        }
      })
    );
  }

  // Método para iniciar sesión de entrenador
  loginEntrenador(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/entrenador/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);  // Guardar el token
          localStorage.setItem('userType', 'entrenador'); // Guardar el tipo de usuario como 'club'
        }
      })
    );
  }

  // Método para iniciar sesión de club
  loginClub(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/club/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);  // Guardar el token
          localStorage.setItem('userType', 'club'); // Guardar el tipo de usuario como 'club'
        }
      })
    );
  }

  // Método para iniciar sesión de administrador
  loginAdministrador(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/administrador/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);  // Guardar el token
          localStorage.setItem('userType', 'admin'); // Guardar el tipo de usuario como 'club'
        }
      })
    );
  }

  // Métodos para el registro de cada tipo de usuario
  registerFutbolista(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/futbolista/register`, data);
  }

  registerEntrenador(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/entrenador/register`, data);
  }

  registerClub(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/club/register`, data);
  }

  registerAdministrador(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/administrador/register`, data);
  }

  // Método para cerrar sesión (opcional)
  logout(): void {
    localStorage.removeItem('token'); // Elimina el token del localStorage
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); // Verifica si el token está almacenado
  }

  getFutbolistaProfile(): Observable<any> {
    let token = '';
    if (typeof window !== 'undefined' && localStorage) {
      token = localStorage.getItem('token') || ''; // Obtener el token del localStorage solo si está en el navegador
    }
    const headers = new HttpHeaders({
      'x-auth-token': token
    });
    return this.http.get(`${this.baseUrl2}/futbolista/perfil`, { headers });
  }

  getEntrenadorProfile(): Observable<any> {
    let token = '';
    if (typeof window !== 'undefined' && localStorage) {
      token = localStorage.getItem('token') || ''; // Obtener el token del localStorage solo si está en el navegador
    }
    const headers = new HttpHeaders({
      'x-auth-token': token
    });
    return this.http.get(`${this.baseUrl2}/entrenador/perfil`, { headers });
  }

  //Métodos Clubs
  // En tu servicio Angular (AuthService u otro servicio dedicado)

  getClubs(): Observable<any> {
    return this.http.get(`${this.baseUrl2}/club/all`);
  }

  // Método para obtener la información de un club
  getClubProfile(): Observable<any> {
    let token = '';
    if (typeof window !== 'undefined' && localStorage) {
      token = localStorage.getItem('token') || ''; // Obtener el token del localStorage solo si está en el navegador
    }
    const headers = new HttpHeaders({
      'x-auth-token': token || ''
    });

    return this.http.get(`${this.baseUrl2}/club/perfil`, { headers });
  }

  getClub(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl2}/club/${id}`);
  }

  getClubCategory(clubId: string): Observable<any> {
    return this.http.get(`${this.baseUrl2}/club/perfil/${clubId}/category`);
  }
}
