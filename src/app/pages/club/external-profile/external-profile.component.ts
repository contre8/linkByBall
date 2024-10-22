import { ClubService } from './../../../service/club/club.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar el módulo común para standalone
import { RouterModule } from '@angular/router'; // Para redirecciones si se necesita
import { FormsModule } from '@angular/forms'; // Si usas formularios
import { ActivatedRoute, Router } from '@angular/router'; // Importar Router
import { NavbarComponent } from '../../navbar/navbar.component';
import { FavoritosService } from '../../../service/favoritos/favoritos.service';
import { AuthService } from '../../../service/auth/auth.service';
import { ChatService } from '../../../service/chat/chat.service';

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
  userType: string = localStorage.getItem('userType') || '';
  userId: string = '';


  constructor(private clubService: ClubService,
    private route: ActivatedRoute,
    private router: Router,
    private favoritosService: FavoritosService,
    private authService: AuthService,
    private chatService: ChatService
) { }

  ngOnInit(): void {
    this.authService.getProfile().subscribe(
      (userData) => {
        this.userId = userData._id;
      },
      (error) => {
        console.error('Error al obtener el perfil del usuario', error);
      }
    );
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
    if (!this.club || !this.club._id) return;

    if (this.isFavorite) {
      // Si ya es favorito, eliminar de favoritos
      this.favoritosService.removeFavorite(this.club._id, this.userType).subscribe(
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
      this.favoritosService.addFavorite(this.club._id, this.userType).subscribe(
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

  iniciarConversacion(): void {
    if (!this.club || !this.club._id) {
      console.error('No se pudo iniciar la conversación. ID de club no encontrado.');
      return;
    }

    const nombreConversacion = `${this.club.nombre} ${this.club.apellidos}`; // Nombre y apellidos del futbolista
    const capitalizedUserType = this.userType.charAt(0).toUpperCase() + this.userType.slice(1).toLowerCase();

    const participantes = [
      {
        tipoUsuario: capitalizedUserType, // Tipo del usuario actual con la primera letra en mayúscula
        usuarioId: this.userId
      },
      {
        tipoUsuario: 'Club', // Tipo del otro participante (futbolista)
        usuarioId: this.club._id // ID del futbolista seleccionado
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
