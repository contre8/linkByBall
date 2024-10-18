import { SolicitudService } from './../../../service/solicitudes/solicitudes.service';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

interface Solicitud {
  _id: string;
  solicitante: {
    id: string;
    nombre: string;
    apellidos: string;
    edad: number;
    tipo: string; // 'futbolista' o 'entrenador'
    fotografia: {
      url: string;
    };
  };
  solicitanteDatos: {
    id: string;
    nombre: string;
    apellidos: string;
    edad: number;
    tipo: string; // 'futbolista' o 'entrenador'
    fotografia: {
      url: string;
    };
  }
  estado: string;
  club: string; // ID del club asociado
  vacante: string; // ID de la vacante asociada
  fecha: Date;
}

@Component({
  selector: 'app-gest-solicitudes',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './gest-solicitudes.component.html',
  styleUrl: './gest-solicitudes.component.scss'
})
export class GestSolicitudesComponent implements OnInit {
  solicitudes: Solicitud[] = [];
  vacanteId: string = ''; // ID de la vacante seleccionada
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto si no tiene foto

  constructor(private solicitudService: SolicitudService,private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.vacanteId = params['id']; // Asegúrate de que la ruta contenga el parámetro correcto
      if (this.vacanteId) {
        this.obtenerSolicitudes(this.vacanteId);
      }
    });
  }

  obtenerSolicitudes(vacanteId: string): void {
    this.solicitudService.getSolicitudesByVacante(vacanteId).subscribe(
      (data) => {
        this.solicitudes = data;
        console.log(this.solicitudes)
      },
      (error) => {
        console.error('Error al obtener solicitudes:', error);
      }
    );
}

  cambiarEstado(solicitud: Solicitud, nuevoEstado: string): void {
    this.solicitudService.cambiarEstadoSolicitud(solicitud._id, nuevoEstado).subscribe(
      (data) => {
        solicitud.estado = data.estado; // Actualizar el estado en la UI
        console.log('Estado cambiado:', data);
      },
      (error) => {
        console.error('Error al cambiar estado:', error);
      }
    );
  }
}
