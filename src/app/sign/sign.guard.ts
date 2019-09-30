import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignGuard implements Resolve<string> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string | Observable<string> | Promise<string> {
    if( route.params['toApply'] &&  route.params['toApply'] === "true"){
      return route.params['toApply'];
    }else{
      return "false";
    }
  }
  
}
