import { Component, OnInit, Input } from '@angular/core';
import { GlobalConstants } from 'src/app/shared/constants';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.css']
})
export class TopnavbarComponent implements OnInit {

  @Input() context: string;
  @Input() userName: string;
  @Input() isForLogin: string;

  public hasSite: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    if(!this.context){
      this.hasSite = false;
    }
  }

  onLogout(){
    GlobalConstants.USER_LOGGED_CPF = null;
    GlobalConstants.USER_LOGGED_NAME = null;
    this.router.navigate([`/site/${GlobalConstants.COMPANY_CONTEXT}`]);
  }

  onToDelatation(){
    this.router.navigate([`/site/${GlobalConstants.COMPANY_CONTEXT}/denuncias`]);
  }

  onToStart(){
    this.router.navigate([`/site/${GlobalConstants.COMPANY_CONTEXT}`]);
  }

  onToCompany(){
    this.router.navigate([`/empresas`]);
  }

  onToUsers(){
    this.router.navigate([`/site/${GlobalConstants.COMPANY_CONTEXT}/usuarios`]);
  }

  onToSign(){
    this.router.navigate([`/site/${GlobalConstants.COMPANY_CONTEXT}/entrar`]);
  }

}
