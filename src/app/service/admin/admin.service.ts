import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = `${environment.apiUrl}/administrador`;  // Cambia esto por tu URL de backend

  constructor(private http: HttpClient) { }

  updateClubVerification(clubId: string, verificado: boolean): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/club/verify`, { clubId, verificado });
  }
}
