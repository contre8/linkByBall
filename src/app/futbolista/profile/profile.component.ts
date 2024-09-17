import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar el módulo común para standalone
import { RouterModule } from '@angular/router'; // Para redirecciones si se necesita
import { FormsModule } from '@angular/forms'; // Si usas formularios
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-profile',
  standalone: true, // Declarar standalone
  imports: [CommonModule, RouterModule, FormsModule], // Importar módulos necesarios
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  futbolista: any;
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto si no tiene foto
  posiciones: string[] = []; // Para almacenar las posiciones desde la base de datos

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) { } // Inyecta Router

  ngOnInit(): void {
    this.authService.getFutbolistaProfile().subscribe(
      (futbolistaData) => {
        this.futbolista = futbolistaData; // Asigna los datos del futbolista al componente
        if (typeof this.futbolista.posiciones[0] === 'string') {
          try {
            this.futbolista.posiciones = JSON.parse(this.futbolista.posiciones); // Convierte a array
            this.posiciones = this.futbolista.posiciones
          } catch (error) {
            console.error('Error al parsear posiciones:', error);
          }
        }
        console.log(typeof this.futbolista.posiciones[0])

        if (this.futbolista.clubActual) {
          // Llamada al servicio para obtener el perfil del club
          this.authService.getClub(this.futbolista.clubActual).subscribe(
            (clubData) => {
              this.futbolista.clubActual = clubData.nombre; // Reemplazar el ID por el nombre del club
            },
            (error) => {
              console.error('Error al obtener el perfil del club', error);
            }
          );
        }
      },
      (error) => {
        console.error('Error al obtener el perfil del futbolista', error);

        // Redirige al login y reemplaza la URL en el historial de navegación
        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['../../auth/login'], { replaceUrl: true }); // Reemplaza la URL en el historial
        }
      }
    );
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
