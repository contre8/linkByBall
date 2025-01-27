import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service'; // Asegúrate de que la ruta sea correcta
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log(email, password);

      // Intentar login como Futbolista
      this.authService.loginFutbolista(email, password).subscribe(
        response => {
          console.log('Login successful as Futbolista', response);
          this.router.navigate(['../futbolista/home']);
        },
        error => {
          console.error('Login as Futbolista failed, trying as Club', error);

          // Intentar login como Club
          this.authService.loginClub(email, password).subscribe(
            response => {
              console.log('Login successful as Club', response);
              this.router.navigate(['../club/home']);
            },
            error => {
              console.error('Login as Club failed, trying as Entrenador', error);

              // Intentar login como Entrenador
              this.authService.loginEntrenador(email, password).subscribe(
                response => {
                  console.log('Login successful as Entrenador', response);
                  this.router.navigate(['../entrenador/home']);
                },
                error => {
                  console.error('Login as Entrenador failed, trying as Administrador', error);

                  // Intentar login como Administrador
                  this.authService.loginAdministrador(email, password).subscribe(
                    response => {
                      console.log('Login successful as Administrador', response);
                      this.router.navigate(['../admin/home']);
                    },
                    error => {
                      console.error('Login as Administrador failed', error);
                      // Aquí podrías manejar el error general si todos los intentos fallan
                      alert('Email o Contraseña no válidos.');
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  }
}
