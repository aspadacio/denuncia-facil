import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';

import { CompaniesService } from 'src/app/shared/services/companies.service';
import { catchError, tap } from 'rxjs/operators';
import { Observable, pipe, EMPTY } from 'rxjs';
import { Company } from '../../shared/models/company';
import { ModalService } from 'src/app/shared/services/modal.service';
import { AlertModalComponent } from 'src/app/shared/alert-modal/alert-modal.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.css']
})
export class CompaniesListComponent implements OnInit {

  @ViewChild('modalDetail', {static: false}) modalDetail: TemplateRef<any>;

  //Properties
  public companies$: Observable<Company[]>;
  public companySelected: Company;

  //Constructor
  constructor(
    private companiesService: CompaniesService,
    private alertService: ModalService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  /**
   * Methods
   */
  ngOnInit() {
    this.onRefresh();
  }

  onRefresh() {
    this.companies$ = this.companiesService.list()
    .pipe(
//      tap(x => console.log(x)),
      catchError(err => {
        this.alertService.showAlert(AlertModalComponent, 'Erro ao obter lista de Empresas');
        return EMPTY;
    }));
  }

  onEdit(id: number){
    this.router.navigate(['edit/', id], {relativeTo: this.route});
  }

  /**
   * Will show a modal popup with Company's value
   * @param company 
   */
  onView(company: Company){
    this.companySelected = company;
    this.alertService.showDetails(this.modalDetail);
  }

  onModalClose(){
    this.alertService.close();
  }

}
