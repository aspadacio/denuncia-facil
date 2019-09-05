import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Globals } from '../shared/constants';
import { CompaniesService } from '../shared/services/companies.service';
import { Company } from '../shared/models/company';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  public company$: Observable<Company>;
  public isViewProtocol: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private companiesService: CompaniesService
    ) { }

  ngOnInit() {
    //console.log(Globals.COMPANY_CONTEXT);
    if( Globals.COMPANY_CONTEXT !== '' ) {
      this.company$ = this.companiesService.findParams(
        { 
          'key': 'contexto', 
          'value': Globals.COMPANY_CONTEXT 
        }
      );
    }
  }

  onSign() {
    this.router.navigate(['/sign']);
  }

  onDelation() {
    this.router.navigate(['/delatations/new'])
  }

  //Send to Delation view time-line
  onViewProtocol(protocol: string) {
    this.router.navigate(['/delatations/view/', protocol], {relativeTo: this.route});
  }

  onIsViewProtocol(){
    this.isViewProtocol = !this.isViewProtocol;
  }

}
