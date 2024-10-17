import { SolicitudService } from './../../service/solicitudes.service';
import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { OnInit } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-solicitudes',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './mis-solicitudes.component.html',
  styleUrls: ['./mis-solicitudes.component.scss']
})
export class MisSolicitudesComponent implements OnInit {
  solicitudes: any[] = [];
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto si no tiene foto
  userType: string = localStorage.getItem('userType') || ''; // Si es null, asigna una cadena vacía

  constructor(private solicitudService: SolicitudService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadSolicitudes();
  }

  loadSolicitudes(): void {
    this.authService.getProfile().subscribe(
      (userData) => {
        const userId = userData._id;
        this.solicitudService.getSolicitudesByUser(userId, this.userType).subscribe(
          (solicitudes) => {
            this.solicitudes = solicitudes;
          },
          (error) => {
            console.error('Error al cargar las solicitudes:', error);
          }
        );
      },
      (error) => {
        console.error('Error al obtener el perfil del usuario:', error);
      }
    );
  }

  cancelarSolicitud(solicitudId: string): void {
    if (confirm('¿Estás seguro de que quieres cancelar esta solicitud?')) {
      this.solicitudService.deleteSolicitud(solicitudId).subscribe(
        () => {
          console.log('Solicitud cancelada');
          // Elimina la solicitud de la lista local
          this.solicitudes = this.solicitudes.filter(solicitud => solicitud._id !== solicitudId);
          alert('Solicitud cancelada exitosamente.');
        },
        (error) => {
          console.error('Error al cancelar la solicitud:', error);
          alert('Hubo un problema al cancelar la solicitud.');
        }
      );
    }
  }
}
