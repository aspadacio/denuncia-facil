import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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

  @ViewChild("filesToUpload", {static: false}) filesToUpload: ElementRef;
  private filelist: FileList;
  public files = []; //To convey File' name & type (pdf, png, jpg)

  confirmResult: Subject<any>;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.confirmResult = new Subject<{}>();
  }

  onConfirm(comment: string){
    this.confirmAndClose(comment);
  }

  onClose(){
    this.confirmAndClose('');
  }

  private confirmAndClose(value: string) {
    const files = <FileList>this.filesToUpload.nativeElement.files;
    this.confirmResult.next({
      comment: value,
      files: files
    });
    this.bsModalRef.hide();
  }

  onInsertText(denuncia: string){
    console.log(denuncia);
  }

  onChangeFileUpload(event: any) {
    this.files = [];
    this.filelist = <FileList>event.srcElement.files;
    if (this.filelist.length <= 3) {
      for (let i = 0; i < this.filelist.length; i++) {
        let fileStrg = this.filelist[i].name.split('.');
        //Name that contains more than one dot
        if (fileStrg.length > 2) {
          let fullName = "";
          fileStrg.forEach((value, index, arr) => {
            if (index !== (fileStrg.length - 1)) {
              fullName += value;
            }
          });
          this.files.push({
            name: fullName.trim(),
            type: fileStrg[fileStrg.length - 1],
            id: this.files.length
          });
        } else {
          this.files.push({
            name: fileStrg[0].trim(),
            type: fileStrg[1],
            id: this.files.length
          });
        }
      }
    } else {
      //'Só é permitido no máximo três arquivos como anexo.'
    }
  }

    /**
   * Handling file removed
   * @param id 
   */
  onRemoveFile(id: number): void {
    this.files = this.files.filter((v, i, arr) => {
      return v.id != id;
    });
  }

}
