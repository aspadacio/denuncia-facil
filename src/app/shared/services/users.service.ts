import { Injectable } from '@angular/core';
import { GenericCrudService } from './generic-crud.service';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends GenericCrudService<User> {

  constructor(protected http: HttpClient) {
    super(http, `${environment.BACKEND_SERVER}usuario`);
   }
}
