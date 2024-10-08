import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ESPECIALIDADES_ENTRENADOR } from '../../const/especialidades-entrenador.const';
import { EntrenadorService } from '../entrenador.service';

@Component({
  selector: 'app-profile-entrenador',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileEntrenadorComponent implements OnInit {
  entrenador: any;
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto si no tiene foto

  constructor(private authService: AuthService, private entrenadorService: EntrenadorService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.authService.getEntrenadorProfile().subscribe(
      (entrenadorData) => {
        this.entrenador = entrenadorData; // Asigna los datos del entrenador al componente
        this.entrenador.especialidades = this.entrenador.especialidades.map((especialidad: keyof typeof ESPECIALIDADES_ENTRENADOR) => ESPECIALIDADES_ENTRENADOR[especialidad]);
      },
      (error) => {
        console.error('Error al obtener el perfil del entrenador', error);
      }
    );
  }

  goToModifyProfile(): void {
    this.router.navigate(['/entrenador/modify-profile']); // Redirigir a la ruta de modificación
  }

  deleteProfile(): void {
    if (confirm('¿Estás seguro de que deseas eliminar tu perfil? Esta acción no se puede deshacer.')) {
      this.entrenadorService.deleteEntrenadorProfile().subscribe(
        response => {
          console.log('Perfil eliminado con éxito', response);
          this.router.navigate(['/']); // Redirigir a la página principal o donde prefieras
        },
        error => {
          console.error('Error al eliminar el perfil', error);
        }
      );
    }
  }
}
