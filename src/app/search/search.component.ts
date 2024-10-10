import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
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
import { AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Asegúrate de importar FormsModule


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule], // Asegúrate de importar CommonModule aquí
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit {
  selectedProfileType: string = '';
  filtros: any = {};
  searchResults: any[] = [];
  searchPerformed: boolean = false; // Para saber si se ha realizado una búsqueda
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto si no tiene foto
  searchSubject = new Subject<string>();  // Para manejar el debounce
  clubSearchResults: any[] = [];  // Para almacenar los resultados de la búsqueda
  selectedClub: any = null;
  showClubResults: boolean = false;
  paginatedResults: any[] = [];
  totalResults: number = 0;
  currentPage: number = 1;
  resultsPerPage: number = 10;
  totalPages: number = 1;
  pages: number[] = [];

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

  ngAfterViewInit(): void {
    // Llamamos al método aquí para asegurarnos de que el DOM está cargado
    this.populateFormFields();
  }

  ngOnInit(): void {
    // Comprobar si hay filtros y tipo de perfil guardados en localStorage
    const savedFilters = sessionStorage.getItem('searchFilters');
    const savedProfileType = sessionStorage.getItem('profileType');

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
    this.showClubResults = false; // Cerrar el desplegable
  }

  hideClubResults(): void {
    setTimeout(() => {
      this.showClubResults = false;
    }, 200);  // Espera un poco antes de ocultar los resultados para permitir la selección
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

  populateFormFields(): void {
    // Futbolista
    console.log(this.selectedProfileType, this.filtros)
    if (this.selectedProfileType === 'futbolista') {
      // Nombre
      console.log('ENtraa')
      const nombreInput = document.querySelector('input[placeholder="Nombre"]') as HTMLInputElement;
      console.log(nombreInput, this.filtros['nombre'])
      if (nombreInput && this.filtros['nombre']) {
        nombreInput.value = this.filtros['nombre'];
        console.log(nombreInput.value)
      }

      // Posición
      const posicionSelect = document.querySelector('select[placeholder="Cualquier posición"]') as HTMLSelectElement;
      if (posicionSelect && this.filtros['posicion']) {
        posicionSelect.value = this.filtros['posicion'];
      }

      // Club Actual
      const clubInput = document.querySelector('input[placeholder="Buscar club"]') as HTMLInputElement;
      if (clubInput && this.selectedClub && this.selectedClub.nombre) {
        clubInput.value = this.selectedClub.nombre;
      }

      // Categoría Actual
      const categoriaSelect = document.querySelector('select[placeholder="Cualquier categoría"]') as HTMLSelectElement;
      if (categoriaSelect && this.filtros['categoriaActual']) {
        categoriaSelect.value = this.filtros['categoriaActual'];
      }

      // Edad mínima y máxima
      const edadMinInput = document.querySelector('input[placeholder="Edad mínima"]') as HTMLInputElement;
      const edadMaxInput = document.querySelector('input[placeholder="Edad máxima"]') as HTMLInputElement;
      if (edadMinInput && this.filtros['edadMin']) {
        edadMinInput.value = this.filtros['edadMin'];
      }
      if (edadMaxInput && this.filtros['edadMax']) {
        edadMaxInput.value = this.filtros['edadMax'];
      }

      // Pierna Dominante
      const piernaSelect = document.querySelector('select[placeholder="Cualquiera"]') as HTMLSelectElement;
      if (piernaSelect && this.filtros['piernaDominante']) {
        piernaSelect.value = this.filtros['piernaDominante'];
      }

      // Nacionalidad
      const nacionalidadInput = document.querySelector('input[placeholder="País"]') as HTMLInputElement;
      if (nacionalidadInput && this.filtros['nacionalidad']) {
        nacionalidadInput.value = this.filtros['nacionalidad'];
      }
    }

    // Entrenador
    if (this.selectedProfileType === 'entrenador') {
      // Nombre
      const nombreInput = document.querySelector('input[placeholder="Buscar por nombre"]') as HTMLInputElement;
      if (nombreInput && this.filtros['nombre']) {
        nombreInput.value = this.filtros['nombre'];
      }

      // Especialidad
      const especialidadSelect = document.querySelector('select[placeholder="Cualquier especialidad"]') as HTMLSelectElement;
      if (especialidadSelect && this.filtros['especialidad']) {
        especialidadSelect.value = this.filtros['especialidad'];
      }

      // Años de experiencia
      const experienciaInput = document.querySelector('input[placeholder="Años mínimos"]') as HTMLInputElement;
      if (experienciaInput && this.filtros['experienciaMin']) {
        experienciaInput.value = this.filtros['experienciaMin'];
      }

      // Edad mínima y máxima
      const edadMinInput = document.querySelector('input[placeholder="Edad mínima"]') as HTMLInputElement;
      const edadMaxInput = document.querySelector('input[placeholder="Edad máxima"]') as HTMLInputElement;
      if (edadMinInput && this.filtros['edadMin']) {
        edadMinInput.value = this.filtros['edadMin'];
      }
      if (edadMaxInput && this.filtros['edadMax']) {
        edadMaxInput.value = this.filtros['edadMax'];
      }

      // Club Actual
      const clubInput = document.querySelector('input[placeholder="Buscar club"]') as HTMLInputElement;
      if (clubInput && this.selectedClub && this.selectedClub.nombre) {
        clubInput.value = this.selectedClub.nombre;
      }
    }

    // Club
    if (this.selectedProfileType === 'club') {
      // Nombre
      const nombreInput = document.querySelector('input[placeholder="Buscar por nombre"]') as HTMLInputElement;
      if (nombreInput && this.filtros['nombre']) {
        nombreInput.value = this.filtros['nombre'];
      }

      // Categoría
      const categoriaSelect = document.querySelector('select[placeholder="Cualquier categoría"]') as HTMLSelectElement;
      if (categoriaSelect && this.filtros['categoria']) {
        categoriaSelect.value = this.filtros['categoria'];
      }

      // Comunidad
      // Para el campo de comunidad
      const comunidadSelect = document.querySelector('select[ngModel="filtros.comunidad"]') as HTMLSelectElement;
      if (comunidadSelect && this.filtros.comunidad) {
        this.filtros['comunidad'] = this.filtros.comunidad;
        comunidadSelect.value = this.filtros.comunidad;

        // Llama a onComunidadChange para cargar las provincias correspondientes
        this.onComunidadChange({ target: { value: this.filtros.comunidad } } as any);

        // Después de cargar las provincias, asignar la provincia guardada
        const provinciaSelect = document.querySelector('select[ngModel="filtros.provincia"]') as HTMLSelectElement;
        if (provinciaSelect && this.filtros.provincia) {
          this.filtros['provincia'] = this.filtros.provincia;
          provinciaSelect.value = this.filtros.provincia;
        }
      }
    }
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

  buscar(page: number = 1): void {
    // Guardar filtros y tipo de perfil en sessionStorage
    sessionStorage.setItem('searchFilters', JSON.stringify(this.filtros));
    sessionStorage.setItem('profileType', this.selectedProfileType);

    // Realizar la búsqueda con paginación
    this.searchService.applyFilters(this.selectedProfileType, this.filtros, page, this.resultsPerPage).subscribe(response => {
      this.searchResults = response.resultados;
      this.searchPerformed = true;

      this.totalResults = response.total;
      this.currentPage = response.page;
      this.resultsPerPage = response.limit;
      this.totalPages = Math.ceil(this.totalResults / this.resultsPerPage);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

      console.log(this.searchResults)

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

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.buscar(page);  // Llamar a la búsqueda con la página seleccionada
    }
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
