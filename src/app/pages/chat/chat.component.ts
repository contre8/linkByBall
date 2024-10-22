import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../service/chat/chat.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../service/auth/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ChatSocketService } from '../../service/chat-socket/chat-socket.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule, HttpClientModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})

export class ChatComponent implements OnInit {

  conversaciones: any[] = [];
  mensajes: any[] = [];
  userId: string = '';
  nuevoMensaje: string = '';
  conversacionActiva: any = null;

  constructor(private chatService: ChatService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private chatSocketService: ChatSocketService
  ) { }

  ngOnInit(): void {
    this.authService.getProfile().subscribe(
      (userData) => {
        this.userId = userData._id;

        // Verificar si hay un ID de conversación en la URL
        this.route.paramMap.subscribe(params => {
          const conversacionId = params.get('id');
          console.log(params)
          if (conversacionId) {
            this.cargarConversaciones();
            this.abrirConversacionPorId(conversacionId);
          } else {
            this.cargarConversaciones();
          }
        });
      },
      (error) => {
        console.error('Error al obtener el perfil del usuario', error);
      }
    );
    this.chatSocketService.escucharMensajes().subscribe(mensaje => {
      if (mensaje.conversacionId === this.conversacionActiva._id) {
        this.mensajes.push(mensaje);
      }
    });
  }


  // Cargar todas las conversaciones del usuario actual
  cargarConversaciones(): void {
    this.chatService.obtenerConversaciones(this.userId).subscribe({
      next: (response) => {
        // Procesar las conversaciones para obtener el nombre del otro participante
        this.conversaciones = response.conversaciones.map((conversacion: { participantes: any[]; nombre: any; }) => {
          const otroParticipante = conversacion.participantes.find((p) => p.usuarioId._id !== this.userId);
          if (otroParticipante && otroParticipante.usuarioId) {
            const nombre = otroParticipante.usuarioId.nombre;
            const apellido = otroParticipante.usuarioId.apellidos || ''; // Si no hay apellido, dejarlo vacío
            conversacion.nombre = apellido ? `${nombre} ${apellido}` : nombre;
          }
          return conversacion;
        });
      },
      error: (error) => {
        console.error('Error al obtener las conversaciones:', error);
      }
    });
  }


  seleccionarConversacion(conversacion: any): void {
    this.conversacionActiva = conversacion;
    this.router.navigate(['/chat', conversacion._id]); // Redirige a la URL con el ID de la conversación
    this.chatSocketService.unirseConversacion(conversacion._id);
    this.cargarMensajes(conversacion._id);
    console.log('Entraa')
  }

  abrirConversacionPorId(conversacionId: string): void {
    this.chatService.obtenerMensajes(conversacionId).subscribe({
      next: (response) => {
        this.conversacionActiva = { _id: conversacionId }; // Establecer como la conversación activa
        this.mensajes = response.mensajes;
        this.seleccionarConversacion(conversacionId);
        this.marcarMensajesComoVistos(); // Marcar mensajes como vistos si aplica
      },
      error: (error) => {
        console.error('Error al cargar la conversación:', error);
        this.cargarConversaciones(); // Cargar todas las conversaciones si no se pudo abrir la específica
      }
    });
  }

  // Cargar mensajes de la conversación seleccionada
  cargarMensajes(conversacionId: string): void {
    this.chatService.obtenerMensajes(conversacionId).subscribe({
      next: (response) => {
        this.mensajes = response.mensajes.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        this.marcarMensajesComoVistos();
      },
      error: (error) => {
        console.error('Error al obtener los mensajes:', error);
      }
    });
  }

  // Enviar un nuevo mensaje
  enviarMensaje(): void {
    if (this.nuevoMensaje.trim() === '' || !this.conversacionActiva) {
      return;
    }

    const remitente = {
      tipoUsuario: 'club', // Cambia según el tipo de usuario actual
      usuarioId: this.userId
    };

    this.chatService.enviarMensaje(this.conversacionActiva._id, remitente, this.nuevoMensaje).subscribe({
      next: (response) => {
        this.mensajes.push(response.mensaje);
        this.nuevoMensaje = '';
      },
      error: (error) => {
        console.error('Error al enviar el mensaje:', error);
      }
    });

    this.chatSocketService.enviarMensaje(this.nuevoMensaje);
  }

  // Marcar mensajes como vistos
  marcarMensajesComoVistos(): void {
    this.mensajes.forEach(mensaje => {
      if (!mensaje.vistoPor.some((v: { userId: string; }) => v.userId === this.userId)) {
        this.chatService.marcarMensajeComoVisto(mensaje._id, 'club', this.userId).subscribe({
          next: () => {
            mensaje.vistoPor.push({ tipoUsuario: 'club', userId: this.userId });
          },
          error: (error) => {
            console.error('Error al marcar el mensaje como visto:', error);
          }
        });
      }
    });
  }
}

