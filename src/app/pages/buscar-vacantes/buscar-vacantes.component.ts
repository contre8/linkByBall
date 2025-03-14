import { SolicitudService } from './../../service/solicitudes/solicitudes.service';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../service/search/search.service';
import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { OnInit } from '@angular/core';
import { POSICIONES_FUTBOLISTAS } from '../../const/posiciones-futbolista.const';
import { ESPECIALIDADES_ENTRENADOR } from '../../const/especialidades-entrenador.const';
import { COMUNIDADES_AUTONOMAS } from '../../const/comunidades.const';
import { DIVISIONES_FUTBOL_SENIOR } from '../../const/categorias.const';
import { PROVINCIAS_POR_COMUNIDAD } from '../../const/provincias.const';
import { VacantesService } from '../../service/vacantes/vacantes.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../service/auth/auth.service';


interface Vacante {
  destinatario: string;
  posicion: string;
  descripcion: string;
  salario: number;
}

interface Club {
  nombreClub: string;
  clubId: string;
  vacanteId: string;
  fotografiaUrl: string;
  categoria: string;
  vacantes: Vacante[];
  destinatario: string;
  posicion: string;
  descripcion: string;
  salario: number;
}
@Component({
  selector: 'app-buscar-vacantes',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './buscar-vacantes.component.html',
  styleUrl: './buscar-vacantes.component.scss'
})

export class BuscarVacantesComponent implements OnInit {
  //userType: string | null = localStorage.getItem('userType');  // Obtén el valor de userType desde localStorage
  futbolistaPositions = [
    { label: 'Portero', value: 'portero' },
    { label: 'Central Diestro', value: 'central_diestro' },
    { label: 'Central Zurdo', value: 'central_zurdo' },
    { label: 'Lateral Diestro', value: 'lateral_diestro' },
    { label: 'Lateral Zurdo', value: 'lateral_zurdo' },
    { label: 'Mediocentro Defensivo', value: 'mediocentro_defensivo' },
    { label: 'Interior Diestro', value: 'interior_diestro' },
    { label: 'Interior Zurdo', value: 'interior_zurdo' },
    { label: 'Mediapunta', value: 'mediapunta' },
    { label: 'Extremo Diestro', value: 'extremo_diestro' },
    { label: 'Extremo Zurdo', value: 'extremo_zurdo' },
    { label: 'Delantero Centro', value: 'delantero_centro' },
    { label: 'Carrilero Diestro', value: 'carrilero_diestro' },
    { label: 'Carrilero Zurdo', value: 'carrilero_zurdo' },
  ];
  //especialidadesEntrenador = ESPECIALIDADES_ENTRENADOR;  // Especialidades para entrenadores
  comunidades = COMUNIDADES_AUTONOMAS;  // Comunidades autónomas para el filtro
  categorias = DIVISIONES_FUTBOL_SENIOR;  // Categorías de club
  //provincias = PROVINCIAS_POR_COMUNIDAD;
  vacantes: Club[] = [];  // Define correctamente el tipo de vacantes como un array de Club
  provincias: string[] = [];
  searchSubject = new Subject<string>();  // Para manejar el debounce
  clubSearchResults: any[] = [];  // Para almacenar los resultados de la búsqueda
  selectedClub: any = null;
  showClubResults: boolean = false;
  userType: string = localStorage.getItem('userType') || ''; // Si es null, asigna una cadena vacía
  currentPage: number = 1;
  resultsPerPage: number = 12;
  total: number = 1;
  limit: number = 12;
  totalPages: number = 0;
  especialidadesEntrenador: { [key: string]: string } = {
    primer_entrenador: 'Primer Entrenador',
    segundo_entrenador: 'Segundo Entrenador',
    preparador_fisico: 'Preparador Físico',
    entrenador_porteros: 'Entrenador de Porteros',
    analista: 'Analista',
    fisioterapeuta: 'Fisioterapeuta',
    utillero: 'Utillero',
    nutricionista: 'Nutricionista',
    psicologo: 'Psicólogo Deportivo'
  };

  userId: string = '';
  filtros: any = {};
  searchResults: any[] = [];
  solicitudes: any[] = [];
  searchPerformed: boolean = false;
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto si no tiene foto
  solicitudesEnviadas: Set<string> = new Set(); // Usar un Set para almacenar los IDs de vacantes con solicitudes enviadas

  constructor(
    private vacantesService: VacantesService,
    private searchService: SearchService,
    private solicitudService: SolicitudService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.getProfile().subscribe(
      (userData) => {
        this.userId = userData._id;
        this.solicitudes = userData.solicitudes;
      },
      (error) => {
        console.error('Error al obtener el perfil del usuario', error);
      }
    );
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
    if (sessionStorage.getItem('search')) {
      //this.filtros['nombreClub'] = club._id;
    }
    this.buscar();
  }

