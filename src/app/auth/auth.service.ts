import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/auth'; // URL base de tu API

  constructor(private http: HttpClient) { }

  // Método para iniciar sesión de futbolista
  loginFutbolista(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/futbolista/login`, { email, password });
  }

  // Método para iniciar sesión de entrenador
  loginEntrenador(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/entrenador/login`, { email, password });
  }

  // Método para iniciar sesión de club
  loginClub(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/club/login`, { email, password });
  }

  // Método para iniciar sesión de administrador
  loginAdministrador(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/administrador/login`, { email, password });
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
}
