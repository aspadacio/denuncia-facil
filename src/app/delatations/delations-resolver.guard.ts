import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { Delation } from '../shared/models/delation';
import { DelationsService } from './delations.service';
import { CompaniesService } from '../shared/services/companies.service';

@Injectable({
  providedIn: 'root'
})
export class DelationsResolverGuard implements Resolve<Delation> {

  constructor(
    private delationsService: DelationsService,
    private companyService: CompaniesService,
    private router: Router
  ){}
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Delation | Observable<Delation> | any {
    if( route.params ){
      if( route.params['id'] ){
        return this.delationsService.find(route.params['id']);
      }else if( route.params['protocol'] ){
        let args = {
          'key': 'protocolo',
          'value': route.params['protocol']
        };
        return this.delationsService.findParams(args);
      }else if( route.params['context'] ) {
        let companyId = this.companyService.findParams({
          'key': 'contexto',
          'value': route.params['context']
        });
      }
    }else{
        return <Delation>{};
    }
  }
  
}
