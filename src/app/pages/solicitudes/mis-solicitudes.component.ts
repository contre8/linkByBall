import { SolicitudService } from './../../service/solicitudes/solicitudes.service';
import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { OnInit } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

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
  userId: string = '';

  constructor(private solicitudService: SolicitudService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadSolicitudes();
  }

  loadSolicitudes(): void {
    this.authService.getProfile().subscribe(
      (userData) => {
        this.userId = userData._id;
        this.solicitudService.getSolicitudesByUser(this.userId, this.userType).subscribe(
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
      this.solicitudService.deleteSolicitud(solicitudId, this.userId).subscribe(
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

  goToSearch(): void {
    this.router.navigate([`${this.userType}/buscar-equipo`]);
  }
}
