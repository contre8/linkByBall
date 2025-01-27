import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  private baseUrl = `${environment.apiUrl}`;  // Cambia esto por tu URL de backend

  constructor(private http: HttpClient) { }

  // Obtener el perfil del club
  getClubProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/club/perfil`);
  }

  // Obtener un club por ID
  getClubById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/club/perfil/${id}`);
  }

  // Actualizar el perfil del club
  updateClubProfile(clubData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/club/actualizar`, clubData);
  }

  deleteClubProfile(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/club/perfil`);
  }

  createVacante(vacanteData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/vacantes`, vacanteData); // Ajusta la ruta de tu backend
  }

  getVacantesByClub(clubId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/vacantes/${clubId}`);
  }

  getVacanteById(Id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/vacantes/vacante/${Id}`);
  }

  // Método para eliminar una vacante
  deleteVacante(Id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/vacantes/${Id}`);
  }

  // Método para modificar una vacante existente
  updateVacante(vacanteId: string, vacanteData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/vacantes/${vacanteId}`, vacanteData);
  }

  addFavorite(futbolistaId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/club/favoritos`, { favoriteId: futbolistaId });
  }

  // Método para eliminar un entrenador de favoritos
  removeFavorite(favoriteId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/club/favoritos/${favoriteId}`);
  }

  // Método para verificar si el entrenador está marcado como favorito
  isFavorite(favoriteId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/club/favoritos/${favoriteId}`);
  }

  getFavorites(clubId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/club/club-favoritos/${clubId}`);
  }

  getPlantillaByClub(clubId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/club/${clubId}/plantilla`);
  }

  // Método para obtener todos los clubes no verificados
  getUnverifiedClubs(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/club/no-verificados`);
  }

  getVerifiedClubs(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/club/all`);
  }

  // Método para obtener todos los clubes (verificados y no verificados)
  getAllGeneralClubs(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/club/todos`);
  }

}
