import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { GenericCrudService } from './generic-crud.service';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class DelationCategoriesService extends GenericCrudService<Category> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.FAKE_SERVER}categorias`);
  }
}
