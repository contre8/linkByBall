import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FutbolistaService {

  private baseUrl = `${environment.apiUrl}`;  // Cambia esto por tu URL de backend

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
