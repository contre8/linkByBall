import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../navbar.component'; // Importa la navbar
import { AvisosService } from '../../service/avisos/avisos.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-mis-avisos',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './mis-avisos.component.html',
  styleUrl: './mis-avisos.component.scss'
})
export class MisAvisosComponent implements OnInit {
  avisos: any[] = [];
  isLoading: boolean = true;
  hasError: boolean = false;
  userId: string = '';

  constructor(private avisosService: AvisosService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getClubProfile().subscribe(
      (clubData) => {
        this.userId = clubData._id;
        this.cargarAvisos(this.userId);
      },
      (error) => {
        console.error('Error al obtener el perfil del club', error);
      }
    );
  }

  cargarAvisos(userId: string): void {
    if (userId) {
      this.isLoading = true;
      this.avisosService.getAvisos(userId).subscribe(
        (data) => {
          this.avisos = data;
          this.isLoading = false;
          console.log(this.avisos)
        },
        (error) => {
          console.error('Error al cargar los avisos:', error);
          this.hasError = true;
          this.isLoading = false;
        }
      );
    } else {
      console.error('No se pudo obtener el ID del usuario');
    }
  }
}
