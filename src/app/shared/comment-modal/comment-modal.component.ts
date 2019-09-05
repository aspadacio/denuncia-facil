import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.css']
})
export class CommentModalComponent implements OnInit {

  @Input() title: string;
  @Input() txtAreaPH: string = 'Escreva aqui...';
  @Input() btnCancel: string = 'Cancelar';
  @Input() btnOk: string = 'Enviar';

  confirmResult: Subject<string>;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.confirmResult = new Subject<string>();
  }

  onConfirm(comment: string){
    this.confirmAndClose(comment);
  }

  onClose(){
    this.confirmAndClose('');
  }

  private confirmAndClose(value: string) {
    this.confirmResult.next(value);
    this.bsModalRef.hide();
  }

}
