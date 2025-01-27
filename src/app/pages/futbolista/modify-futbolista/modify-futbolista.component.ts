import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FutbolistaService } from '../../../service/futbolista/futbolista.service'; // Usa tu nuevo servicio
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importar CommonModule si es necesario
import { RouterModule } from '@angular/router'; // Importar RouterModule si necesitas redirigir
import { AuthService } from '../../../service/auth/auth.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-edit-futbolista',
  templateUrl: './modify-futbolista.component.html',
  styleUrls: ['./modify-futbolista.component.scss'],
  standalone: true, // Indicamos que el componente es standalone
  imports: [ReactiveFormsModule, CommonModule, RouterModule] // Importamos los módulos necesarios
})
export class ModifyFutbolistaComponent implements OnInit {
  futbolistaForm!: FormGroup;
  defaultPicture: string = '../../../../default-picture-profile.jpg'; // Imagen por defecto si no tiene foto
  futbolista: any;
  clubs$: Observable<any[]> | undefined;
  posiciones: string[] = []; // Para almacenar las posiciones desde la base de datos
  selectedFile: File | null = null;
  selectedImageUrl: string | ArrayBuffer | null = null;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private futbolistaService: FutbolistaService, // Inyectar el servicio de futbolista
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Inicializar el formulario con validaciones
    this.futbolistaForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.pattern('^[0-9]{9}$')],
      edad: ['', Validators.required],
      fotografia: [null],
      nacionalidad: ['', Validators.required],
      clubActual: [''],
      categoriaActual: [''],
      posiciones: this.fb.array([]), // Puedes añadir validaciones o valores por defecto
      piernaDominante: ['', Validators.required]
    });

    this.authService.getFutbolistaProfile().subscribe(
      (futbolistaData) => {
        this.futbolista = futbolistaData;

        this.futbolistaForm = this.fb.group({
          nombre: [this.futbolista.nombre, Validators.required],
          apellidos: [this.futbolista.apellidos, Validators.required],
          edad: [this.futbolista.edad, [Validators.required, Validators.min(16)]],
          email: [{ value: this.futbolista.email, disabled: true }, [Validators.required, Validators.email]],
          telefono: [this.futbolista.telefono, [Validators.pattern('^[0-9]{9}$')]],
          clubActual: [this.futbolista?.clubActual?._id || '',],
          categoriaActual: [{ value: this.futbolista.categoriaActual, disabled: true } || '',],
          posiciones: [this.futbolista?.posiciones || [], Validators.required],
          piernaDominante: [this.futbolista.piernaDominante || '', Validators.required],
          nacionalidad: [this.futbolista.nacionalidad, Validators.required],
          fotografia: [null],  // Campo para la URL de la imagen de Cloudinary
          // clubes: [futbolistaData.clubes || []],  // Historial de clubes
          // categorias: [futbolistaData.categorias || []],  // Historial de categorías
        });
      },
      (error) => {
        console.error('Error al obtener el perfil del futbolista', error);

        // Redirige al login y reemplaza la URL en el historial de navegación
        // if (error.status === 401 || error.status === 403) {
        //   this.router.navigate(['../../auth/login'], { replaceUrl: true }); // Reemplaza la URL en el historial
        // }
      }
    );
    this.clubs$ = this.authService.getClubs(); // Llama al servicio para obtener los clubes
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    this.isLoading = true;
    if (this.futbolistaForm.valid) {
      const formData = new FormData();

      // Añadir los campos del formulario a FormData
      formData.append('nombre', this.futbolistaForm.get('nombre')?.value);
      formData.append('apellidos', this.futbolistaForm.get('apellidos')?.value);
      formData.append('edad', this.futbolistaForm.get('edad')?.value);
      formData.append('telefono', this.futbolistaForm.get('telefono')?.value);
      formData.append('nacionalidad', this.futbolistaForm.get('nacionalidad')?.value);
      formData.append('piernaDominante', this.futbolistaForm.get('piernaDominante')?.value);
      const posiciones = this.futbolistaForm.get('posiciones')?.value;
      posiciones.forEach((posicion: string, index: number) => {
        formData.append(`posiciones[${index}]`, posicion);
      });
      // Añadir club y categoría si existen
      formData.append('clubActual', this.futbolistaForm.get('clubActual')?.value || '');
      formData.append('categoriaActual', this.futbolistaForm.get('categoriaActual')?.value || '');

      // Añadir la fotografía si existe
      if (this.selectedFile) {
        formData.append('fotografia', this.selectedFile); // Usamos el archivo seleccionado
      }

      // Verificar el contenido de FormData (opcional para depuración)
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      // Enviar el FormData al backend
      this.futbolistaService.updateFutbolistaProfile(formData).subscribe(response => {
        console.log('Perfil de futbolista actualizado', response);
        this.isLoading = false;
        // Redirigir al perfil
        this.router.navigate(['/futbolista/perfil'], { replaceUrl: true });
      });
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file;  // Guardamos el archivo en la variable

      // Crear la URL temporal para la vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImageUrl = reader.result; // Guardamos la URL temporal
      };
      reader.readAsDataURL(file);

      console.log('Archivo seleccionado:', file);
    }
  }


  onCheckboxChange(event: any) {
    const selectedPositions = this.futbolistaForm.get('posiciones')?.value as string[];
    const value = event.target.value;
    if (event.target.checked) {
      selectedPositions.push(value);
    } else {
      // Eliminar la posición si ya estaba seleccionada
      const index = selectedPositions.indexOf(value);
      if (index >= 0) {
        selectedPositions.splice(index, 1);
      }
    }
    // Actualizar el valor del campo "posiciones" en el formulario
    this.futbolistaForm.get('posiciones')?.setValue(selectedPositions);
  }

  onClubChange() {
    const clubId = this.futbolistaForm.get('clubActual')?.value;
    console.log(clubId);

    if (clubId != "null") {
      this.authService.getClubCategory(clubId).subscribe(
        category => {
          // Asignar el valor de la categoría tanto al formulario como a futbolista.categoriaActual
          this.futbolistaForm.get('categoriaActual')?.setValue(category.category);
          this.futbolista.clubActual = clubId;
          this.futbolista.categoriaActual = category.category; // Actualizar la propiedad de futbolista
        },
        error => {
          console.error('Error al obtener la categoría del club', error);
        }
      );
    } else {
      // Si no hay club seleccionado, limpiar la categoría tanto en el formulario como en futbolista
      this.futbolistaForm.get('clubActual')?.setValue('');
      this.futbolista.clubActual = ''; // Limpiar la categoría en futbolista
      this.futbolistaForm.get('categoriaActual')?.setValue('');
      this.futbolista.categoriaActual = ''; // Limpiar la categoría en futbolista
      console.error('El clubId es null, no se puede obtener la categoría del club');
    }
  }
}
