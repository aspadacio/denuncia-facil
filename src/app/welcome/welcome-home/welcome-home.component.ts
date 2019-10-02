import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CompaniesService } from '../../shared/services/companies.service';
import { Company } from '../../shared/models/company';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/shared/constants';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome-home.component.html',
  styleUrls: ['./welcome-home.component.css']
})
export class WelcomeHomeComponent implements OnInit {

  public company$: Observable<Company>;
  public isViewProtocol: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private companiesService: CompaniesService
    ) { }

  ngOnInit() {
    const context = this.route.snapshot.data['context'];
    if( context && context !== '' ) {
      this.company$ = this.companiesService.findParams(
        { 
          'key': 'contexto', 
          'value': context 
        }
      );
    }
  }

  onDelatation(company: Company) {
    GlobalConstants.COMPANY_ID = company.id;
    this.router.navigate(['denunciar'], { relativeTo: this.route });
  }

  //Send to Delation view time-line
  onViewProtocol(protocol: string) {
    this.router.navigate(['denuncia/', protocol], { relativeTo: this.route });
  }

  onIsViewProtocol(){
    this.isViewProtocol = !this.isViewProtocol;
  }

}
