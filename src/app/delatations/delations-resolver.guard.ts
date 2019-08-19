import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';

import { Observable } from 'rxjs';
import { Delation } from '../shared/models/delation';
import { DelationsService } from './delations.service';

@Injectable({
  providedIn: 'root'
})
export class DelationsResolverGuard implements Resolve<Delation> {

  constructor(
    private delationsService: DelationsService
  ){}
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Delation | Observable<Delation> {
    if(route.params && route.params['id']){
      return this.delationsService.find(route.params['id']);
    }else{
      return <Delation>{};
    }
  }
  
}
