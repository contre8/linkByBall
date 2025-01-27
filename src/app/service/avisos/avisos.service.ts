import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AvisosService {
  private baseUrl = `${environment.apiUrl}`;  // Cambia esto por la URL de tu backend

  constructor(private http: HttpClient) {}

  getAvisos(usuarioId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/avisos?usuarioId=${usuarioId}`);
  }

  marcarAvisoComoVisto(avisoId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/avisos/${avisoId}/visto`, {});
  }
}
