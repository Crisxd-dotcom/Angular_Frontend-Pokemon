import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=9';
  constructor(private http: HttpClient) { }

  getPokemons(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getPokemonDetails(url: string): Observable<any> {
    return this.http.get(url);
  }
}
