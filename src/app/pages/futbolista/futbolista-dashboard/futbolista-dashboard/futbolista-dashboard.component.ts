import { AvisosService } from './../../../../service/avisos/avisos.service';
import { NavbarComponent } from './../../../navbar/navbar.component';
import { AuthService } from './../../../../service/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SolicitudService } from '../../../../service/solicitudes/solicitudes.service';
import { FutbolistaService } from '../../../../service/futbolista/futbolista.service';
import { VacantesService } from '../../../../service/vacantes/vacantes.service';

const mapeoPosiciones: { [key: string]: string } = {
  'portero': 'Portero',
  'central_diestro': 'Central Diestro',
  'central_zurdo': 'Central Zurdo',
  'lateral_diestro': 'Lateral Diestro',
  'carrilero_diestro': 'Carrilero Diestro',
  'lateral_zurdo': 'Lateral Zurdo',
  'carrilero_zurdo': 'Carrilero Zurdo',
  'mediocentro_defensivo': 'Mediocentro Defensivo',
  'interior_diestro': 'Interior Diestro',
  'interior_zurdo': 'Interior Zurdo',
  'medipunta': 'Mediapunta',
  'extremo_diestro': 'Extremo Diestro',
  'extremo_zurdo': 'Extremo Zurdo',
  'delantero_centro': 'Delantero Centro'
};

const posicionesValidas = Object.values(mapeoPosiciones);

@Component({
  selector: 'app-futbolista-dashboard',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './futbolista-dashboard.component.html',
  styleUrl: './futbolista-dashboard.component.scss'
})
export class FutbolistaDashboardComponent implements OnInit {

  constructor(
    private router: Router,
    //private clubService: ClubService,
    private avisosService: AvisosService,  // Asegúrate de tener el servicio de avisos
    private authService: AuthService,
    private solicitudService: SolicitudService,
    private futbolistaservice: FutbolistaService,
    private vacanteService: VacantesService
  ) { }

  userId: string = '';
  vacantes: any[] = [];
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto si no tiene foto
  avisos: any[] = [];
  solicitudes: any[] = [];
  userType: string = localStorage.getItem('userType') || ''; // Si es null, asigna una cadena vacía
  futbolista: any;
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
    this.authService.getFutbolistaProfile().subscribe(
      (futbolistaData) => {
        this.futbolista = futbolistaData; // Asigna los datos del futbolista al componente
        this.posiciones = futbolistaData.posiciones
          .map((posicion: string) => mapeoPosiciones[posicion] || posicion) // Mapear o mantener la posición
          .filter((posicion: string) => posicionesValidas.includes(posicion));
        this.obtenerVacantesSimilares();
      },
      (error) => {
        console.error('Error al obtener el perfil del futbolista', error);
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
    this.router.navigate([`/futbolista/mis-solicitudes`]);
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
    this.vacanteService.getVacantesSimilares(this.posiciones).subscribe(
      (vacantes) => {
        this.vacantesSimilares = vacantes.vacantes;
        console.log(this.vacantesSimilares)
        console.log(vacantes.vacantes)
      },
      (error) => {
        console.error('Error al obtener vacantes similares:', error);
      }
    );
  }

  getLabelForPosition(posicion: string): string {
    switch (posicion) {
      case 'portero': return 'PO';
      case 'central_diestro': return 'CD';
      case 'central_zurdo': return 'CI';
      case 'lateral_diestro': return 'LD';
      case 'lateral_zurdo': return 'LI';
      case 'mediocentro_defensivo': return 'MCD';
      case 'interior_diestro': return 'ID';
      case 'interior_zurdo': return 'II';
      case 'mediapunta': return 'MP';
      case 'extremo_diestro': return 'ED';
      case 'extremo_zurdo': return 'EI';
      case 'delantero_centro': return 'DC';
      case 'carrilero_diestro': return 'CAD';
      case 'carrilero_zurdo': return 'CAI';
      default: return posicion;
    }
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
        id: this.userId, // ID del solicitante (futbolista o entrenador)
        tipo: this.userType // Tipo del solicitante
      },
      club: vacante.club, // ID del club al que pertenece la vacante
      vacante: vacante._id, // ID de la vacante a la que se aplica
      fecha: new Date(), // Fecha de la solicitud
      estado: 'Pendiente' // Estado inicial de la solicitud
    };

    console.log(solicitudData)

    // Enviar la solicitud al servidor
    this.solicitudService.createSolicitud(solicitudData).subscribe(
      (response) => {
        alert('¡Solicitud enviada con éxito!');
        this.haEnviadoSolicitud(solicitudData.vacante)
      },
      (error) => {
        alert('Hubo un problema al enviar la solicitud.');
      }
    );
  }
}
