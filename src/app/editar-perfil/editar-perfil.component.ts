import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent implements OnInit {
  nombre: string = '';
  pasatiempo: string = '';
  edad: number = 0;
  fechaNacimiento: string =' '; 
  numeroIdentidad: string = '';
  selectedPokemons: any[] = [];
  imagenPerfil: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.nombre = localStorage.getItem('nombre') || '';
    this.pasatiempo = localStorage.getItem('pasatiempo') || '';
    this.edad = parseInt(localStorage.getItem('edad') || '0', 10);
    this.numeroIdentidad = localStorage.getItem('numeroIdentidad') || '';
    const fecha = localStorage.getItem('fechaNacimiento');
    this.fechaNacimiento = fecha && /^\d{4}-\d{2}-\d{2}$/.test(fecha) ? fecha : '';
    this.selectedPokemons = JSON.parse(localStorage.getItem('selectedPokemons') || '[]');
    this.imagenPerfil = localStorage.getItem('imagenPerfil') || 'https://via.placeholder.com/160';
  }

  onGuardar(): void {
    localStorage.setItem('nombre', this.nombre);
    localStorage.setItem('edad', this.edad.toString());
    localStorage.setItem('numeroIdentidad', this.numeroIdentidad);
    localStorage.setItem('fechaNacimiento',this.fechaNacimiento)
    localStorage.setItem('selectedPokemons', JSON.stringify(this.selectedPokemons));
    
    this.router.navigate(['/equipo']);
  }
}
