import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ClubService } from '../club.service';
import { NavbarComponent } from '../navbar.component'; // Importa la navbar
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, MatButtonModule],
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.scss']
})
export class FavoritosComponent implements OnInit {
  favoritosFutbolistas: any[] = [];
  favoritosEntrenadores: any[] = [];
  favoritosClubes: any[] = [];
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto si no tiene foto
  clubId: string = '';

  constructor(private clubService: ClubService, private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.getClubProfile().subscribe(
      (clubData) => {
        this.clubId = clubData._id;

        // Obtener los favoritos del club
        this.loadFavorites(this.clubId);
      },
      (error) => {
        console.error('Error al obtener el perfil del club', error);
      }
    );
  }

  loadFavorites(clubId: string): void {
    this.clubService.getFavorites(clubId).subscribe(
      (favorites) => {
        console.log('Favoritos cargados:', favorites);

        // Dividir los favoritos en categorías
        this.favoritosFutbolistas = favorites.filter((fav: any) => fav.tipo === 'Futbolista');
        this.favoritosEntrenadores = favorites.filter((fav: any) => fav.tipo === 'Entrenador');
        this.favoritosClubes = favorites.filter((fav: any) => fav.tipo === 'Club');
      },
      (error) => {
        console.error('Error al cargar los favoritos:', error);
      }
    );
  }

  removeFromFavorites(favoriteId: string): void {
    this.clubService.removeFavorite(favoriteId).subscribe(
      () => {
        console.log('Favorito eliminado');

        // Eliminar el favorito de la lista correspondiente
        this.favoritosFutbolistas = this.favoritosFutbolistas.filter(fav => fav._id !== favoriteId);
        this.favoritosEntrenadores = this.favoritosEntrenadores.filter(fav => fav._id !== favoriteId);
        this.favoritosClubes = this.favoritosClubes.filter(fav => fav._id !== favoriteId);
      },
      (error) => {
        console.error('Error al eliminar el favorito:', error);
      }
    );
  }

  viewFavoriteProfile(favorite: any): void {
    if (favorite.tipo === 'Futbolista') {
      this.router.navigate(['/futbolista/perfil', favorite._id]);
    } else if (favorite.tipo === 'Entrenador') {
      this.router.navigate(['/entrenador/perfil', favorite._id]);
    } else if (favorite.tipo === 'Club') {
      this.router.navigate(['/club/perfil', favorite._id]);
    }
  }
}

