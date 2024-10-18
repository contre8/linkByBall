import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private baseUrl = 'http://localhost:8000/solicitud'; // Cambia la URL según tu configuración

  constructor(private http: HttpClient) {}

  // Método para crear una nueva solicitud
  createSolicitud(solicitudData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/crear`, solicitudData);
  }

  // Método para obtener todas las solicitudes
  getSolicitudes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/`);
  }

  // Método para obtener una solicitud por ID
  getSolicitudById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Método para cambiar el estado de una solicitud por ID
  cambiarEstadoSolicitud(id: string, estado: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/estado`, { estado });
  }

  // Método para eliminar una solicitud por ID
  deleteSolicitud(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getSolicitudesByUser(userId: string, userType: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userType}/${userId}`);
  }

  getSolicitudesByVacante(vacanteId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/vacante/${vacanteId}`);
  }
}

