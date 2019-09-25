import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DelationsService } from 'src/app/delatations/delations.service';
import { AlertModalComponent } from 'src/app/shared/alert-modal/alert-modal.component';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Globals } from 'src/app/shared/constants';
import { ModalService } from 'src/app/shared/services/modal.service';
import { SisUtil } from 'src/app/shared/sis-util';
import { FileService } from 'src/app/shared/services/file.service';
import { tap, map } from 'rxjs/operators';

declare var $: any;
const MAX_CHARACTERS: number = 2000;

@Component({
  selector: 'app-delatation-form',
  templateUrl: './delatation-form.component.html',
  styleUrls: ['./delatation-form.component.css']
})
export class DelatationFormComponent extends BaseFormComponent implements OnInit {

  //Not Async
  public idCompany: number;
  public nmCaracters: number;
  public protocol: string;
  public txtDelatation: string;

  public submitted: boolean = false;

  private filesToUpload: FileList;
  private filesUploadNames: string[] = [];
  public files = []; //To convey File' name & type (pdf, png, jpg)

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private delatationService: DelationsService,
    private fileSerive: FileService,
    private alertService: ModalService,
  ) {
    super();
    this.btnSubmit = "Denunciar";
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: [null],
      idEmpresa: [null, [Validators.required]],
      idUsuario: [null],
      dsTitulo: [null, [Validators.required]],
      dsHistoria: this.formBuilder.array([
        this.formBuilder.group({
          id: [1],
          dsHistoria: ['', [Validators.required]],
          dsNomeAnexo: [''],
          tsHistoria: [Date.now(), [Validators.required]]
        })
      ]),
      dsResposta: this.formBuilder.array([]),
      tsReclamacao: [Date.now(), [Validators.required]],
      protocolo: ['', [Validators.required]]
    });
  }

  onBeforeSubmit(txtDenuncia: string) {
    this.protocol = SisUtil.gerarProtocolo(this.form.controls['dsTitulo'].value);
    this.form.controls['protocolo'].setValue(this.protocol);

    if( Globals.COMPANY_ID !== 0){
      this.form.controls['idEmpresa'].setValue(Globals.COMPANY_ID);
    }

    if( txtDenuncia ){
      let controlDsHistoria = <FormArray>this.form.controls['dsHistoria'];
      (<FormGroup>controlDsHistoria.controls[0]).controls['dsHistoria'].setValue(txtDenuncia);
    }

    this.slideForward();
    this.upload(); //Save the attachments 
  }
  
  submit() {
    let fromToSend = Object.assign({}, this.form.value);
    this.delatationService.save(fromToSend)
    .subscribe(
      success => {
        this.handleError('Denúncia feita com sucesso!');
       },
      error => {
        this.handleError('Erro ao salvar a denúncia.')
      }
    );
  }

  //Show counter characters
  onChangeText(event: any) {
    this.nmCaracters = MAX_CHARACTERS - (<string>event.srcElement.value).length;
  }

  /**
   * Handling files added
   * @param event 
   */
  onChangeFileUpload(event: any) {
    this.files = [];
    this.filesToUpload = <FileList>event.srcElement.files;
    if (this.filesToUpload.length <= 3) {
      for (let i = 0; i < this.filesToUpload.length; i++) {
        this.filesUploadNames.push(this.filesToUpload[i].name);
        let fileStrg = this.filesToUpload[i].name.split('.');
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
      this.handleError('Só é permitido no máximo três arquivos como anexo.');
    }
  }

  /**
   * Add Files names uploaded to the Delatation
   * files: FileList
   */
  private upload() {
    let files = new Set<File>();

    for( let i=0; i<this.filesToUpload.length; i++ ){
      files.add(this.filesToUpload[i]);
    }

    this.fileSerive.uploadDenunciaAnexos(files)
    .pipe(
      tap((res: any) => {
        let controlDsHistoria = <FormArray>this.form.controls['dsHistoria'];
        const dsNomeAnexo = SisUtil.formatFilesName(res);
        (<FormGroup>controlDsHistoria.controls[0]).controls['dsNomeAnexo'].setValue(dsNomeAnexo);
      })
    )
    .subscribe(res =>  this.submit());
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

  onSign(){
    this.router.navigate(['/entrar']);
  }

  onRegister(){
    this.router.navigate(['/usuarios/novo']);
  }

  slideForward(){
    $('.selectpicker').selectpicker('refresh');
    $('.carousel').carousel('next');
  }

  /**
   * Due to Boostrap-select plugin, it's indispensable
   * calls refresh for each selector
   * @param domEl 
   */
  private handleBsSelectRefresh(domEl: string) {
    const selector = "#" + `${domEl}`;
    setTimeout(() => {
      $(`${selector}`).selectpicker('refresh');
    }, 1);
  }

  private handleError(msg: string) {
    this.alertService.showAlert(AlertModalComponent, msg);
  }

}
