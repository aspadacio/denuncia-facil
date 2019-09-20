import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { DelationsService } from 'src/app/delatations/delations.service';
import { AlertModalComponent } from 'src/app/shared/alert-modal/alert-modal.component';
import { BaseListComponent } from 'src/app/shared/base-list/base-list.component';
import { CommentModalComponent } from 'src/app/shared/comment-modal/comment-modal.component';
import { Company } from 'src/app/shared/models/company';
import { Delation } from 'src/app/shared/models/delation';
import { User } from 'src/app/shared/models/user';
import { DateTimeFormatPipeThis } from 'src/app/shared/pipes/date-time-format.pipe';
import { ModalService } from 'src/app/shared/services/modal.service';

declare var $:any;

type ParamsValues = {
  key: string;
  value: string;
}

@Component({
  selector: 'app-delatation-list',
  templateUrl: './delatation-list.component.html',
  styleUrls: ['./delatation-list.component.css']
})
export class DelatationListComponent extends BaseListComponent implements OnInit {

  private commentIserted: string = '';
  private delatation: any;
  private company: any;

  public delationSelected: Delation;

  public delatations$: Observable<Delation[]>;
  public delatation$: Observable<Delation>;
  public companies$: Observable<Company[]>;
  public users$: Observable<User[]>;


  public reqRespIndex = [];
  ctxTmpCenterDot = { $implicit: true };
  optionsSearch = [];

  constructor(
    private delationsService: DelationsService,
    private dateTimeFormt: DateTimeFormatPipeThis,
    private modalService: ModalService,
    public router: Router,
    public route: ActivatedRoute,
    private location: Location
  ) {
    super(modalService, router, route);

    //To reload the self-page. RouterActive doesnt works here.
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    if (this.route.snapshot.data['delatation']) {
      this.delatation = this.route.snapshot.data['delatation'][0];
      //Show time-line from ONE delatation
      this.onUpdateCurrent(this.delatation.id.toString());
      this.fixNgForArrays();
    } else if (this.route.snapshot.data['company']) {
      this.company = this.route.snapshot.data['company'][0];
      this.onFromCompany(this.company.id);
    } else {
      this.onRefresh();
    }
  }

  ngAfterViewInit(): void {
    /**
     * Bootstrap-select - @see developer.snapappointments.com/bootstrap-select/
     * After get data from async services, it's necessary, due to a bug, refresh DOM element
     */
    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 2500);

  }

  //Get all delation from that Company
  onRefresh() {
    this.delatations$ = this.delationsService.list()
      .pipe(
        catchError(err => {
          console.log(err);
          return EMPTY;
        })
      );
  }

  onFromCompany(id: number){
    this.delatations$ = this.delationsService.list()
      .pipe(
        map(delatations => delatations.filter(delatation => delatation.idEmpresa === id))
      );
  }

  /**
   * Will show a modal popup with Delation's value
   * @param delation 
   */
  onView(protocol: string) {
    //this.router.navigate([`site/${this.route.snapshot.url[0].path}/denuncia/`, protocol]);
    this.router.navigate(['../denuncia/', protocol], { relativeTo: this.route });
  }

  /**
   * Will show a modal popup to add user's comments
   * Used only in each delatation
   */
  onViewAddComment() {
    const comment$ = this.modalService.showAddComment(CommentModalComponent, 'Por favor, insira seu comentário');
    comment$.pipe(
      map(comment => comment != '' ? this.commentIserted = comment : EMPTY)
    )
      .subscribe(
        success => {
          //TODO: Add Comment or Response
          this.addComment();
        },
        error => {
          this.handleError('Ocorreu um erro ao iniciar a tela de comentário.');
        }
      );
  }

  /**
 * Will show a modal popup to add Lawer response
 * Used only in each delatation
 */
  onViewAddResponse() {
    const response$ = this.modalService.showAddComment(CommentModalComponent, 'Por favor, insira sua resposta');
    response$.pipe(
      map(resp => resp != '' ? this.commentIserted = resp : EMPTY)
    )
      .subscribe(
        success => {
          //TODO: Add Comment or Response
          this.addResponse();
        },
        error => {
          this.handleError('Ocorreu um erro ao iniciar a tela de resposta.');
        }
      );
  }

  //add comments to current time-line
  private addComment() {
    this.delatation.dsHistoria.push({
      idHistoria: (this.delatation.dsHistoria.length + 1),
      dsHistoria: this.commentIserted,
      tsHistoria: Date.now()
    });
    this.onSaveDelatation();
  }

  //add comments to current time-line
  private addResponse() {
    this.delatation.dsResposta.push({
      idResposta: (this.delatation.dsResposta.length + 1),
      dsResposta: this.commentIserted,
      tsResposta: Date.now()
    });
    this.onSaveDelatation();
  }

  //add response to current time-line
  private onSaveDelatation() {
    this.delationsService.save(this.delatation)
      .pipe(
        catchError((error: any) => {
          this.handleError('Ocorreu um erro ao atualizar a denúncia');
          return EMPTY;
        })
      ).subscribe(
        success => {
          //To reload the self-page. RouterActive doesnt works here.
          this.router.navigate([this.router.url]);
        },
        error => this.handleError('Ocorreu um erro ao atualizar a denúncia')
      );
  }

  private onUpdateCurrent(id: string): void {
    this.delatation$ = this.delationsService.find(id);
    this.delatation$.pipe(
      map(delation => delation)
    ).subscribe();
  }

  /**
   * Listen a scroll event
   * Método responsável por show/hide a marca das Timelines conforme o usuário dá o scroll.
   * @param $event 
   */
  @HostListener('window:scroll', ['$event']) onScroll($event: Event) {
    //scrollTop -> Quantos que andou
    let scrollBar = $(document).scrollTop();
    let halphDoc = $(window).height() / 2;
    const reachBottom = $(window).scrollTop() + $(window).height() == $(document).height();

    //Percorre cada Center Dot
    $('span.badge').each(function (index: number, value: HTMLSpanElement) {
      let halfParent = $(this).offsetParent().offset().top / 2;
      let navBar = $($('.navbar')[0]).height();

      if (scrollBar >= (halfParent - navBar) || reachBottom) {
        $(this).removeClass('bg-light border').addClass('bg-success');
      } else {
        $(this).removeClass('bg-success').addClass('bg-light border');
      }
    });
  }

  private handleError(msg: string) {
    this.modalService.showAlert(AlertModalComponent, msg);
  }

  refreshSelect() {
    $('.selectpicker').selectpicker('refresh');
  }

  onSearch(): void {
    throw new Error("Method not implemented.");
  }

  /**
   * Workaround to correct iterate over two Arrays on ngFor
   */
  private fixNgForArrays() {
    const dsHistoriaArray = this.delatation.dsHistoria.length;
    const dsRespostaArray = this.delatation.dsResposta.length;
    const loopCounter = dsHistoriaArray >= dsRespostaArray ? dsHistoriaArray : dsRespostaArray;
    for (let i = 0; i < loopCounter; i++) {
      this.reqRespIndex.push({
        even: this.delatation.dsHistoria[i] ? i : 'EOF',
        odd: this.delatation.dsResposta[i] ? i : 'EOF'
      });
      this.reqRespIndex.push({
        even: this.delatation.dsHistoria[i] ? i : 'EOF',
        odd: this.delatation.dsResposta[i] ? i : 'EOF'
      });
    }
  }

}
