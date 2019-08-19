import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GenericCrudService } from '../shared/services/generic-crud.service';
import { Delation } from '../shared/models/delation';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
  })
  export class DelationsService extends GenericCrudService<Delation> {
      
    constructor(protected http: HttpClient){
        super(http, `${environment.FAKE_SERVER}delacoes`);
    }
  }