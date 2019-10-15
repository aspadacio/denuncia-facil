import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Resolve } from '@angular/router';
import { Observable, EMPTY, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DelatationLoggedGuard implements Resolve<{}>  {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): {} | Observable<{}> | Promise<{}> {
    if( route.params['context'] && route.params['cpf'] ){
      return of({
        'cpf': route.params['cpf'],
        'context': route.params['context']
      });
    }else {
      return EMPTY;
    }
  }  
}
