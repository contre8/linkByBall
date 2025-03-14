import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatSocketService {
  private socket: Socket;
  private readonly SOCKET_URL = `${environment.apiUrl}`; // Cambia esto según tu configuración

  constructor() {
    this.socket = io(this.SOCKET_URL);
  }

  // Unirse a una conversación específica
  unirseConversacion(conversacionId: string): void {
    this.socket.emit('unirseConversacion', conversacionId);
  }

  // Enviar mensaje al servidor para retransmitirlo
  enviarMensaje(mensaje: any, conversacionId: any): void {
    this.socket.emit('enviarMensaje', mensaje, conversacionId);
  }

  // Escuchar mensajes nuevos de una conversación
  escucharMensajes(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('nuevoMensaje', (mensaje) => {
        observer.next(mensaje);
      });
    });
  }
}
