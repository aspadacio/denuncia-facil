import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GenericCrudService } from '../shared/services/generic-crud.service';
import { Delatation } from '../shared/models/delatation';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
  })
  export class DelationsService extends GenericCrudService<Delatation> {
      
    constructor(protected http: HttpClient){
        super(http, `${environment.BACKEND_SERVER}denuncia`);
    }
  }