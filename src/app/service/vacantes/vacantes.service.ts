import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VacantesService {

  private baseUrl = `${environment.apiUrl}/vacantes`; // Cambia esto por la URL de tu backend

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

  getVacanteById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/vacante/${id}`);
  }

  getVacantesSimilares(posiciones: string[]): Observable<any> {
    let params = new HttpParams();
    params = params.append('posiciones', posiciones.join(',')); // Añadir posiciones como query params
    return this.http.get<any>(`${this.baseUrl}/vacantes-similares`, { params });  }
}
