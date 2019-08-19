import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '../shared/models/user';
import { UsersService } from '../shared/services/users.service';

@Injectable({
  providedIn: 'root'
})
export class UsersResolverGuard implements Resolve<User> {

  constructor(
    private usersService: UsersService
  ){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> | User {
    if(route.params && route.params['id']){
      return this.usersService.find(route.params['id']);
    }else{
      return <User>{};
    }
  }
}
