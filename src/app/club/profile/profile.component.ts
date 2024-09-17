import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router'; // Importar RouterModule si utilizas navegación en tu componente

@Component({
  selector: 'app-profile-club',
  standalone: true,  // Aseguramos que el componente sea standalone
  imports: [CommonModule, RouterModule],  // Importa todos los módulos necesarios aquí
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileClubComponent implements OnInit {
  club: any;
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto si no tiene foto

  constructor(private authService: AuthService, private route: ActivatedRoute) {}

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
}
