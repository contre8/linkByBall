import { ClubService } from './../../../service/club/club.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth/auth.service';
import { CommonModule } from '@angular/common'; // Importar CommonModule para ngClass
import { ActivatedRoute, Router } from '@angular/router';
import { ESPECIALIDADES_ENTRENADOR } from '../../../const/especialidades-entrenador.const';
import { EntrenadorService } from '../../../service/entrenador/entrenador.service';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FutbolistaService } from '../../../service/futbolista/futbolista.service';
import { Observable } from 'rxjs';
import { FavoritosService } from '../../../service/favoritos/favoritos.service';

@Component({
  selector: 'app-profile-entrenador',
  standalone: true, // Declarar el componente como standalone
  templateUrl: './external-profile.component.html',
  styleUrls: ['./external-profile.component.scss'],
  imports: [NavbarComponent, CommonModule],
})
export class ExternalProfileComponent implements OnInit {
  entrenador: any;
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto si no tiene foto
  isFavorite: boolean = false;
  userType: string = localStorage.getItem('userType') || '';

  constructor(
    private authService: AuthService,
    private entrenadorService: EntrenadorService,
    private route: ActivatedRoute,
    private router: Router,
    private clubService: ClubService,
    private futbolistaService: FutbolistaService,
    private favoritosService: FavoritosService,
  ) { }

  ngOnInit(): void {
    // Escuchar cambios en los parámetros de la ruta
    this.route.paramMap.subscribe((params) => {
      const entrenadorId = params.get('id');
      if (entrenadorId) {
        this.entrenadorService.getEntrenadorById(entrenadorId).subscribe(
          (entrenador) => {
            this.entrenador = entrenador; // Asignar los datos del entrenador
            this.checkIfFavorite(entrenadorId);
          },
          (error) => {
            console.error('Error al obtener el perfil del entrenador:', error);
          }
        );
      } else {
        console.error('No se proporcionó un ID de entrenador en la URL');
      }
    });
  }

  checkIfFavorite(entrenadorId: string): void {
    this.favoritosService.isFavorite(entrenadorId, this.userType).subscribe(
      (response) => {
        this.isFavorite = response.isFavorite;
      },
      (error) => {
        console.error('Error al verificar si es favorito:', error);
      }
    );
  }

  addOrRemoveFavorite(): void {
    if (!this.entrenador || !this.entrenador._id) return;

    if (this.isFavorite) {
      // Si ya es favorito, eliminar de favoritos
      this.favoritosService.removeFavorite(this.entrenador._id, this.userType).subscribe(
        () => {
          this.isFavorite = false;
          console.log('Entrenador eliminado de favoritos');
        },
        (error) => {
          console.error('Error al eliminar de favoritos:', error);
        }
      );
    } else {
      // Si no es favorito, agregar a favoritos
      this.favoritosService.addFavorite(this.entrenador._id, this.userType).subscribe(
        () => {
          this.isFavorite = true;
          console.log('Entrenador añadido a favoritos');
        },
        (error) => {
          console.error('Error al agregar a favoritos:', error);
        }
      );
    }
  }
}
