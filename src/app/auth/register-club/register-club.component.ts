import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service'; // Ajusta la ruta si es necesario
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { COMUNIDADES_AUTONOMAS } from '../../const/comunidades.const';
import { PROVINCIAS_POR_COMUNIDAD } from '../../const/provincias.const';
import { DIVISIONES_FUTBOL_SENIOR } from '../../const/categorias.const';


@Component({
  selector: 'app-register-club',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './register-club.component.html',
  styleUrls: ['./register-club.component.scss']
})
export class RegisterClubComponent implements OnInit {
  registerForm!: FormGroup;
  comunidades = COMUNIDADES_AUTONOMAS;
  provincias: string[] = [];
  selectedComunidad: string = '';
  categorias = DIVISIONES_FUTBOL_SENIOR;
  isRegistering: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern('^[0-9]{9}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      fotografia: [null], // Campo para fotografía
      categoria: ['', Validators.required],
      comunidad: ['', Validators.required],
      provincia: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isRegistering = true;
      const formData = new FormData();
      // Excluir "fotografia" del loop y añadirla manualmente después
      Object.entries(this.registerForm.value).forEach(([key, value]) => {
        if (key !== 'fotografia') { // Excluir la fotografía del loop
          formData.append(key, value as string);
        }
      });

      // Añadir la fotografía solo si existe
      const fileInput = this.registerForm.get('fotografia')?.value;
      if (fileInput) {
        formData.append('fotografia', fileInput);
      }

      const email = this.registerForm.get('email')?.value;
      const password = this.registerForm.get('password')?.value;

      this.authService.registerClub(formData).subscribe(
        response => {
          this.authService.loginClub(email, password).subscribe(
            loginResponse => {
              console.log('Login successful as Club', loginResponse);
              this.isRegistering = false;
              this.router.navigate(['../club/home']);
            },
            loginError => {
              console.error('Login as Club failed', loginError);
            }
          );
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

  onComunidadChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const comunidad = target.value;

    // Obtener provincias y ordenarlas alfabéticamente
    this.provincias = (PROVINCIAS_POR_COMUNIDAD[comunidad] || []).sort((a, b) => a.localeCompare(b));
  }

  // Escuchar el evento de retroceso del navegador (back button)
  @HostListener('window:popstate', ['$event'])
  onPopState(event: Event) {
    // Redirigir a la URL deseada cuando se presiona la flecha "volver"
    this.router.navigate(['../user-selection']);
  }
}
