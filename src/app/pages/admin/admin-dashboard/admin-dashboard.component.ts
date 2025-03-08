import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth/auth.service';
import { NavbarComponent } from '../../navbar/navbar.component';
import { AvisosService } from '../../../service/avisos/avisos.service';
import { CommonModule } from '@angular/common';
import { ClubService } from './../../../service/club/club.service';
import { Router } from '@angular/router';
import { AdminService } from '../../../service/admin/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {

  userId: string = '';
  allClubs: any[] = [];
  verifiedClubs: any[] = [];
  activeTab: string = 'verificados'; // Mostrar primero los clubes validados
  unverifiedClubs: any[] = [];
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto si no tiene foto

  constructor(
    private clubService: ClubService,
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.clubService.getAllGeneralClubs().subscribe(
      (clubs) => {
        this.allClubs = clubs;
        console.log(clubs)
      },
      (error) => {
        console.error('Error al obtener todos los clubs', error);
      }
    );

    this.clubService.getUnverifiedClubs().subscribe(
      (clubs) => {
        this.unverifiedClubs = clubs;
        console.log(clubs)
      },
      (error) => {
        console.error('Error al obtener los clubs no verificados', error);
      }
    );

    this.clubService.getVerifiedClubs().subscribe(
      (clubs) => {
        this.verifiedClubs = clubs;
        console.log(clubs)
      },
      (error) => {
        console.error('Error al obtener los clubs verificados', error);
      }
    );
  }

  verificarClub(clubId: string): void {
    this.adminService.updateClubVerification(clubId, true).subscribe(
      () => {
        //this.cargarClubs();
        console.log('Club Verificado!');
      },
      (error) => {
        console.error('Error al verificar el club:', error);
      }
    );
  }

  desverificarClub(clubId: string): void {
    this.adminService.updateClubVerification(clubId, false).subscribe(
      () => {
        //this.cargarClubs();
      },
      (error) => {
        console.error('Error al invalidar el club:', error);
      }
    );
  }
}
