import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Resolve } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { Delatation } from '../shared/models/delatation';
import { DelationsService } from '../delatations/delations.service';
import { CompaniesService } from '../shared/services/companies.service';
import { UsersService } from '../shared/services/users.service';

@Injectable({
  providedIn: 'root'
})
export class DelatationGuard implements Resolve<Delatation>  {

  constructor(
    private delationsService: DelationsService,
    private companyService: CompaniesService,
    private userService: UsersService
  ){}
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Delatation | Observable<Delatation> | Promise<Delatation> | any {
    if( route.params['protocol'] ){
      let args = {
        'key': 'protocolo',
        'value': route.params['protocol']
      };
      return this.delationsService.findParams(args);
    }else if( route.params['cpf'] ){
      return this.userService.findParams({
        'key': 'cpf',
        'value': route.params['cpf']
      });
      //return route.params['cpf'];
    }else if( route.params['context'] ){
      return this.companyService.findParams({
        'key': 'contexto',
        'value': route.params['context']
      });
    }
    return EMPTY;
  }
  
}
