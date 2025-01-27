import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  constructor(private http: HttpClient) {}

  getFlagByCountryName(countryName: string): Observable<string> {
    return this.http
      .get<any>(`https://restcountries.com/v3.1/name/${countryName}`)
      .pipe(map((response) => response[0]?.flags?.svg || ''));
  }
}
