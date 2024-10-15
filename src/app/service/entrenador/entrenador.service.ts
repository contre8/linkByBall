import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntrenadorService {

  private baseUrl = 'http://localhost:8000';  // Cambia esto por tu URL de backend

  constructor(private http: HttpClient) { }

  // Obtener el perfil del entrenador
  getEntrenadorProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/entrenador/perfil`);
  }

  getEntrenadorById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/entrenador/perfil/${id}`);
  }

  // Actualizar el perfil del entrenador
  updateEntrenadorProfile(entrenadorData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/entrenador/actualizar`, entrenadorData);
  }

  deleteEntrenadorProfile(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/entrenador/perfil`);
  }

  addFavorite(futbolistaId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/entrenador/favoritos`, { favoriteId: futbolistaId });
  }
}