  // Actualizar filtros cuando cambia algún valor en los inputs
  onFilterChange(filtro: string, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    this.filtros[filtro] = target.value;
  }

  buscar(): void {
    this.vacantesService.filtrarVacantes(this.filtros, this.currentPage, this.limit, this.userType).subscribe(
      (resultados) => {
        this.vacantes = resultados.resultados.map((vacante: {
          club: { nombre: string; categoria: string; fotografia: { url: string }; _id: string };
          destinatario: string;
          posicion: string;
          descripcion: string;
          salario: number;
          _id: string;
        }) => {
          return {
            vacanteId: vacante._id,
            clubId: vacante.club._id,
            nombreClub: vacante.club.nombre,
            categoria: vacante.club.categoria,
            fotografiaUrl: vacante.club.fotografia?.url,
            destinatario: vacante.destinatario,
            posicion: vacante.posicion,
            descripcion: vacante.descripcion || 'No disponible',
            salario: vacante.salario || 'No especificado'
          };
        });

        // Actualizar la información de paginación
        this.total = resultados.total;
        this.limit = resultados.limit;
        this.totalPages = Math.ceil(this.total / this.limit); // Calcular total de páginas
        this.searchPerformed = true;
      },
      (error) => {
        console.error('Error al buscar vacantes', error);
      }
    );
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.buscar(); // Vuelve a realizar la búsqueda para la nueva página
    }
  }

  // Método para verificar si ya se ha enviado una solicitud a la vacante
  haEnviadoSolicitud(vacanteId: string): boolean {
    if (this.solicitudesEnviadas.has(vacanteId)) {
      return true;
    }
    return this.solicitudes.some(solicitud => solicitud.vacante === vacanteId);
  }

  // Navegar al perfil del resultado
  verPerfil(result: any): void {
    // Navega a la página del perfil del equipo
  }

  getEspecialidadesKeys(): string[] {
    return Object.keys(this.especialidadesEntrenador);
  }

  onComunidadChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const comunidadSeleccionada = target.value;
    this.provincias = PROVINCIAS_POR_COMUNIDAD[comunidadSeleccionada] || [];
    this.filtros['comunidad'] = comunidadSeleccionada;
    this.filtros['provincia'] = ''; // Reinicia la provincia cuando se cambia la comunidad
  }

  // Método que se activa al escribir en el campo de búsqueda
  onClubSearch(event: Event): void {
    let search = '';
    const inputElement = event.target as HTMLInputElement;
    if (sessionStorage.getItem('search')) {
      let search = sessionStorage.getItem('search');
    }
    const query = inputElement?.value || search;

    if (query.length > 2) {
      this.searchSubject.next(query);  // Enviar el query al Subject con debounce
    } else {
      this.clubSearchResults = [];  // Si el query es muy corto, limpiar los resultados
    }
  }

  // Método para manejar la selección del club
  selectClub(club: any): void {
    this.selectedClub = club;  // Asignar el club seleccionado
    this.filtros['nombreClub'] = club._id;  // Guardar el ID del club en los filtros
    this.clubSearchResults = [];  // Limpiar los resultados de búsqueda
    this.showClubResults = false; // Cerrar el desplegable
  }

  hideClubResults(): void {
    setTimeout(() => {
      this.showClubResults = false;
    }, 200);  // Espera un poco antes de ocultar los resultados para permitir la selección
  }

  mandarSolicitud(vacante: any): void {
    this.solicitudesEnviadas.add(vacante.vacanteId);

    const solicitudData = {
      solicitante: {
        id: this.userId, // ID del solicitante (futbolista o entrenador)
        tipo: this.userType // Tipo del solicitante
      },
      club: vacante.clubId, // ID del club al que pertenece la vacante
      vacante: vacante.vacanteId, // ID de la vacante a la que se aplica
      fecha: new Date(), // Fecha de la solicitud
      estado: 'Pendiente' // Estado inicial de la solicitud
    };

    // Enviar la solicitud al servidor
    this.solicitudService.createSolicitud(solicitudData).subscribe(
      (response) => {
        alert('¡Solicitud enviada con éxito!');
        this.haEnviadoSolicitud(solicitudData.vacante)
      },
      (error) => {
        alert('Hubo un problema al enviar la solicitud.');
      }
    );
  }

  // goToPage(page: number): void {
  //   if (page >= 1 && page <= this.totalPages) {
  //     this.buscar(page);  // Llamar a la búsqueda con la página seleccionada
  //   }
  // }

  setPage(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    this.vacantes = this.searchResults.slice(startIndex, endIndex);
  }

  // get totalPages(): number {
  //   return Math.ceil(this.total / this.limit);
  // }
}

