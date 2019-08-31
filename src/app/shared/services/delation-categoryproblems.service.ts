import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { GenericCrudService } from './generic-crud.service';
import { CategoryProblem } from '../models/categoryProblem';

@Injectable({
  providedIn: 'root'
})
export class DelationCategoryProblemsService extends GenericCrudService<CategoryProblem> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.BACKEND_SERVER}categoria_problemas`);
  }
}
