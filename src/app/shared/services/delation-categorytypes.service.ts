import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { GenericCrudService } from './generic-crud.service';
import { CategoryTpe } from '../models/categoryType';

@Injectable({
  providedIn: 'root'
})
export class DelationCategoryTypesService extends GenericCrudService<CategoryTpe> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.FAKE_SERVER}categoria_tipos`);
  }
}
