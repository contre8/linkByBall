import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private baseUrl = `${environment.apiUrl}/search`; // Cambia esto por la URL de tu backend

  constructor(private http: HttpClient) { }

  searchProfiles(query: string, type: string): Observable<any> {
    const params = new HttpParams().set('query', query).set('type', type);
    return this.http.get(`${this.baseUrl}/search-fut-ent-club`, { params });
  }

  buscarPerfiles(tipo: string, filtros: any) {
    return this.http.post(`${this.baseUrl}/buscar/${tipo}`, filtros);
  }

  applyFilters(profileType: string, filtros: any, page: number = 1, limit: number = 10): Observable<any> {
    const body = { profileType, filtros, page, limit };  // Incluye los parámetros de paginación en el body
    return this.http.post(`${this.baseUrl}/apply-filters`, body);
  }

}
