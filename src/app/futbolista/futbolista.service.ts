import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FutbolistaService {

  private baseUrl = 'http://localhost:5000';  // Cambia esto por tu URL de backend

  constructor(private http: HttpClient) { }

  // Obtener el perfil del futbolista
  getFutbolistaProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/futbolista/perfil`);
  }

  // Obtener un futbolista por ID
  getFutbolistaById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/futbolista/perfil/${id}`);
  }

  // Actualizar el perfil del futbolista
  updateFutbolistaProfile(futbolistaData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/futbolista/actualizar`, futbolistaData);
  }

  // Eliminar el perfil del futbolista
  deleteFutbolistaProfile(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/futbolista/perfil`);
  }
}
