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
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto si no tiene foto
  totalPages: number = 1;
  currentPage: number = 1;

  constructor(private avisosService: AvisosService, private authService: AuthService, private router: Router) { }

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

  verPerfil(perfilId: string, tipoPerfil: string): void {
    if (tipoPerfil === 'futbolista') {
      this.router.navigate([`/futbolista/perfil/${perfilId}`]);
    } else if (tipoPerfil === 'entrenador') {
      this.router.navigate([`/entrenador/perfil/${perfilId}`]);
    } else if (tipoPerfil === 'club') {
      this.router.navigate([`/club/perfil/${perfilId}`]);
    }
  }


}
