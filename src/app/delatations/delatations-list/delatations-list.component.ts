import { Component, OnInit, HostListener, AfterViewInit, Type, ViewChild, TemplateRef } from '@angular/core';

import { Delation } from 'src/app/shared/models/delation';
import { DelationsService } from '../delations.service';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import { Company } from 'src/app/shared/models/company';
import { User } from 'src/app/shared/models/user';
import { AlertModalService } from 'src/app/shared/services/alert-modal.service';
import { CompaniesService } from 'src/app/shared/services/companies.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { AlertModalComponent } from 'src/app/shared/alert-modal/alert-modal.component';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseListComponent } from 'src/app/shared/base-list/base-list.component';

declare var $:any;

type ParamsValues = {
  key: string;
  value: string;
}

@Component({
  selector: 'app-delatations-list',
  templateUrl: './delatations-list.component.html',
  styleUrls: ['./delatations-list.component.css']
})
export class DelatationsListComponent extends BaseListComponent implements OnInit, AfterViewInit {

  public delations$: Observable<Delation[]>;
  public companies$: Observable<Company[]>;
  public users$: Observable<User[]>;

  ctxTmpCenterDot = { $implicit: true };
  optionsSearch = [];

  @ViewChild('modalDetails', {static: false}) modalDetails: TemplateRef<any>;
  
  public delationSelected: Delation;

  constructor(
    private delationsService: DelationsService,
    private companiesService: CompaniesService,
    private usersService: UsersService,
    public alertService: AlertModalService,
    public router: Router,
    public route: ActivatedRoute
  ){ 
    super(alertService, router, route);
  }

  ngOnInit(): void {
    this.onRefresh();
  }

  ngAfterViewInit(): void {
    this.users$ = this.usersService.list()
      .pipe(
        catchError(err => {
          this.handleError('Erro ao carregar Usuários. Tente novamente.');
          return EMPTY;
        }));

    this.companies$ = this.companiesService.list()
      .pipe(
        catchError(err => {
          this.handleError('Erro ao obter lista de Empresas. Tente novamente.');
          return EMPTY;
        }));

    /**
     * Bootstrap-select - @see developer.snapappointments.com/bootstrap-select/
     * After get data from async services, it's necessary, due to a bug, refresh DOM element
     */
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 2500);

  }

  onRefresh() {
    this.delations$ = this.delationsService.list()
    .pipe(
      catchError(err => {
        console.log(err);
        return EMPTY;
      })
    );
  }

  /**
   * Find for Company / Squeaker
   * @param evt 
   */
  onChangeSelect(evt: any){
    let arr = [];
    let arrSelected: Function = $('.selectpicker option:selected');
    if( arrSelected.length > 0 && arrSelected.length <= 2 ){
      $(arrSelected).each(function(index: number, opt: any){
        arr.push(opt);
      });
      this.optionsSearch = arr;
    }
  }

  /**
   * FInd Squeaker with Selected options
   */
  onSearch(){
    let optsSearch: ParamsValues[] = [];
    if(this.optionsSearch && this.optionsSearch.length > 0){
      this.optionsSearch.forEach(function(v: any, i: number, arr: any[]){
        let value: string = $(v).val();
        let field: string = value.substring(0,1);
        let strId: string = value.substring(1,2);
        
        if( field && field === 'c' ){
          //Company
          optsSearch.push({key: 'idEmpresa', value: strId});
        }else {
          //Squeaker
          optsSearch.push({key: 'idUsuario', value: strId});
        }
      });

      this.delations$ = this.delationsService.findParams(optsSearch)
      .pipe(
        catchError(err => {
          console.log(err);
          return EMPTY;
        })
      );
    }
  }

  /**
   * Will show a modal popup with Delation's value
   * @param delation 
   */
  onView(delation: Delation){
    this.delationSelected = delation;
    this.usersService.find(this.delationSelected.idUsuario.toString())
    .subscribe(
      user => this.delationSelected.dsUsuario = user.nome
    );
    this.companiesService.find(this.delationSelected.idEmpresa.toString())
    .subscribe(
      company => this.delationSelected.dsEmpresa = company.nome
    );
    this.alertService.showDetails(this.modalDetails);
  }

  limparPesquisa(){
    $('.selectpicker').selectpicker('deselectAll');
    this.onRefresh();
  }

  /**
   * Listen a scroll event
   * Método responsável por show/hide a marca das Timelines conforme o usuário dá o scroll.
   * @param $event 
   */
  @HostListener('window:scroll', ['$event']) onScroll($event: Event) {
    //scrollTop -> Quantos que andou
    let scrollBar = $(document).scrollTop();
    let halphDoc  = $(window).height() / 2;
    const reachBottom = $(window).scrollTop() + $(window).height() == $(document).height();

    //Percorre cada Center Dot
    $('span.badge').each(function (index: number, value: HTMLSpanElement) {
      let halfParent = $(this).offsetParent().offset().top / 2;
      let navBar = $($('.navbar')[0]).height();

      if( scrollBar >= (halfParent - navBar) || reachBottom ){
        $(this).removeClass('bg-light border').addClass('bg-success');
      }else {
        $(this).removeClass('bg-success').addClass('bg-light border');
      }
    });
  }

  private handleError(msg: string){
    this.alertService.showAlert(AlertModalComponent, msg);
  }

  refreshSelect() {
    $('.selectpicker').selectpicker('refresh');
 }

}
