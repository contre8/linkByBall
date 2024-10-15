import { ClubService } from './../../../service/club/club.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar el módulo común para standalone
import { RouterModule } from '@angular/router'; // Para redirecciones si se necesita
import { FormsModule } from '@angular/forms'; // Si usas formularios
import { ActivatedRoute, Router } from '@angular/router'; // Importar Router
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-club-profile',
  standalone: true, // Declarar standalone
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent], // Importar módulos necesarios
  templateUrl: './external-profile.component.html',
  styleUrl: './external-profile.component.scss'
})
export class ExternalProfileComponent {
  club: any;
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto si no tiene foto
  isFavorite: boolean = false;

  constructor(private clubService: ClubService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const clubId = params.get('id');
      if (clubId) {
        this.clubService.getClubById(clubId).subscribe(
          (club) => {
            this.club = club; // Asignar los datos del club
            this.checkIfFavorite(clubId);
          },
          (error) => {
            console.error('Error al obtener el perfil del club:', error);
          }
        );
      } else {
        console.error('No se proporcionó un ID de club en la URL');
      }
    });
  }

  checkIfFavorite(entrenadorId: string): void {
    this.clubService.isFavorite(entrenadorId).subscribe(
      (response) => {
        this.isFavorite = response.isFavorite;
      },
      (error) => {
        console.error('Error al verificar si es favorito:', error);
      }
    );
  }

  addOrRemoveFavorite(): void {
    if (!this.club || !this.club._id) return;

    if (this.isFavorite) {
      // Si ya es favorito, eliminar de favoritos
      this.clubService.removeFavorite(this.club._id).subscribe(
        () => {
          this.isFavorite = false;
          console.log('club eliminado de favoritos');
        },
        (error) => {
          console.error('Error al eliminar de favoritos:', error);
        }
      );
    } else {
      // Si no es favorito, agregar a favoritos
      this.clubService.addFavorite(this.club._id).subscribe(
        () => {
          this.isFavorite = true;
          console.log('club añadido a favoritos');
        },
        (error) => {
          console.error('Error al agregar a favoritos:', error);
        }
      );
    }
  }
}
