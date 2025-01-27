import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'http://localhost:8000/administrador';  // Cambia esto por tu URL de backend

  constructor(private http: HttpClient) { }

  updateClubVerification(clubId: string, verificado: boolean): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/club/verify`, { clubId, verificado });
  }
}
