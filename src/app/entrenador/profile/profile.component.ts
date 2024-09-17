import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ESPECIALIDADES_ENTRENADOR } from '../../const/especialidades-entrenador.const';

@Component({
  selector: 'app-profile-entrenador',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileEntrenadorComponent implements OnInit {
  entrenador: any;
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto si no tiene foto

  constructor(private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.authService.getEntrenadorProfile().subscribe(
      (entrenadorData) => {
        this.entrenador = entrenadorData; // Asigna los datos del entrenador al componente
        this.entrenador.especialidades = this.entrenador.especialidades.map((especialidad: keyof typeof ESPECIALIDADES_ENTRENADOR) => ESPECIALIDADES_ENTRENADOR[especialidad]);
        console.log(this.entrenador.especialidades)

        if (this.entrenador.clubActual) {
          // Llamada al servicio para obtener el club actual
          this.authService.getClub(this.entrenador.clubActual).subscribe(
            (clubData) => {
              this.entrenador.clubActual = clubData.nombre; // Reemplaza el ID por el nombre del club
              this.entrenador.categoriaActual = clubData.categoria
            },
            (error) => {
              console.error('Error al obtener el club del entrenador', error);
            }
          );
        }
      },
      (error) => {
        console.error('Error al obtener el perfil del entrenador', error);
      }
    );
  }
}
