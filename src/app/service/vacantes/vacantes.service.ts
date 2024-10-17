import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VacantesService {

  private baseUrl = 'http://localhost:8000/vacantes';  // Cambia esto según tu URL del backend

  constructor(private http: HttpClient) { }

  // Servicio para filtrar las vacantes
  filtrarVacantes(filtros: any, page: number = 1, limit: number = 10, userType: string): Observable<any> {
    // Crear el objeto body con los filtros y la paginación
    const body = {
      filtros,
      page,
      limit,
      userType
    };

    // Hacer la solicitud POST con el body
    return this.http.post(`${this.baseUrl}/filtrar-vacantes`, body);
  }
}
