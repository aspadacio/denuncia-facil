import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { Globals } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class WelcomeGuard implements CanActivateChild {
  
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

   //console.log(next);
   //console.log(state);

   console.log('Guard...');

    //Get Company context
    Globals.COMPANY_CONTEXT = state.url.split('/')[1];
    return true;
  }
  
}
