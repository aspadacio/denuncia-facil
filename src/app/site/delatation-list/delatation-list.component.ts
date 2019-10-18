import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';

import { DelationsService } from 'src/app/delatations/delations.service';
import { AlertModalComponent } from 'src/app/shared/alert-modal/alert-modal.component';
import { BaseListComponent } from 'src/app/shared/base-list/base-list.component';
import { CommentModalComponent } from 'src/app/shared/comment-modal/comment-modal.component';
import { Company } from 'src/app/shared/models/company';
import { Delatation } from 'src/app/shared/models/delatation';
import { User } from 'src/app/shared/models/user';
import { DateTimeFormatPipeThis } from 'src/app/shared/pipes/date-time-format.pipe';
import { ModalService } from 'src/app/shared/services/modal.service';
import { SisUtil } from 'src/app/shared/sis-util';
import { FileService } from 'src/app/shared/services/file.service';

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

  public delationSelected: Delatation;
  public delatations$: Observable<Delatation[]>;
  public delatation$: Observable<Delatation>;
  public companies$: Observable<Company[]>;
  public users$: Observable<User[]>;

  private delatation: any;
  private company: any;

  public context: string;
  public userName: string;
  public reqRespIndex = [];
  ctxTmpCenterDot = { $implicit: true };
  optionsSearch = [];

  constructor(
    private delationsService: DelationsService,
    private dateTimeFormt: DateTimeFormatPipeThis,
    private modalService: ModalService,
    private fileService: FileService,
    public router: Router,
    public route: ActivatedRoute,
    private location: Location
  ) {
    super(modalService, router, route);

    //To reload the self-page. RouterActive doesnt works here.
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.context = this.route.snapshot.params['context'];

    if (this.route.snapshot.data['delatation'] && this.route.snapshot.data['delatation'].data) {
      //Show time-line from ONE delatation
      this.delatation = this.route.snapshot.data['delatation'].data[0];
      this.delatation$ = of(this.delatation);
      this.fixNgForArrays();
    } else if (this.route.snapshot.data['company'] && this.route.snapshot.data['company'].data) {
      this.company = this.route.snapshot.data['company'].data[0];
      this.onFromCompany(this.company._id);
    } else if (this.route.snapshot.data['user'] && this.route.snapshot.data['user'].data) {
      this.onFromUser(this.route.snapshot.data['user'].data[0]._id);
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

  onFromCompany(id: string){
    this.delatations$ = this.delationsService.list()
      .pipe(
        map((result: any) => result = result.data),
        map((delatations: any) => delatations.filter((delatation: Delatation) => delatation.EMPRESA_ID === id))
      );
  }

  onFromUser(id: string) {
    this.delatations$ = this.delationsService.list()
    .pipe(
      map(delatations => delatations.filter(delatation => delatation.USUARIO_ID === id))
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
      //map(comment => comment != '' ? this.commentIserted = comment : EMPTY)
    )
      .subscribe(
        success => {
          this.addComment(success);
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
      //map(resp => resp != '' ? this.commentIserted = resp : EMPTY)
    )
      .subscribe(
        success => {
          //TODO: Add Comment or Response
          this.addResponse(success);
        },
        error => {
          this.handleError('Ocorreu um erro ao iniciar a tela de resposta.');
        }
      );
  }

  //add comments to current time-line
  private addComment(success: any) {
    if( success.files && success.files.length > 0 ){
      let dsAttachments = "";
      this.fileService.uploadDenunciaAnexos(this.upload(success.files))
      .pipe(
        tap((res: any) => {
          dsAttachments = SisUtil.formatFilesName(res);
          this.pushDsHistory(success.comment, dsAttachments);
          this.onSaveDelatation(0);
        })
      )
      .toPromise();
    }
    else if( success.comment !== "" ){
      this.pushDsHistory(success.comment);
      this.onSaveDelatation(0);
    }
  }

  //add comments to current time-line
  private addResponse(success: any) {
    if( success.files && success.files.length > 0 ){
      let dsAttachments = "";
      this.fileService.uploadDenunciaAnexos(this.upload(success.files))
      .pipe(
        tap((res: any) => {
          dsAttachments = SisUtil.formatFilesName(res);
          this.pushDsResponse(success.comment, dsAttachments);
          this.onSaveDelatation(1);
        })
      )
      .toPromise();
    }
    else if( success.comment !== "" ){
      this.pushDsResponse(success.comment);
      this.onSaveDelatation(1);
    }
  }

  /**
   * Add response to current time-line
   * @param type 0 - Coments ; 1 - Response
   */
  private onSaveDelatation(type: number) {
    this.delatation.type = type;
    this.delationsService.save(this.delatation)
    .pipe()
    .subscribe(
        success => {
          //To reload the self-page. RouterActive doesnt works here.
          this.router.navigate([this.router.url]);
        },
        error => this.handleError('Ocorreu um erro ao atualizar a denúncia ')
      );
  }

  private pushDsResponse(comment: string, dsAttachments?: string){
    this.delatation.DS_RESPOSTA.push({
      id: (this.delatation.DS_RESPOSTA.length + 1),
      DS_RESPOSTA: comment,
      DS_NOME_ANEXO: dsAttachments ? dsAttachments : null,
      TS_RESPOSTA: Date.now().toString()
    });
  }

  private pushDsHistory(comment: string, dsAttachments?: string){
    this.delatation.DS_HISTORIA.push({
      id: (this.delatation.DS_HISTORIA.length + 1),
      DS_HISTORIA: comment,
      DS_NOME_ANEXO: dsAttachments ? dsAttachments : null,
      TS_RESPOSTA: Date.now().toString()
    });
  }

   /**
   * Add Files names uploaded to the Delatation
   * @returns Attachments names
   */
  private upload(fileList: FileList): Set<File> {
    let files = new Set<File>();
    for( let i=0; i<fileList.length; i++ ){
      files.add(fileList[i]);
    }
    return files;
  }

  downloadAttachment(name: string){
    this.fileService.downloadAttachment(name)
    .subscribe((res: any) => {
      this.fileService.handleFile(res, name);
    })
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
    const dsHistoriaArray = this.delatation.DS_HISTORIA.length;
    const dsRespostaArray = this.delatation.DS_RESPOSTA.length;
    const loopCounter = dsHistoriaArray >= dsRespostaArray ? dsHistoriaArray : dsRespostaArray;
    for (let i = 0; i < loopCounter; i++) {
      this.reqRespIndex.push({
        even: this.delatation.DS_HISTORIA[i] ? i : 'EOF',
        odd: this.delatation.DS_RESPOSTA[i] ? i : 'EOF'
      });
      this.reqRespIndex.push({
        even: this.delatation.DS_HISTORIA[i] ? i : 'EOF',
        odd: this.delatation.DS_RESPOSTA[i] ? i : 'EOF'
      });
    }
  }

}
