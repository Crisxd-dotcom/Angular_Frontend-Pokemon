import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent implements OnInit {
  perfilForm: FormGroup;
  isMayorEdad: boolean = false;
  imagenPerfil: string | null = null;
  nombreImagen: string | null = null;
  showRegisterMessage: boolean = false; 
  hobbies: string[] = [
    'Leer',
    'Jugar videojuegos',
    'Hacer ejercicio',
    'Cocinar',
    'Ver películas',
    'Pasear al aire libre',
    'Otro'
  ];
  

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    const storedFecha = localStorage.getItem('fechaNacimiento') || '';
    const edad = storedFecha ? this.calcularEdad(storedFecha) : 0;
    this.isMayorEdad = edad >= 18;

    

    this.perfilForm = this.fb.group({
      nombre: [localStorage.getItem('nombre') || '', Validators.required],
      pasatiempo: [localStorage.getItem('pasatiempo') || ''],
      fechaNacimiento: [storedFecha, Validators.required],
      numeroIdentidad: [
        localStorage.getItem('numeroIdentidad') || '',
        this.isMayorEdad ? [Validators.required, this.validarNumeroIdentidad.bind(this)] : []
      ]
    });
    

    this.imagenPerfil = localStorage.getItem('imagenPerfil') || 'https://via.placeholder.com/160';
    this.nombreImagen = localStorage.getItem('nombreImagen') || null;

    if (!localStorage.getItem('nombre') ) {
      this.showRegisterMessage = true;  
    } else {
      this.showRegisterMessage = false;  
    }

    const fechaNacimientoControl = this.perfilForm.get('fechaNacimiento');
    if (fechaNacimientoControl) {
      fechaNacimientoControl.valueChanges.subscribe((fecha: string) => {
        const edad = this.calcularEdad(fecha);
        this.isMayorEdad = edad >= 18;
    
        const numeroIdentidadControl = this.perfilForm.get('numeroIdentidad');
        if (numeroIdentidadControl) {
          if (this.isMayorEdad) {
            numeroIdentidadControl.setValidators([
              Validators.required,
              this.validarNumeroIdentidad.bind(this)
            ]);
          } else {
            numeroIdentidadControl.clearValidators();
          }
          numeroIdentidadControl.updateValueAndValidity();
        }
      });
    }
    
  }

  calcularEdad(fechaNacimiento: string): number {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.nombreImagen = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPerfil = reader.result as string;
        localStorage.setItem('imagenPerfil', this.imagenPerfil!);
        localStorage.setItem('nombreImagen', this.nombreImagen!);
      };
      reader.readAsDataURL(file);
    }
  }

  onNumeroIdentidadChange(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 13) {
      value = value.slice(0, 13);
    }
    if (value.length > 4) {
      value = value.slice(0, 4) + '-' + value.slice(4);
    }
    if (value.length > 9) {
      value = value.slice(0, 9) + '-' + value.slice(9);
    }

    const numeroIdentidadControl = this.perfilForm.get('numeroIdentidad');
    if (numeroIdentidadControl) {
      numeroIdentidadControl.setValue(value);
    }
  }

  validarNumeroIdentidad(control: any): { [key: string]: boolean } | null {
    const valor = control.value;
    if (valor && valor.length !== 15) {
      return { longitudInvalida: true };
    }
    return null;
  }

  onGuardar(): void {
    if (this.perfilForm.valid) {
      const { nombre, pasatiempo, fechaNacimiento, numeroIdentidad } = this.perfilForm.value;
      const edad = this.calcularEdad(fechaNacimiento);

      localStorage.setItem('nombre', nombre);
      localStorage.setItem('pasatiempo', pasatiempo);
      localStorage.setItem('fechaNacimiento', fechaNacimiento);
      localStorage.setItem('edad', edad.toString());
      localStorage.setItem('numeroIdentidad', this.isMayorEdad ? numeroIdentidad : 'No aplicable');

      this.router.navigate(['/equipo']);
    }
  }
}
