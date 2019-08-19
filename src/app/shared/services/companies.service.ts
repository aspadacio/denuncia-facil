import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Company } from '../models/company';
import { GenericCrudService } from './generic-crud.service';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService extends GenericCrudService<Company> {

  constructor(protected http: HttpClient){
    super(http, `${environment.FAKE_SERVER}empresas`);
  }

  /**
   * Se precisar haver ulguma peculiaridade nos verbos REST (GET, PUT, POST, DELETE),
   * apenas declarar o método aqui e será utilizado este e não a do SUPER
   */
}
