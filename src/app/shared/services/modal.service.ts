import { Injectable, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, pipe, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

//Pode-se utilizar-se de algum ENUM
enum AlertTypes {
  DANGER = 'danger',
  SUCCESS = 'success'
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService) { }
  
  /**
   * 
   * @param template Referência ao template
   * @param message Mensagem a ser exibida ao usuário
   * @param type tipo do modal (danger:default, success, info, etc)
   * @param dismissTimeout Tempo, em milissegundos, para fechar a modal
   */
  showAlert(template: any, message: string, type?: string, dismissTimeout?: number) {
    this.bsModalRef = this.modalService.show(template, {animated: true});
    //bsModalRef.content.type = (type == null) ? 'danger' : type; //Verifica se é null ou undefined
    this.bsModalRef.content.message = message;
    if(dismissTimeout>0){
     setTimeout(() => {
      this.bsModalRef.hide()
     }, dismissTimeout);
    }
  }

  /**
   * Cria um BsModalRef a ser exibido no 'template'.
   * @param template Referência ao template
   * @param title título da popup
   * @param message corpo da mensagem da popup
   * @param btnCancel nome a ser exibido do botão de cancelamento
   * @param btnOk nome a ser exibido do botão de confirmação
   * @param dismissTimeout Tempo, em milissegundos, para fechar a modal
   * @returns Observable<boolean> já com take(1) para automaticamente após a única requisição, destruí-lo
  */
  showConfirm(template: any, title: string, message: string | JSON, btnCancel?: string, btnOk?: string, dismissTimeout?: number): Observable<boolean> {
    this.bsModalRef = this.modalService.show(template);
    this.bsModalRef.content.title = title;
    this.bsModalRef.content.message = message;
    if (btnCancel) {
      this.bsModalRef.content.btnCancel = btnCancel;
    }
    if (btnOk) {
      this.bsModalRef.content.btnOk = btnOk;
    }
    if (dismissTimeout > 0) {
      setTimeout(() => {
        this.bsModalRef.hide()
      }, dismissTimeout);
    }
    return  (<Subject<boolean>>this.bsModalRef.content.confirmResult).asObservable().pipe(take(1));
  }

  /**
   * Exibe um Modal a partir do ng-template informado.
   * Tem por objetivo exibir detalhes de uma tabela.
   * @param template - ng-template
   */
  showDetails(template: TemplateRef<any>) {
    this.bsModalRef = this.modalService.show(template,
      Object.assign({},
        {
          animated: true,
          class: 'gray modal-lg'
        }
      ));
  }

  /**
   * Modal usada apra inclusão de um comentário ou resposta numa denúncia já criada
   * @retuns The comment wrote
   */
  showAddComment(template: any, title: string): Observable<string> {
    this.bsModalRef = this.modalService.show(template);
    this.bsModalRef.content.title = title;
    return (<Subject<string>>this.bsModalRef.content.confirmResult).asObservable().pipe(take(1));
  }

  public close(){
    this.bsModalRef.hide();
  }
}
