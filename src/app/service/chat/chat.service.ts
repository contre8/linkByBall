import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'http://localhost:8000/chat'; // Cambia la URL según tu configuración

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
  obtenerMensajes(conversacionId: string, page: number = 1, limit: number = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/mensajes/${conversacionId}?page=${page}&limit=${limit}`);
  }

  // Marcar mensaje como visto
  marcarMensajeComoVisto(mensajeId: string, tipoUsuario: string, usuarioId: string): Observable<any> {
    const payload = { tipoUsuario, usuarioId };
    return this.http.put(`${this.apiUrl}/mensaje/${mensajeId}/visto`, payload);
  }
}
