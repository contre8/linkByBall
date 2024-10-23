import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
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
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule, HttpClientModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})

export class ChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  conversaciones: any[] = [];
  mensajes: any[] = [];
  userId: string = '';
  nuevoMensaje: string = '';
  conversacionActiva: any = null;
  userType: string = (localStorage.getItem('userType') || '').charAt(0).toUpperCase() + (localStorage.getItem('userType') || '').slice(1);

  constructor(private chatService: ChatService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private chatSocketService: ChatSocketService,
    private cdr: ChangeDetectorRef // Agregar esta línea
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
        //this.cargarMensajes(mensaje.conversacionId);
        this.scrollToBottom(); // Desplazarse hacia el final al recibir un mensaje nuevo
        //this.cdr.detectChanges(); // Forzar la detección de cambios
      }
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
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
    //this.cdr.detectChanges(); // Forzar la detección de cambios al cambiar de conversación
  }

  abrirConversacionPorId(conversacionId: string): void {
    this.chatService.obtenerMensajes(conversacionId).subscribe({
      next: (response) => {
        this.conversacionActiva = { _id: conversacionId }; // Establecer como la conversación activa
        this.conversacionActiva = conversacionId;
        this.cargarMensajes(conversacionId);
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
        this.scrollToBottom(); // Desplazarse hacia el final al cargar mensajes
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
      tipoUsuario: this.userType,
      usuarioId: this.userId
    };

    this.chatService.enviarMensaje(this.conversacionActiva, remitente, this.nuevoMensaje).subscribe({
      next: (response) => {
        //this.mensajes.push(response.mensaje);
        this.nuevoMensaje = '';
        this.scrollToBottom(); // Desplazarse hacia el final al enviar un mensaje
      },
      error: (error) => {
        console.error('Error al enviar el mensaje:', error);
      }
    });
    const mensaje = {
      conversacionId: this.conversacionActiva._id, // Asegúrate de incluir el ID de la conversación
      remitente,
      texto: this.nuevoMensaje,
      createdAt: new Date(), // Añadir la fecha y hora actual
      tipoContenido: 'texto' // Ajusta según sea necesario
    };
    this.chatSocketService.enviarMensaje(mensaje, this.conversacionActiva);
  }

  // Marcar mensajes como vistos
  marcarMensajesComoVistos(): void {
    this.mensajes.forEach(mensaje => {
      if (!mensaje.vistoPor.some((v: { userId: string; }) => v.userId === this.userId)) {
        this.chatService.marcarMensajeComoVisto(mensaje._id, this.userType, this.userId).subscribe({
          next: () => {
            mensaje.vistoPor.push({ tipoUsuario: this.userType, userId: this.userId });
          },
          error: (error) => {
            console.error('Error al marcar el mensaje como visto:', error);
          }
        });
      }
    });
  }

  // Desplazarse hacia el final del contenedor de mensajes
  private scrollToBottom(): void {
    try {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error al desplazarse al final:', err);
    }
  }
}

