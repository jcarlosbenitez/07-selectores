import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { PaisSmall, Pais } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root',
})
export class PaisesServiceService {
  private baseUrl: string = 'https://restcountries.com/v3.1';
  private FronterizoUrl: string = 'https://restcountries.com/v3.1';
  private _regiones: string[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
  ];
  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor(private http: HttpClient) {}

  getPAisesPorRegion(region: string): Observable<PaisSmall[]> {
    const url: string = `${this.baseUrl}/region/${region}?fields=cca3,name`;
    return this.http.get<PaisSmall[]>(url);
  }

  getPaisesFronterizos(pais: string): Observable<Pais | null> {
    if (!pais) {
      return of(null);
    }
    const url: string = `${this.FronterizoUrl}/alpha/${pais}`;
    return this.http.get<Pais>(url);
  }

  getPaisesFronterizosSmall(pais: string): Observable<PaisSmall> {
    const url: string = `${this.FronterizoUrl}/alpha/${pais}?fields=name,cca3`;
    return this.http.get<PaisSmall>(url);
  }

  getPaisPorCodigos(borders: string[]): Observable<PaisSmall[]> {
    console.log(borders)
    if (!borders) {
      return of([]);
    }
    const peticiones: Observable<PaisSmall>[] = [];
    borders.forEach((codigo) => {
      const peticion = this.getPaisesFronterizosSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);
  }

  getPaisPorCodigos2(borders: any): Observable<PaisSmall[]> {
    console.log("borders",borders)
  const border: any = borders
  
    return this.http.get<PaisSmall[]>(border);
  }
  
}




