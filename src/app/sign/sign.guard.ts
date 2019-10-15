import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Resolve } from '@angular/router';
import { Observable, EMPTY, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignGuard implements Resolve<{}> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{}> {
    if( route.params['toApply'] && route.params['toApply'] === "true"){
      return of({
        'toApply': route.params['toApply'],
        'context': route.params['context']
      });
    }else if( route.params['context'] ){
      return of({
        'context': route.params['context']
      });
    }else{
      return EMPTY;
    }
  }
  
}
