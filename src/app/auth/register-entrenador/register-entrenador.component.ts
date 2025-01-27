import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { SearchService } from '../../service/search/search.service';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-register-entrenador',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './register-entrenador.component.html',
  styleUrls: ['./register-entrenador.component.scss']
})
export class RegisterEntrenadorComponent implements OnInit {
  registerForm!: FormGroup;
  clubs$: Observable<any[]> | undefined;
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto si no tiene foto
  searchSubject = new Subject<string>();  // Para manejar el debounce
  clubSearchResults: any[] = [];  // Para almacenar los resultados de la búsqueda
  showClubResults: boolean = false;
  selectedClub: any; // Añadir esta línea en la declaración de propiedades del componente
  isRegistering: boolean = false;
  especialidades = [
    { label: 'Primer Entrenador', value: 'primer_entrenador' },
    { label: 'Segundo Entrenador', value: 'segundo_entrenador' },
    { label: 'Peparador Físico', value: 'preparador_fisico' },
    { label: 'Entrenador de Porteros', value: 'entrenador_porteros' },
    { label: 'Analista Táctico', value: 'analista' },
    { label: 'Fisioterapeuta', value: 'fisioterapeuta' },
    { label: 'Utillero', value: 'utillero' },
    { label: 'Nutricionista', value: 'nutricionista' },
    { label: 'Psicólogo Deportivo', value: 'psicologo' },
  ];
  categories = [
    'Primera División',
    'Segunda División',
    'Primera RFEF',
    'Segunda RFEF',
    'Tercera RFEF'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      edad: [null, [Validators.required, Validators.min(16)]],
      telefono: ['', [Validators.pattern('^[0-9]{9}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      fotografia: [null], // Imagen opcional
      clubActual: [null],
      categoriaActual: [{ value: '', disabled: true }],
      especialidades: [[], Validators.required], // Especialidades del entrenador
      clubesEspecialidad: [[]], // Clubes anteriores
      categoriasEspecialidad: [[]],
      nacionalidad: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });

    this.clubs$ = this.authService.getClubs(); // Obtener clubes

    this.searchSubject.pipe(
      debounceTime(300),  // Espera 300ms después de que el usuario deje de escribir
      switchMap(query => this.searchService.searchProfiles(query, 'club'))  // Cambia la búsqueda según el query
    ).subscribe(
      (results: any[]) => {
        this.clubSearchResults = results;  // Guarda los resultados
        console.log(this.clubSearchResults)
      },
      (error) => {
        console.error('Error al buscar clubes:', error);
      }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isRegistering = true;
      const formData = new FormData();
      formData.append('nombre', this.registerForm.get('nombre')?.value);
      formData.append('apellidos', this.registerForm.get('apellidos')?.value);
      formData.append('edad', this.registerForm.get('edad')?.value);
      formData.append('email', this.registerForm.get('email')?.value);
      formData.append('telefono', this.registerForm.get('telefono')?.value);
      formData.append('password', this.registerForm.get('password')?.value);
      const fileInput = this.registerForm.get('fotografia')?.value;
      if (fileInput) {
        formData.append('fotografia', fileInput);
      }
      const especialidades = this.registerForm.get('especialidades')?.value;
      especialidades.forEach((especialidad: string) => {
        formData.append('especialidades[]', especialidad);
      });
      const clubActual = this.registerForm.get('clubActual')?.value;
      if (clubActual) {
        formData.append('clubActual', clubActual);
      }
      const categoriaActual = this.registerForm.get('categoriaActual')?.value;
      if (categoriaActual) {
        formData.append('categoriaActual', categoriaActual);
      }
      formData.append('clubesEspecialidad', JSON.stringify(this.registerForm.get('clubesEspecialidad')?.value));
      formData.append('categoriasEspecialidad', JSON.stringify(this.registerForm.get('categoriasEspecialidad')?.value));
      formData.append('nacionalidad', this.registerForm.get('nacionalidad')?.value);

      const email = this.registerForm.get('email')?.value;
      const password = this.registerForm.get('password')?.value;

      this.authService.registerEntrenador(formData).subscribe(
        response => {
          this.authService.loginEntrenador(email, password).subscribe(
            loginResponse => {
              console.log('Login successful as Entrenador', loginResponse);
              this.isRegistering = false;
              this.router.navigate(['../entrenador/home']);
            },
            loginError => {
              console.error('Login as Entrenador failed', loginError);
            }
          );
        },
        error => {
          console.error('Error en el registro', error);
        }
      );
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.registerForm.get('fotografia')?.setValue(file);
    }
  }
  onClubChange() {
    const clubId = this.registerForm.get('clubActual')?.value;
    //console.log(clubId);
    if (clubId) {
      this.authService.getClubCategory(clubId).subscribe(
        category => {
          this.registerForm.get('categoriaActual')?.setValue(category.category);
        },
        error => {
          console.error('Error al obtener la categoría del club', error);
        }
      );
    } else {
      console.error('El clubId es undefined, no se puede obtener la categoría del club');
    }
  }

  onCheckboxChange(event: any) {
    const selectedSpecialities = this.registerForm.get('especialidades')?.value as string[];
    const value = event.target.value;

    if (event.target.checked) {
      // Añadir la especialidad seleccionada
      selectedSpecialities.push(value);
    } else {
      // Eliminar la especialidad si ya estaba seleccionada
      const index = selectedSpecialities.indexOf(value);
      if (index >= 0) {
        selectedSpecialities.splice(index, 1);
      }
    }

    // Actualizar el valor del campo "especialidades" en el formulario
    this.registerForm.get('especialidades')?.setValue(selectedSpecialities);
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
    this.registerForm.get('clubActual')?.setValue(club._id);
    this.registerForm.get('categoriaActual')?.setValue(club.categoria);  // Guardar el ID del club en el formulario
    this.clubSearchResults = [];  // Limpiar los resultados de búsqueda
    this.showClubResults = false; // Cerrar el desplegable
  }


  hideClubResults(): void {
    setTimeout(() => {
      this.showClubResults = false;
    }, 200);  // Espera un poco antes de ocultar los resultados para permitir la selección
  }
}
