import { ClubService } from './../../../service/club/club.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar el módulo común para standalone
import { RouterModule } from '@angular/router'; // Para redirecciones si se necesita
import { FormsModule } from '@angular/forms'; // Si usas formularios
import { AuthService } from '../../../auth/auth.service';
import { FutbolistaService } from '../../../service/futbolista/futbolista.service';
import { ActivatedRoute, Router } from '@angular/router'; // Importar Router
import { NavbarComponent } from '../../navbar/navbar.component';
import { EntrenadorService } from '../../../service/entrenador/entrenador.service';

@Component({
  selector: 'app-profile',
  standalone: true, // Declarar standalone
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent], // Importar módulos necesarios
  templateUrl: './external-profile.component.html',
  styleUrls: ['./external-profile.component.scss']
})
export class ExternalProfileComponent implements OnInit {
  futbolista: any;
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto si no tiene foto
  posiciones: string[] = []; // Para almacenar las posiciones desde la base de datos
  isFavorite: boolean = false;

  constructor(
    private authService: AuthService,
    private futbolistaService: FutbolistaService,
    private route: ActivatedRoute,
    private router: Router,
    private clubService: ClubService,
    private entrenadorService: EntrenadorService,
  ) { }

  ngOnInit(): void {
    // Escuchar cambios en los parámetros de la ruta
    this.route.paramMap.subscribe(params => {
      const futbolistaId = params.get('id');
      if (futbolistaId) {
        this.futbolistaService.getFutbolistaById(futbolistaId).subscribe(
          (futbolista) => {
            this.futbolista = futbolista; // Asignar los datos del futbolista
            this.checkIfFavorite(futbolistaId);
          },
          (error) => {
            console.error('Error al obtener el perfil del futbolista:', error);
          }
        );
      } else {
        console.error('No se proporcionó un ID de futbolista en la URL');
      }
    });
  }

  checkIfFavorite(futbolistaId: string): void {
    this.clubService.isFavorite(futbolistaId).subscribe(
      (response) => {
        this.isFavorite = response.isFavorite;
      },
      (error) => {
        console.error('Error al verificar si es favorito:', error);
      }
    );
  }

  addOrRemoveFavorite(): void {
    if (!this.futbolista || !this.futbolista._id) return;

    if (this.isFavorite) {
      // Si ya es favorito, eliminar de favoritos
      this.clubService.removeFavorite(this.futbolista._id).subscribe(
        () => {
          this.isFavorite = false;
        },
        (error) => {
          console.error('Error al eliminar de favoritos:', error);
        }
      );
    } else {
      // Si no es favorito, agregar a favoritos
      this.clubService.addFavorite(this.futbolista._id).subscribe(
        () => {
          this.isFavorite = true;
        },
        (error) => {
          console.error('Error al agregar a favoritos:', error);
        }
      );
    }
  }


  addToFavorites(): void {
    const userType = localStorage.getItem('userType');
    if (!userType) {
      console.error('No se ha encontrado el tipo de usuario en el localStorage.');
      return;
    }

    if (this.futbolista && this.futbolista._id) {
      if (userType === 'club') {
        this.clubService.addFavorite(this.futbolista._id).subscribe(
          () => {
            console.log('Futbolista marcado como favorito por el club');
            alert('Futbolista añadido a favoritos');
          },
          (error) => {
            console.error('Error al marcar como favorito:', error);
          }
        );
      } else if (userType === 'entrenador') {
        this.entrenadorService.addFavorite(this.futbolista._id).subscribe(
          () => {
            console.log('Futbolista marcado como favorito por el entrenador');
            alert('Futbolista añadido a favoritos');
          },
          (error) => {
            console.error('Error al marcar como favorito:', error);
          }
        );
      } else {
        console.error('Tipo de usuario no soportado.');
      }
    }
  }


  // Función que retorna la clase CSS para una posición
  getClassForPosition(posicion: string): string {
    console.log(posicion)
    switch (posicion) {
      case 'portero': return 'portero';
      case 'central_diestro': return 'central-diestro';
      case 'central_zurdo': return 'central-zurdo';
      case "lateral_diestro": return 'lateral-diestro';
      case 'lateral_zurdo': return 'lateral-zurdo';
      case 'mediocentro_defensivo': return 'mediocentro-defensivo';
      case 'interior_diestro': return 'interior-diestro';
      case 'interior_zurdo': return 'interior-zurdo';
      case 'mediapunta': return 'mediapunta';
      case 'extremo_diestro': return 'extremo-diestro';
      case 'extremo_zurdo': return 'extremo-zurdo';
      case 'delantero_centro': return 'delantero-centro';
      case 'carrilero_diestro': return 'carrilero-diestro';
      case 'carrilero_zurdo': return 'carrilero-zurdo';
      default: return '';
    }
  }

  // Función que retorna el nombre legible de una posición
  getLabelForPosition(posicion: string): string {
    switch (posicion) {
      case 'portero': return 'PO';
      case 'central_diestro': return 'CD';
      case 'central_zurdo': return 'CI';
      case 'lateral_diestro': return 'LD';
      case 'lateral_zurdo': return 'LI';
      case 'mediocentro_defensivo': return 'MCD';
      case 'interior_diestro': return 'ID';
      case 'interior_zurdo': return 'II';
      case 'mediapunta': return 'MP';
      case 'extremo_diestro': return 'ED';
      case 'extremo_zurdo': return 'EI';
      case 'delantero_centro': return 'DC';
      case 'carrilero_diestro': return 'CAD';
      case 'carrilero_zurdo': return 'CAI';
      default: return posicion;
    }
  }
}
