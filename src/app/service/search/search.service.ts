import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private baseUrl = 'http://localhost:5000/search'; // Ajusta la URL si es necesario

  constructor(private http: HttpClient) {}

  searchProfiles(query: string, type: string): Observable<any> {
    const params = new HttpParams().set('query', query).set('type', type);
    return this.http.get(`${this.baseUrl}/search-fut-ent-club`, { params });
  }

  buscarPerfiles(tipo: string, filtros: any) {
    return this.http.post(`${this.baseUrl}/buscar/${tipo}`, filtros);
  }

  applyFilters(profileType: string, filtros: any): Observable<any> {
    const body = { profileType, filtros };
    return this.http.post(`${this.baseUrl}/apply-filters`, body);
  }
}
