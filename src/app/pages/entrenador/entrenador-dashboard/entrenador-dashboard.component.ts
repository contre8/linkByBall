import { EntrenadorService } from './../../../service/entrenador/entrenador.service';
import { AvisosService } from './../../../service/avisos/avisos.service';
import { NavbarComponent } from './../../navbar/navbar.component';
import { AuthService } from './../../../service/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SolicitudService } from '../../../service/solicitudes/solicitudes.service';
import { VacantesService } from '../../../service/vacantes/vacantes.service';

const mapeoPosiciones: { [key: string]: string } = {
  "primer_entrenador": 'Primer Entrenador',
  "segundo_entrenador": 'Segundo Entrenador',
  "preparador_fisico": 'Preparador Físico',
  "entrenador_porteros": 'Entrenador de Porteros',
  "analista": 'Analista Táctico',
  "fisioterapeuta": 'Fisioterapeuta',
  "utillero": 'Utillero',
  "nutricionista": 'Nutricionista',
  "psicologo": 'Psicólogo Deportivo'
};

const posicionesValidas = Object.values(mapeoPosiciones);

@Component({
  selector: 'app-entrenador-dashboard',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './entrenador-dashboard.component.html',
  styleUrl: './entrenador-dashboard.component.scss'
})
export class EntrenadorDashboardComponent implements OnInit {

  constructor(
    private router: Router,
    //private clubService: ClubService,
    private avisosService: AvisosService,  // Asegúrate de tener el servicio de avisos
    private authService: AuthService,
    private solicitudService: SolicitudService,
    private entrenadorService: EntrenadorService,
    private vacanteService: VacantesService
  ) { }

  userId: string = '';
  vacantes: any[] = [];
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto si no tiene foto
  avisos: any[] = [];
  solicitudes: any[] = [];
  userType: string = localStorage.getItem('userType') || ''; // Si es null, asigna una cadena vacía
  entrenador: any;
  vacantesSimilares: any[] = []; // Para almacenar las vacantes similares
  posiciones: string[] = []; // Array de posiciones del futbolista
  solicitudesEnviadas: Set<string> = new Set(); // Usar un Set para almacenar los IDs de vacantes con solicitudes enviadas


  ngOnInit(): void {
    this.authService.getProfile().subscribe(
      (userData) => {
        this.userId = userData._id;
        this.loadAvisos();
        this.loadSolicitudes();
      },
      (error) => {
        console.error('Error al obtener el perfil del club', error);
      }
    );
    this.authService.getEntrenadorProfile().subscribe(
      (entrenadorData) => {
        this.entrenador = entrenadorData; // Asigna los datos del entrenador al componente
        this.posiciones = entrenadorData.especialidades
          .map((posicion: string) => mapeoPosiciones[posicion] || posicion) // Mapear o mantener la posición
          .filter((posicion: string) => posicionesValidas.includes(posicion));
        this.obtenerVacantesSimilares();
      },
      (error) => {
        console.error('Error al obtener el perfil del entrenador', error);
      }
    );
  }

  loadAvisos(): void {
    this.avisosService.getAvisos(this.userId).subscribe(
      (avisos) => {
        this.avisos = avisos.slice(0, 3); // Tomar solo los tres primeros avisos
      },
      (error) => {
        console.error('Error al cargar los avisos:', error);
      }
    );
  }

  verPerfil(perfilId: string, tipoPerfil: string): void {
    if (tipoPerfil === 'futbolista') {
      this.router.navigate([`/futbolista/perfil/${perfilId}`]);
    } else if (tipoPerfil === 'entrenador') {
      this.router.navigate([`/entrenador/perfil/${perfilId}`]);
    } else if (tipoPerfil === 'club') {
      this.router.navigate([`/club/perfil/${perfilId}`]);
    }
  }

  marcarComoVisto(aviso: any): void {
    if (!aviso.visto) {
      aviso.visto = true;
      this.avisosService.marcarAvisoComoVisto(aviso._id).subscribe(
        () => {
          console.log('Aviso marcado como visto');
        },
        (error) => {
          console.error('Error al marcar el aviso como visto:', error);
        }
      );
    }
  }

  verSolicitudes(vacanteId: string) {
    this.router.navigate([`/entrenador/mis-solicitudes`]);
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

  obtenerVacantesSimilares(): void {
    console.log(this.posiciones)
    this.vacanteService.getVacantesSimilares(this.posiciones).subscribe(
      (vacantes) => {
        console.log(vacantes)
        this.vacantesSimilares = vacantes.vacantes;
        console.log(this.vacantesSimilares)
      },
      (error) => {
        console.error('Error al obtener vacantes similares:', error);
      }
    );
  }

  haEnviadoSolicitud(vacanteId: string): boolean {
    if (this.solicitudesEnviadas.has(vacanteId)) {
      return true;
    }
    return this.solicitudes.some(solicitud => solicitud.vacante === vacanteId);
  }

  mandarSolicitud(vacante: any): void {
    this.solicitudesEnviadas.add(vacante._id);

    const solicitudData = {
      solicitante: {
        id: this.userId, // ID del solicitante (entrenador o entrenador)
        tipo: this.userType // Tipo del solicitante
      },
      club: vacante.club, // ID del club al que pertenece la vacante
      vacante: vacante._id, // ID de la vacante a la que se aplica
      fecha: new Date(), // Fecha de la solicitud
      estado: 'Pendiente' // Estado inicial de la solicitud
    };


    // Enviar la solicitud al servidor
    this.solicitudService.createSolicitud(solicitudData).subscribe(
      (response) => {
        alert('¡Solicitud enviada con éxito!');
        this.haEnviadoSolicitud(solicitudData.vacante)
        this.loadSolicitudes();
      },
      (error) => {
        alert('Hubo un problema al enviar la solicitud.');
      }
    );
  }
}
