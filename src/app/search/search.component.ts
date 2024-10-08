import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../club/navbar.component';
import { DIVISIONES_FUTBOL_SENIOR } from '../const/categorias.const';
import { COMUNIDADES_AUTONOMAS } from '../const/comunidades.const';
import { ESPECIALIDADES_ENTRENADOR } from '../const/especialidades-entrenador.const';
import { PROVINCIAS_POR_COMUNIDAD } from '../const/provincias.const';
import { POSICIONES_FUTBOLISTAS } from '../const/posiciones-futbolista.const';
import { SearchService } from '../service/search/search.service';
import { Router } from '@angular/router';
import { ClubService } from '../club/club.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, NavbarComponent], // Asegúrate de importar CommonModule aquí
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  selectedProfileType: string = '';
  filtros: any = {};
  searchResults: any[] = [];
  searchPerformed: boolean = false; // Para saber si se ha realizado una búsqueda
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto si no tiene foto
  searchSubject = new Subject<string>();  // Para manejar el debounce
  clubSearchResults: any[] = [];  // Para almacenar los resultados de la búsqueda
  selectedClub: any = null;

  // Posiciones y especialidades según el tipo
  futbolistaPositions = POSICIONES_FUTBOLISTAS;
  entrenadorEspecialidades = ESPECIALIDADES_ENTRENADOR;
  clubCategorias: string[] = DIVISIONES_FUTBOL_SENIOR;
  comunidades: string[] = COMUNIDADES_AUTONOMAS;
  provincias: string[] = [];
  resultados: any[] = [];
  especialidadesEntrenador = ESPECIALIDADES_ENTRENADOR;
  //isFavorite: boolean = false;

  constructor(private searchService: SearchService, private router: Router, private clubService: ClubService) { }

  ngOnInit(): void {
    // Comprobar si hay filtros y tipo de perfil guardados en localStorage
    const savedFilters = localStorage.getItem('searchFilters');
    const savedProfileType = localStorage.getItem('profileType');

    if (savedFilters && savedProfileType) {
        this.filtros = JSON.parse(savedFilters);  // Aplicar los filtros guardados
        this.selectedProfileType = savedProfileType;  // Aplicar el tipo de perfil guardado
        this.buscar();  // Realizar la búsqueda con los filtros recuperados
    }

    // Configurar el debounce para la búsqueda de clubes
    this.searchSubject.pipe(
        debounceTime(300),  // Espera 300ms después de que el usuario deje de escribir
        switchMap(query => this.searchService.searchProfiles(query, 'club'))  // Cambia la búsqueda según el query
    ).subscribe(
        (results: any[]) => {
            this.clubSearchResults = results;  // Guarda los resultados
        },
        (error) => {
            console.error('Error al buscar clubes:', error);
        }
    );
}


  // Método que se activa al escribir en el campo de búsqueda
  onClubSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement?.value || '';

    if (query.length > 2) {
      this.searchSubject.next(query);  // Enviar el query al Subject con debounce
    } else {
      this.clubSearchResults = [];  // Si el query es muy corto, limpiar los resultados
    }
  }

  // Método para manejar la selección del club
  selectClub(club: any): void {
    this.selectedClub = club;  // Asignar el club seleccionado
    this.filtros['clubActual'] = club._id;  // Guardar el ID del club en los filtros
    this.clubSearchResults = [];  // Limpiar los resultados de búsqueda
  }

  // Cambiar filtros según el tipo de perfil seleccionado
  onProfileTypeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedProfileType = target.value;
    this.searchResults = [];
    this.searchPerformed = false;

    // Reiniciar filtros cada vez que cambie el tipo de perfil
    this.filtros = {};
  }

  // Método para obtener los valores de ESPECIALIDADES_ENTRENADOR
  getEspecialidadesKeys(): Array<keyof typeof ESPECIALIDADES_ENTRENADOR> {
    return Object.keys(this.entrenadorEspecialidades) as Array<keyof typeof ESPECIALIDADES_ENTRENADOR>;
  }

  getEspecialidadesLabels(especialidades: string[]): string {
    return especialidades
      .map(esp => this.especialidadesEntrenador[esp as keyof typeof this.especialidadesEntrenador])
      .join(', ');
  }

  getPosicionLabel(posicionKeys: string[]): string {
    if (!posicionKeys || posicionKeys.length === 0) {
      return 'Posición no definida';
    }

    return posicionKeys
      .map(posicionKey => {
        const posicion = this.futbolistaPositions.find(pos => pos.value === posicionKey);
        return posicion ? posicion.label : 'Posición no definida';
      })
      .join(', ');
  }


  // Filtrar provincias por comunidad seleccionada
  onComunidadChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const comunidadSeleccionada = target.value;
    this.provincias = PROVINCIAS_POR_COMUNIDAD[comunidadSeleccionada] || [];
    this.filtros['provincia'] = ''; // Reinicia la provincia cuando se cambia la comunidad
  }

  onFilterChange(filtro: string, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const value = target.value;

    // Guardar el filtro en el objeto `filtros`
    this.filtros[filtro] = value;

    console.log(`Filtro aplicado: ${filtro}, Valor: ${value}`);
  }

  buscar(): void {
    // Guardar filtros y tipo de perfil en localStorage
    localStorage.setItem('searchFilters', JSON.stringify(this.filtros));
    localStorage.setItem('profileType', this.selectedProfileType);

    this.searchService.applyFilters(this.selectedProfileType, this.filtros).subscribe(resultados => {
        this.searchResults = resultados;
        this.searchPerformed = true;

        // Comprobar si cada resultado es favorito
        this.searchResults.forEach(result => {
            this.clubService.isFavorite(result._id).subscribe(
                (response) => {
                    result.isFavorite = response.isFavorite; // Guardar el estado de favorito en el perfil
                },
                (error) => {
                    console.error(`Error al verificar si ${result.nombre} es favorito:`, error);
                }
            );
        });
    }, error => {
        console.error('Error al realizar la búsqueda:', error);
    });
}



  viewSearchProfile(result: any): void {
    const profileId = result._id;
    if (result.posiciones) {
      this.router.navigate([`/futbolista/perfil/${profileId}`]);
    } else if (result.especialidades) {
      this.router.navigate([`/entrenador/perfil/${profileId}`]);
    } else if (result.verificado) {
      this.router.navigate([`/club/perfil/${profileId}`]);
    }
  }

  // Toggle favorito sin que afecte el click en la card
  // toggleFavorite(event: Event, profile: any): void {
  //   event.stopPropagation();  // Evita que el click en el botón afecte el click en la tarjeta
  //   this.addOrRemoveFavorite(profile);
  // }

  addOrRemoveFavorite(profile: any): void {
    const profileId = profile._id;

    if (profile.isFavorite) {
      // Si ya es favorito, eliminarlo de favoritos
      this.clubService.removeFavorite(profileId).subscribe(
        () => {
          profile.isFavorite = false; // Actualizar el estado solo para este perfil
          console.log('Eliminado de favoritos');
        },
        (error) => {
          console.error('Error al eliminar de favoritos:', error);
        }
      );
    } else {
      // Si no es favorito, agregarlo a favoritos
      this.clubService.addFavorite(profileId).subscribe(
        () => {
          profile.isFavorite = true; // Actualizar el estado solo para este perfil
          console.log('Añadido a favoritos');
        },
        (error) => {
          console.error('Error al añadir a favoritos:', error);
        }
      );
    }
  }


  checkIfFavorite(futbolistaId: string): void {
    this.clubService.isFavorite(futbolistaId).subscribe(
      (response) => {
        return response.isFavorite;
      },
      (error) => {
        console.error('Error al verificar si es favorito:', error);
      }
    );
  }

  // Este método ahora maneja el estado de favorito individualmente para cada ítem
  toggleFavorite(result: any, event: Event): void {
    event.stopPropagation();  // Detiene la propagación del evento de clic
    if (!result.isFavorite) {
      // Si no es favorito, lo añadimos
      this.clubService.addFavorite(result._id).subscribe(
        () => {
          result.isFavorite = true;
          console.log(`${result.nombre} añadido a favoritos`);
        },
        (error) => {
          console.error('Error al añadir a favoritos:', error);
        }
      );
    } else {
      // Si ya es favorito, lo eliminamos
      this.clubService.removeFavorite(result._id).subscribe(
        () => {
          result.isFavorite = false;
          console.log(`${result.nombre} eliminado de favoritos`);
        },
        (error) => {
          console.error('Error al eliminar de favoritos:', error);
        }
      );
    }
  }


  // Al cargar los resultados de búsqueda, asegúrate de verificar si son favoritos
  // loadSearchResults(): void {
  //   this.searchService.applyFilters(this.selectedProfileType, this.filtros).subscribe(resultados => {
  //     this.searchResults = resultados.map(result => {
  //       // Verificar si el resultado es favorito
  //       this.clubService.isFavorite(result._id).subscribe(
  //         (response) => {
  //           result.isFavorite = response.isFavorite; // Guardar el estado de favorito en el perfil
  //         },
  //         (error) => {
  //           console.error('Error al verificar si es favorito:', error);
  //         }
  //       );
  //       return result;
  //     });
  //   });
  // }



}
