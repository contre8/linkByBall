import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private baseUrl = `${environment.apiUrl}`; // Ajusta la URL si es necesario

  constructor(private http: HttpClient) { }

  // Añadir favorito
  addFavorite(favoriteId: string, userType: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/favoritos`, { favoriteId, userType });
  }

  // Eliminar favorito
  removeFavorite(favoriteId: string, userType: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/favoritos/${favoriteId}/${userType}`);
  }

  // Obtener favoritos
  getFavorites(userId: string, userType: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/favoritos/${userId}/${userType}`);

  }

  // Verificar si un ítem es favorito
  isFavorite(favoriteId: string, userType: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/favoritos/isFavorite/${favoriteId}/${userType}`);
  }

}
