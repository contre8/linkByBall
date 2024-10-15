import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-register-futbolista',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './register-futbolista.component.html',
  styleUrls: ['./register-futbolista.component.scss']
})
export class RegisterFutbolistaComponent implements OnInit {
  registerForm!: FormGroup;
  selectedPositions: string[] = [];
  clubs$: Observable<any[]> | undefined;
  positions = [
    { label: 'Portero', value: 'portero' },
    { label: 'Central (Diestro)', value: 'central_diestro' },
    { label: 'Central (Zurdo)', value: 'central_zurdo' },
    { label: 'Lateral (Diestro)', value: 'lateral_diestro' },
    { label: 'Lateral (Zurdo)', value: 'lateral_zurdo' },
    { label: 'Mediocentro Defensivo', value: 'mediocentro_defensivo' },
    { label: 'Interior (Diestro)', value: 'interior_diestro' },
    { label: 'Interior (Zurdo)', value: 'interior_zurdo' },
    { label: 'Mediapunta', value: 'mediapunta' },
    { label: 'Extremo (Diestro)', value: 'extremo_diestro' },
    { label: 'Extremo (Zurdo)', value: 'extremo_zurdo' },
    { label: 'Delantero Centro', value: 'delantero_centro' },
    { label: 'Carrilero (Diestro)', value: 'carrilero_diestro' },
    { label: 'Carrilero (Zurdo)', value: 'carrilero_zurdo' },
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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      edad: [null, [Validators.required, Validators.min(16)]], // Añadido campo edad con validación
      telefono: ['', [Validators.pattern('^[0-9]{9}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      fotografia: [null], // Si se requiere más adelante, habilitar
      clubActual: [null],
      categoriaActual: [{ value: '', disabled: true }],
      posiciones: [[], Validators.required],
      piernaDominante: ['', Validators.required],
      clubes: [[]],
      categorias: [[]],
      nacionalidad: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });

    this.clubs$ = this.authService.getClubs(); // Llama al servicio para obtener los clubes
  }


  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
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


  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = new FormData();
      formData.append('nombre', this.registerForm.get('nombre')?.value);
      formData.append('apellidos', this.registerForm.get('apellidos')?.value);
      formData.append('edad', this.registerForm.get('edad')?.value); // Asegúrate de enviar la edad
      formData.append('email', this.registerForm.get('email')?.value);
      formData.append('telefono', this.registerForm.get('telefono')?.value);
      formData.append('password', this.registerForm.get('password')?.value); // Aquí solo enviamos la contraseña

      // Si hay una fotografía seleccionada, añadirla
      const fileInput = this.registerForm.get('fotografia')?.value;
      if (fileInput) {
        formData.append('fotografia', fileInput);
      }

      // Añadir clubActual y categoriaActual si existen
      formData.append('piernaDominante', this.registerForm.get('piernaDominante')?.value);
      if (this.registerForm.get('clubActual')?.value !== null) {
        formData.append('clubActual', this.registerForm.get('clubActual')?.value);
        formData.append('categoriaActual', this.registerForm.get('categoriaActual')?.value);
      }

      // Añadir arrays de posiciones, clubes y categorías
      const posiciones = this.registerForm.get('posiciones')?.value;
      posiciones.forEach((posicion: string, index: number) => {
        formData.append(`posiciones[${index}]`, posicion);
      });
      const clubes = this.registerForm.get('clubes')?.value;
      clubes.forEach((club: string, index: number) => {
        formData.append(`clubes[${index}]`, club);
      });
      const categorias = this.registerForm.get('categorias')?.value;
      categorias.forEach((categoria: string, index: number) => {
        formData.append(`categorias[${index}]`, categoria);
      });

      formData.append('nacionalidad', this.registerForm.get('nacionalidad')?.value);

      // Llamada al servicio de autenticación para registrar al futbolista
      this.authService.registerFutbolista(formData).subscribe(
        response => {
          console.log('Registro exitoso', response);
          this.router.navigate(['/dashboard']);
        },
        error => {
          console.error('Error en el registro', error);
        }
      );
    }
  }

  onPositionChange(event: any) {
    const position = event.target.value;

    if (event.target.checked) {
      this.selectedPositions.push(position);
    } else {
      const index = this.selectedPositions.indexOf(position);
      if (index > -1) {
        this.selectedPositions.splice(index, 1);
      }
    }

    this.registerForm.get('posiciones')?.setValue(this.selectedPositions);
  }


  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.registerForm.get('fotografia')?.setValue(file);
    }
  }

  onCheckboxChange(event: any) {
    const selectedPositions = this.registerForm.get('posiciones')?.value as string[];
    const value = event.target.value;

    if (event.target.checked) {
      // Añadir la posición seleccionada
      selectedPositions.push(value);
      console.log(selectedPositions)
    } else {
      // Eliminar la posición si ya estaba seleccionada
      const index = selectedPositions.indexOf(value);
      if (index >= 0) {
        selectedPositions.splice(index, 1);
      }
    }

    // Actualizar el valor del campo "posiciones" en el formulario
    this.registerForm.get('posiciones')?.setValue(selectedPositions);
  }

}
