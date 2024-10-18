import { ClubService } from './../../../service/club/club.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth.service';
import { NavbarComponent } from '../../navbar/navbar.component';
import { AvisosService } from '../../../service/avisos/avisos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-club',
  templateUrl: './club-dashboard.component.html',
  styleUrls: ['./club-dashboard.component.scss'],
  standalone: true,
  imports: [NavbarComponent, CommonModule]
})
export class DashboardClubComponent implements OnInit {
  vacantes: any[] = [];
  avisos: any[] = [];
  plantilla: any[] = [];
  totalVacantesActivas: number = 0;
  totalSolicitudes: number = 0;
  nuevosContactos: number = 0;
  isLoading: boolean = true;
  clubId: string = '';
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto si no tiene foto
  solicitudes: number = 0;


  constructor(
    private router: Router,
    private clubService: ClubService,
    private avisosService: AvisosService,  // Asegúrate de tener el servicio de avisos
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.getClubProfile().subscribe(
      (clubData) => {
        this.clubId = clubData._id;
        this.solicitudes = clubData.solicitudes?.length;
        // Cargar todas las secciones
        this.loadVacantes();
        this.loadAvisos();
        this.loadPlantilla();
      },
      (error) => {
        console.error('Error al obtener el perfil del club', error);
      }
    );
  }

  loadVacantes(): void {
    if (this.clubId) {
      this.clubService.getVacantesByClub(this.clubId).subscribe(
        (vacantes) => {
          this.vacantes = vacantes.slice(0, 6);
          this.totalVacantesActivas = this.vacantes.length;
        },
        (error) => {
          console.error('Error al obtener las vacantes', error);
        }
      );
    }
  }

  loadAvisos(): void {
    this.avisosService.getAvisos(this.clubId).subscribe(
      (avisos) => {
        this.avisos = avisos.slice(0, 3); // Tomar solo los tres primeros avisos
      },
      (error) => {
        console.error('Error al cargar los avisos:', error);
      }
    );
  }

  loadPlantilla(): void {
    this.clubService.getPlantillaByClub(this.clubId).subscribe(
      (plantilla) => {
        this.plantilla = [...plantilla.futbolistas, ...plantilla.entrenadores];
        console.log(plantilla)
      },
      (error) => {
        console.error('Error al cargar la plantilla', error);
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

  verSolicitudes(vacanteId: string) {
    this.router.navigate([`/club/vacante/${vacanteId}`]);
  }

  crearNuevaVacante(): void {
    this.router.navigate(['/vacante/create']);
  }

  editarVacante(vacante: any): void {
    this.router.navigate(['/club/modify-vacante', vacante._id]); // Navega a la ruta de edición de vacante
  }

  eliminarVacante(vacante: any): void {
    if (confirm(`¿Estás seguro de que deseas eliminar la vacante para ${vacante.posicion}?`)) {
      this.clubService.deleteVacante(vacante._id).subscribe(
        (response) => {
          console.log('Vacante eliminada con éxito', response);
          // Volver a cargar la lista de vacantes después de eliminar una
          this.loadVacantes();
        },
        (error) => {
          console.error('Error al eliminar la vacante', error);
        }
      );
    }
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
}
