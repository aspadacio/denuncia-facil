import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CompaniesService } from '../../shared/services/companies.service';
import { Company } from '../../shared/models/company';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/shared/constants';
import { UsersService } from 'src/app/shared/services/users.service';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome-home.component.html',
  styleUrls: ['./welcome-home.component.css']
})
export class WelcomeHomeComponent implements OnInit {

  public company$: Observable<Company>;
  public userName$: Observable<User>;
  public isViewProtocol: boolean = false;
  public context: string;
  public userName: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private companiesService: CompaniesService,
    private userService: UsersService
    ) { }

  ngOnInit() {
    this.context = this.route.snapshot.data['context'];
    if( this.context && this.context !== '' ) {
      this.company$ = this.companiesService.findParams(
        { 
          'key': 'contexto', 
          'value': this.context 
        }
      );
    }

    if( GlobalConstants && GlobalConstants.USER_LOGGED_CPF ){
      this.userName$ = this.userService.findParams(
        {
          'key': 'cpf', 
          'value': GlobalConstants.USER_LOGGED_CPF
        }
      );

      this.userName$.subscribe((user: any) => {
        this.userName = user[0].nome;
      });
    }
  }

  onDelatation(company: Company) {
    GlobalConstants.COMPANY_ID = company.id;
    if( GlobalConstants.USER_LOGGED_CPF ){
      this.router.navigate([`/site/${this.context}/denunciar/${GlobalConstants.USER_LOGGED_CPF}`]);
    }else {
      this.router.navigate(['denunciar'], { relativeTo: this.route });
    }
  }

  //Send to Delation view time-line
  onViewProtocol(protocol: string) {
    this.router.navigate(['denuncia/', protocol], { relativeTo: this.route });
  }

  onIsViewProtocol(){
    this.isViewProtocol = !this.isViewProtocol;
  }

}
