import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { Delation } from '../shared/models/delation';
import { DelationsService } from './delations.service';

@Injectable({
  providedIn: 'root'
})
export class DelationsResolverGuard implements Resolve<Delation> {

  constructor(
    private delationsService: DelationsService,
    private router: Router
  ){}
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Delation | Observable<Delation> {
    if(route.params && (route.params['id'] || route.params['protocol']) ){
      if( route.params['id'] ){
        //console.log('id...');
        return this.delationsService.find(route.params['id']);
      }else if( route.params['protocol'] ){
        //console.log('protocolo...');
        let args = {
          'key': 'protocolo',
          'value': route.params['protocol']
        };
        return this.delationsService.findParams(args);
      }
    }else{
      //console.log(route.params);
      //console.log('else...');
      //this.router.navigate(['/nao-encontrado'])
      return <Delation>{};
    }
  }
  
}
