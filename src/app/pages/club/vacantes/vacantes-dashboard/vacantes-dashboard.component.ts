import { ClubService } from './../../../../service/club/club.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
//import { VacanteService } from '../vacante.service';
import { AuthService } from '../../../../auth/auth.service';
import { NavbarComponent } from '../../../navbar/navbar.component';

@Component({
  selector: 'app-dashboard-vacantes',
  templateUrl: './vacantes-dashboard.component.html',
  styleUrls: ['./vacantes-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NavbarComponent]
})
export class DashboardVacantesComponent implements OnInit {
  vacantes: any[] = []; // Lista de vacantes
  clubId: string = '';  // ID del club

  constructor(
    //private vacanteService: VacanteService,
    private router: Router,
    private authService: AuthService,
    private clubService: ClubService
  ) {}

  ngOnInit(): void {
    // Obtener el perfil del club
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
  }

  loadVacantes(): void {
    if (this.clubId) {
      this.clubService.getVacantesByClub(this.clubId).subscribe(
        (vacantes) => {
          this.vacantes = vacantes;
          console.log('Vacantes cargadas:', vacantes);
        },
        (error) => {
          console.error('Error al cargar las vacantes', error);
        }
      );
    }
  }

  goToCreateVacante(): void {
    this.router.navigate(['/club/crear-vacante']);
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
}
