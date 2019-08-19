import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ConsultaCepService {

  constructor(
    private http: HttpClient
  ) { }

  consultaCEP(cep: string) {
    if(cep !== ''){
      return this.http.get(`//viacep.com.br/ws/${cep}/json`).pipe(map(res => res));
    }
    return of({});
  }
}
