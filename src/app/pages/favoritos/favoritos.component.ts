import { ClubService } from './../../service/club/club.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component'; // Importa la navbar
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
import { FavoritosService } from '../../service/favoritos/favoritos.service';
import { ChatService } from '../../service/chat/chat.service';

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
  userId: string = '';
  isLoading: boolean = false;
  //userType: string | null = localStorage.getItem('userType'); // Obtén el valor de localStorage directamente al declarar
  userType: string = localStorage.getItem('userType') || ''; // Si es null, asigna una cadena vacía
  selectedTab: string = 'futbolistas'; // Pestaña inicial seleccionada

  constructor(
    private clubService: ClubService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private favoritosService: FavoritosService,
    private chatService: ChatService,
  ) { }

  ngOnInit(): void {
    this.authService.getProfile().subscribe(
      (userData) => {
        this.userId = userData._id;

        // Obtener los favoritos del usuario (puede ser club, entrenador o futbolista)
        this.loadFavorites(this.userId);
      },
      (error) => {
        console.error('Error al obtener el perfil del usuario', error);
      }
    );
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  loadFavorites(userId: string): void {
    this.isLoading = true;
    this.favoritosService.getFavorites(userId, this.userType).subscribe(
      (favorites) => {
        console.log('Favoritos cargados:', favorites);
        // Dividir los favoritos en categorías
        this.favoritosFutbolistas = favorites.filter((fav: any) => fav.tipo === 'Futbolista');
        this.favoritosEntrenadores = favorites.filter((fav: any) => fav.tipo === 'Entrenador');
        this.favoritosClubes = favorites.filter((fav: any) => fav.tipo === 'Club');
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.error('Error al cargar los favoritos:', error);
      }
    );
  }

  removeFromFavorites(favoriteId: string): void {
    this.favoritosService.removeFavorite(favoriteId, this.userType).subscribe(
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

  goToSearch(): void {
    this.router.navigate(['buscador']);
  }

  iniciarConversacion(favorite: any, type: string): void {
    if (!favorite || !favorite._id) {
      console.error('No se pudo iniciar la conversación. ID de favorite no encontrado.');
      return;
    }

    const nombreConversacion = `${favorite.nombre} ${favorite.apellidos}`; // Nombre y apellidos del favorite
    const capitalizedUserType = this.userType.charAt(0).toUpperCase() + this.userType.slice(1).toLowerCase();

    const participantes = [
      {
        tipoUsuario: capitalizedUserType, // Tipo del usuario actual con la primera letra en mayúscula
        usuarioId: this.userId
      },
      {
        tipoUsuario: type, // Tipo del otro participante (favorite)
        usuarioId: favorite._id // ID del futbolista seleccionado
      }
    ];

    // Incluir el nombre de la conversación
    const nuevaConversacion = {
      nombre: nombreConversacion,
      participantes: participantes
    };

    this.chatService.crearConversacion(nuevaConversacion).subscribe({
      next: (response) => {
        // Redirigir al componente del chat o mostrar mensaje de éxito
        console.log('Conversación iniciada correctamente:', response.conversacion);
        this.router.navigate(['/chat', response.conversacion._id]); // Redirige al chat usando el ID de la conversación
      },
      error: (error) => {
        console.error('Error al iniciar la conversación:', error);
      }
    });
  }
}

