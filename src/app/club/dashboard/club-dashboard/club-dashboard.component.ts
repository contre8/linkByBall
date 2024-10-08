import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClubService } from '../../club.service';
import { CommonModule } from '@angular/common';  // Asegúrate de importar CommonModule
import { AuthService } from '../../../auth/auth.service';
import { NavbarComponent } from '../../navbar.component';

@Component({
  selector: 'app-dashboard-club',
  templateUrl: './club-dashboard.component.html',
  styleUrls: ['./club-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, NavbarComponent]  // Añadir CommonModule aquí

})
export class DashboardClubComponent implements OnInit {
  vacantes: any[] = [];
  totalVacantesActivas: number = 0;
  totalSolicitudes: number = 0;
  nuevosContactos: number = 0;
  isLoading: boolean = true;
  clubId: string = '';

  constructor(
    private router: Router,
    private clubService: ClubService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.getClubProfile().subscribe(
      (clubData) => {
        this.clubId = clubData._id;

        // Obtener las vacantes del club
        this.loadVacantes();
      },
      (error) => {
        console.error('Error al obtener el perfil del club', error);
      }
    );
    this.loadClubData();
    this.loadVacantes();
  }

  loadClubData(): void {
    this.clubService.getClubProfile().subscribe(
      (clubData) => {
        this.totalVacantesActivas = clubData.vacantes.length;
        this.totalSolicitudes = this.calculateTotalSolicitudes(clubData.vacantes);
        this.nuevosContactos = this.calculateNuevosContactos(clubData.contactos);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener los datos del club', error);
        this.isLoading = false;
      }
    );
  }

  loadVacantes(): void {
    if (this.clubId) {
        this.clubService.getVacantesByClub(this.clubId).subscribe(
            (vacantes) => {
                this.vacantes = vacantes;
                this.totalVacantesActivas = this.vacantes.length;
                console.log('Vacantes cargadas:', vacantes);
            },
            (error) => {
                console.error('Error al obtener las vacantes', error);
            }
        );
    } else {
        console.error('clubId no está definido, no se pueden cargar las vacantes.');
    }
}


  calculateTotalSolicitudes(vacantes: any[]): number {
    let total = 0;
    vacantes.forEach((vacante) => {
      if (vacante.solicitudes) {
        total += vacante.solicitudes.length;
      }
    });
    return total;
  }

  calculateNuevosContactos(contactos: any[]): number {
    // Implementar la lógica según el criterio de "nuevos contactos"
    return contactos ? contactos.length : 0;
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  goToFavorites(): void {
    this.router.navigate(['/favorites']);
  }

  searchProfiles(): void {
    this.router.navigate(['/search']);
  }

  viewNotifications(): void {
    // Implementar lógica para ver notificaciones (puede ser un modal o redirigir a una página específica)
    this.router.navigate(['/notifications']);
  }

  openChat(): void {
    this.router.navigate(['/chat']);
  }

  viewProfile(): void {
    this.router.navigate(['club/perfil']);
  }

  logout(): void {
    // Implementar lógica de cierre de sesión (limpiar token, redirigir al login)
    localStorage.removeItem('token');
    this.router.navigate(['auth/login']);
  }

  editarVacante(vacante: any): void {
    this.router.navigate([`/vacante/edit/${vacante._id}`]);
  }

  eliminarVacante(vacante: any): void {
    // if (confirm('¿Estás seguro de que deseas eliminar esta vacante?')) {
    //   this.vacanteService.deleteVacante(vacante._id).subscribe(
    //     (response) => {
    //       console.log('Vacante eliminada con éxito', response);
    //       this.loadVacantes(); // Recargar la lista de vacantes después de eliminar
    //     },
    //     (error) => {
    //       console.error('Error al eliminar la vacante', error);
    //     }
    //   );
    // }
  }

  crearNuevaVacante(): void {
    this.router.navigate(['/vacante/create']);
  }
}
