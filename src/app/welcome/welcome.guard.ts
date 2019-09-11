import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { Globals } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class WelcomeGuard implements CanActivateChild, Resolve<string> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string | Observable<string> | Promise<string> {
    //Get Company context
    Globals.COMPANY_CONTEXT = state.url.split('/')[2] ? state.url.split('/')[2] : '';
    return Globals.COMPANY_CONTEXT;
  }
  
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  
}