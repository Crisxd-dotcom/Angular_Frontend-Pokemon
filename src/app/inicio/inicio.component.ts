import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  nombre: string = '';
  numeroIdentidad: string = '';
  edad: number = 0; 

  pokemons: any[] = [];
  selectedPokemons: any[] = [];
  searchText: string = '';
  isSearching: boolean = false;
  searchResult: any | null = null;
  showMaxMessage: boolean = false;
  showRegisterMessage: boolean = false; 
  
  constructor(private pokemonService: PokemonService, private router: Router) {}

  ngOnInit(): void {
    this.nombre = localStorage.getItem('nombre') || '';
    this.edad = parseInt(localStorage.getItem('edad') || '0', 10);
    this.numeroIdentidad = localStorage.getItem('numeroIdentidad') || '';
    if (!this.nombre || !this.edad || this.edad <= 0 || this.nombre === '') {
      this.showRegisterMessage = true;  
    } else {
      this.showRegisterMessage = false;  
    }
  
    const navigation = history.state;
    if (navigation && navigation.nombre) {
      this.nombre = navigation.nombre;
    }
    if (navigation && navigation.edad) {
      this.edad = navigation.edad;
    }
    if (navigation && navigation.numeroIdentidad) {
      this.numeroIdentidad = navigation.numeroIdentidad;
    }
  
    const selectedPokemonsData = localStorage.getItem('selectedPokemons');
    if (selectedPokemonsData) {
      this.selectedPokemons = JSON.parse(selectedPokemonsData);
    } else {
      this.selectedPokemons = [];
    }
  
    this.pokemonService.getPokemons().subscribe((data: any) => {
      const pokemonRequests = data.results.map((pokemon: any) =>
        this.pokemonService.getPokemonDetails(pokemon.url)
      );
  
      forkJoin(pokemonRequests).subscribe((pokemonsDetails: any[]) => {
        this.pokemons = pokemonsDetails.map(pokemonDetail => ({
          id: pokemonDetail.id,
          name: pokemonDetail.name,
          front_default: pokemonDetail.sprites.front_default,
          stats: pokemonDetail.stats.map((s: any) => ({
            base_stat: s.base_stat,
            stat: { name: s.stat.name }
          }))
        }));
        
  
        this.selectedPokemons = this.pokemons.filter(pokemon =>
          this.selectedPokemons.some(savedPokemon => savedPokemon.id === pokemon.id)
        );
      });
    });
  }
  

  searchPokemon(): void {
    const term = this.searchText.trim().toLowerCase();
    if (!term) {
      this.searchResult = null;
      this.isSearching = false;
      return;
    }

    this.isSearching = true;
    this.pokemonService.getPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${term}`).subscribe({
      next: (pokemonDetail) => {
        this.searchResult = {
          id: pokemonDetail.id,
          name: pokemonDetail.name,
          front_default: pokemonDetail.sprites.front_default,
          stats: pokemonDetail.stats.map((s: any) => ({
            name: s.stat.name,
            base: s.base_stat
          }))
        };
        
      },
      error: () => {
        this.searchResult = null;
      }
    });
  }

  toggleSelect(pokemon: any): void {
    if (this.selectedPokemons.length >= 3 && !this.selectedPokemons.includes(pokemon)) {
      this.showMaxMessage = true; 
      return; 
    }
  
    this.showMaxMessage = false; 
  
    const index = this.selectedPokemons.findIndex(p => p.id === pokemon.id);
    if (index > -1) {
      this.selectedPokemons.splice(index, 1); 
    } else {
      this.selectedPokemons.push(pokemon); 
    }
  
    localStorage.setItem('selectedPokemons', JSON.stringify(this.selectedPokemons));
  }
  
  
  selectFromSearch(pokemon: any): void {
    this.toggleSelect(pokemon);
    this.searchResult = null; 
    this.isSearching = false; 
  }

  goToEquipo(): void {
    localStorage.setItem('nombre', this.nombre);
    localStorage.setItem('edad', this.edad.toString());
    localStorage.setItem('selectedPokemons', JSON.stringify(this.selectedPokemons));
  

    this.router.navigate(['/equipo']);
  }
  
}
