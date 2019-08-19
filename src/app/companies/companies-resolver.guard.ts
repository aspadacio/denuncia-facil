import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Company } from '../shared/models/company';
import { CompaniesService } from '../shared/services/companies.service';

@Injectable({
  providedIn: 'root'
})
export class CompaniesResolverGuard implements Resolve<Company> {

  constructor(
    private companiesService: CompaniesService
  ){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Company> | Company {
    if(route.params && route.params['id']){
      return this.companiesService.find(route.params['id']);
    }else{
      return <Company>{};
    }
  }
  
}
