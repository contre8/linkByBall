import { AvisosService } from './../../../../service/avisos/avisos.service';
import { NavbarComponent } from './../../../navbar/navbar.component';
import { AuthService } from './../../../../service/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-futbolista-dashboard',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './futbolista-dashboard.component.html',
  styleUrl: './futbolista-dashboard.component.scss'
})
export class FutbolistaDashboardComponent implements OnInit{

  constructor(
    private router: Router,
    //private clubService: ClubService,
    private avisosService: AvisosService,  // Asegúrate de tener el servicio de avisos
    private authService: AuthService,
  ) { }

  userId: string = '';

  ngOnInit(): void {
    this.authService.getProfile().subscribe(
      (userData) => {
        this.userId = userData._id;

        // Cargar todas las secciones

      },
      (error) => {
        console.error('Error al obtener el perfil del club', error);
      }
    );
  }

}
