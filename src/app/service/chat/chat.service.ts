import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = `${environment.apiUrl}/chat`; // URL base de tu API

  constructor(private http: HttpClient) { }

  // Crear una nueva conversación
  crearConversacion(conversacion: { nombre: string; participantes: { tipoUsuario: string; usuarioId: any; }[] }): Observable<any> {
    return this.http.post(`${this.apiUrl}/conversacion`, { conversacion });
  }

  // Obtener las conversaciones de un usuario
  obtenerConversaciones(usuarioId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/conversaciones/${usuarioId}`);
  }

  // Enviar un mensaje
  enviarMensaje(conversacionId: string, remitente: any, texto: string, tipoContenido: string = 'texto', archivoUrl?: string): Observable<any> {
    const payload = { conversacionId, remitente, texto, tipoContenido, archivoUrl };
    return this.http.post(`${this.apiUrl}/mensaje`, payload);
  }

  // Obtener mensajes de una conversación específica
  obtenerMensajes(conversacionId: string, page: number = 1, limit: number = 50): Observable<any> {
    return this.http.get(`${this.apiUrl}/mensajes/${conversacionId}?page=${page}&limit=${limit}`);
  }

  // Marcar mensaje como visto
  marcarMensajeComoVisto(mensajeId: string, tipoUsuario: string, usuarioId: string): Observable<any> {
    const payload = { tipoUsuario, usuarioId };
    return this.http.put(`${this.apiUrl}/mensaje/${mensajeId}/visto`, payload);
  }
}
