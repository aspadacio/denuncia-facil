import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { GlobalConstants } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class WelcomeGuard implements CanActivateChild, Resolve<string> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string | Observable<string> | Promise<string> {
    //Get Company context
    GlobalConstants.COMPANY_CONTEXT = state.url.split('/')[2] ? state.url.split('/')[2] : '';
    return GlobalConstants.COMPANY_CONTEXT;
  }
  
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  
}