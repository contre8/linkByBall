import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  private baseUrl = 'http://localhost:5000';  // Cambia esto por tu URL de backend

  constructor(private http: HttpClient) { }

  // Obtener el perfil del club
  getClubProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/club/perfil`);
  }

  // Actualizar el perfil del club
  updateClubProfile(clubData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/club/actualizar`, clubData);
  }

  deleteClubProfile(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/club/perfil`);
  }
}
