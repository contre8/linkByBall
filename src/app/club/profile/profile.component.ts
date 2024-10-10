import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router'; // Importar RouterModule si utilizas navegación en tu componente
import { ClubService } from '../club.service';
import { NavbarComponent } from '../../navbar/navbar.component';


@Component({
  selector: 'app-profile-club',
  standalone: true,  // Aseguramos que el componente sea standalone
  imports: [CommonModule, RouterModule, NavbarComponent],  // Importa todos los módulos necesarios aquí
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileClubComponent implements OnInit {
  club: any;
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto si no tiene foto

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router, private clubService: ClubService) {}

  ngOnInit(): void {
    this.authService.getClubProfile().subscribe(
      (clubData) => {
        this.club = clubData; // Asigna los datos del club al componente
      },
      (error) => {
        console.error('Error al obtener el perfil del club', error);
      }
    );
  }
  goToModifyProfile(): void {
    this.router.navigate(['/club/modify-profile']); // Redirigir a la ruta de modificación del club
  }

  deleteProfile(): void {
    if (confirm('¿Estás seguro de que deseas eliminar el perfil del club? Esta acción no se puede deshacer.')) {
      this.clubService.deleteClubProfile().subscribe(
        response => {
          console.log('Perfil del club eliminado con éxito', response);
          this.router.navigate(['/']); // Redirigir a la página principal o donde prefieras
        },
        error => {
          console.error('Error al eliminar el perfil del club', error);
        }
      );
    }
  }

}
