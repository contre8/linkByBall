import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../../service/search/search.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { forkJoin } from 'rxjs';
import { AuthService } from '../../service/auth/auth.service';
import { AvisosService } from '../../service/avisos/avisos.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [CommonModule, FormsModule]
})

export class NavbarComponent {
  searchResults: any[] = [];
  private searchSubject = new Subject<string>();
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto si no tiene foto
  isSearchActive: boolean = false; // Variable para mostrar u ocultar los resultados
  profilePictureUrl: string | undefined;
  userId: string = '';
  userType: string | null = localStorage.getItem('userType'); // Obtén el valor de localStorage directamente al declarar
  isAdmin: boolean = false;
  avisos: boolean = false;
  selectedSearchType: string = '';
  searchQuery: string = ''; // Para almacenar la entrada de búsqueda

  constructor(private router: Router, private searchService: SearchService, private authService: AuthService, private avisosService: AvisosService) { }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    if (this.userType === 'admin') {
      this.isAdmin = true;
    }
    const storedSearchType = sessionStorage.getItem('selectedSearchType');
    if (storedSearchType) {
      this.selectedSearchType = storedSearchType;
    }
    this.authService.getProfile().subscribe(profile => {
      this.profilePictureUrl = profile.fotografia?.url; // O la forma en la que obtienes la URL de la foto de perfil
      this.userId = profile._id;
      this.cargarAvisos(this.userId);
    });
    this.searchSubject.pipe(
      debounceTime(300), // Espera 300ms después de que el usuario deja de escribir
      distinctUntilChanged(), // Evita ejecutar la búsqueda si el término es el mismo que antes
      switchMap((query: string) => {
        return forkJoin([
          this.searchService.searchProfiles(query, 'futbolista'),
          this.searchService.searchProfiles(query, 'entrenador'),
          this.searchService.searchProfiles(query, 'club')
        ]);
      })
    ).subscribe(([futbolistas, entrenadores, clubs]) => {
      // Filtrar resultados para excluir los que coincidan con this.userId y aplicar la lógica de verificado
      this.searchResults = [
        ...futbolistas.filter((result: { _id: string; verificado?: boolean }) =>
          result._id !== this.userId && (result.verificado === true || result.verificado === undefined)
        ),
        ...entrenadores.filter((result: { _id: string; verificado?: boolean }) =>
          result._id !== this.userId && (result.verificado === true || result.verificado === undefined)
        ),
        ...clubs.filter((result: { _id: string; verificado?: boolean }) =>
          result._id !== this.userId && (result.verificado === true || result.verificado === undefined)
        )
      ];
    });

  }

  goHome(): void {
    sessionStorage.clear();
    const userType = localStorage.getItem('userType');
    this.router.navigate([`${userType}/home`]);
  }


  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    if (this.searchQuery) {
      sessionStorage.setItem('search', this.searchQuery); // Guardar el valor buscado en sessionStorage
    } else {
      sessionStorage.removeItem('search'); // Eliminar 'search' si no hay valor
    }
  }

  performSearch(): void {
    // Guardar el tipo de búsqueda en sessionStorage
    if (this.selectedSearchType) {
      sessionStorage.setItem('selectedSearchType', this.selectedSearchType);
    }

    if (this.searchQuery) {
      sessionStorage.setItem('search', this.searchQuery);
    } else {
      sessionStorage.removeItem('search');
      sessionStorage.removeItem('searchFilters');
    }

    // Redirigir basado en el tipo seleccionado
    switch (this.selectedSearchType) {
      case 'vacantes':
        this.router.navigate([`${this.userType}/buscar-equipo`]);
        break;
      case 'futbolista':
      case 'entrenador':
      case 'club':
        window.location.href = '/buscador'; // Forzar recarga completa de la página
        break;
      default:
        console.warn('Tipo de búsqueda no reconocida');
    }
  }

  viewSearchProfile(result: any): void {
    const profileId = result._id;
    if (result.posiciones) {
      this.router.navigate([`/futbolista/perfil/${profileId}`]);
    } else if (result.especialidades) {
      this.router.navigate([`/entrenador/perfil/${profileId}`]);
    } else if (result.verificado) { // Asegúrate de que 'nombreClub' es la propiedad que indica que es un club
      this.router.navigate([`/club/perfil/${profileId}`]);
    }
  }


  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-container')) {
      this.isSearchActive = false; // Ocultar la lista de resultados si se hace clic fuera del contenedor de búsqueda
    }
  }

  myVacantes(): void {
    sessionStorage.clear();
    this.router.navigate(['club/vacantes-dashboard']);
  }

  mySolicitudes(): void {
    sessionStorage.clear();
    this.router.navigate([`${this.userType}/mis-solicitudes`]);
  }

  buscarEquipo() {
    sessionStorage.clear();
    this.router.navigate([`${this.userType}/buscar-equipo`]);
  }

  goToFavorites(): void {
    sessionStorage.clear();
    this.router.navigate([`${this.userType}/favoritos`]);
  }


  searchProfiles(): void {
    this.router.navigate(['buscador']);
  }

  viewNotifications(): void {
    sessionStorage.clear();
    this.router.navigate(['mis-avisos']);
  }

  openChat(): void {
    sessionStorage.clear();
    this.router.navigate(['chat']);
  }

  viewProfile(): void {
    sessionStorage.clear();
    this.router.navigate([`${this.userType || 'error'}/perfil`]);
  }

  logout(): void {
    const confirmLogout = window.confirm('¿Estás seguro de que deseas cerrar sesión?');
    if (confirmLogout) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userType');
      sessionStorage.removeItem('profileType');
      sessionStorage.removeItem('searchFilters');
      this.router.navigate(['auth/login']);
    }
  }

  cargarAvisos(userId: string): void {
    if (userId) {
      this.avisosService.getAvisos(userId).subscribe(
        (data) => {
          if (data && Array.isArray(data)) {
            const hayAvisosNoVistos = data.some((aviso) => !aviso.visto);
            if (hayAvisosNoVistos) {
              this.avisos = true;  // Si hay avisos no vistos, poner avisos a true
            } else {
              this.avisos = false;  // Si todos los avisos están vistos, avisos a false
            }
          }
        },
        (error) => {
          console.error('Error al cargar los avisos:', error);
        }
      );
    } else {
      console.error('No se pudo obtener el ID del usuario');
    }
  }

}
