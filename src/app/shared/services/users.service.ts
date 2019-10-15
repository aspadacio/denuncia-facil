import { Injectable } from '@angular/core';
import { GenericCrudService } from './generic-crud.service';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends GenericCrudService<User> {

  private url = `${environment.BACKEND_SERVER}user`;

  constructor(protected http: HttpClient) {
    super(http, `${environment.BACKEND_SERVER}user`);
   }

   public register(password: string){
    return this.http.post(`${this.url}/doEncrypt`, {password: password}).pipe(take(1));
  }

  public validate(password: string, cpf: string) {
    return this.http.post(`${this.url}/doDecrypt`, 
    {
      password: password,
      cpf: cpf
    }).pipe(take(1));
  }
}
