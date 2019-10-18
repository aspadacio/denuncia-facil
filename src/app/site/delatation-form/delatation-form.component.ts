import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DelationsService } from 'src/app/delatations/delations.service';
import { AlertModalComponent } from 'src/app/shared/alert-modal/alert-modal.component';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { GlobalConstants } from 'src/app/shared/constants';
import { ModalService } from 'src/app/shared/services/modal.service';
import { SisUtil } from 'src/app/shared/sis-util';
import { FileService } from 'src/app/shared/services/file.service';
import { tap, map } from 'rxjs/operators';
import { UsersService } from 'src/app/shared/services/users.service';

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
  public context: string;

  public submitted: boolean = false;
  public hasUserLogged: boolean = false;

  private filesToUpload: FileList;
  private filesUploadNames: string[] = [];
  public files = []; //To convey File' name & type (pdf, png, jpg)

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private delatationService: DelationsService,
    private userService: UsersService,
    private fileSerive: FileService,
    private alertService: ModalService,
  ) {
    super();
    this.btnSubmit = "Denunciar";
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      EMPRESA_ID: [null, [Validators.required]],
      USUARIO_ID: [null],
      DS_TITULO: [null, [Validators.required]],
      TS_VISIVEL: [0],
      DS_HISTORIA: this.formBuilder.array([
        this.formBuilder.group({
          id: [1],
          DS_HISTORIA: ['', [Validators.required]],
          DS_NOME_ANEXO: [''],
          TS_HISTORIA: [Date.now().toString(), [Validators.required]]
        })
      ]),
      DS_RESPOSTA: this.formBuilder.array([]),
      TS_DENUNCIA: [Date.now().toString(), [Validators.required]],
      PROTOCOLO: ['', [Validators.required]]
    });

    if (this.route.snapshot.data['opts'] && this.route.snapshot.data['opts'].cpf) {
      const user = this.userService.findParams({
        'cpf': this.route.snapshot.data['opts'].cpf
      });
      user.subscribe(
        (success: any) => {
          this.form.controls['USUARIO_ID'].setValue(success[0].id);
          this.hasUserLogged = true;
         },
        (error: any) => {
          this.handleError('Erro ao buscar usuário.')
        }
      );
    }else if(GlobalConstants.USER_LOGGED_CPF){
      const user = this.userService.findParams({
        'cpf': GlobalConstants.USER_LOGGED_CPF
      });
      user.subscribe(
        (success: any) => {
          this.form.controls['USUARIO_ID'].setValue(success[0].id);
          this.hasUserLogged = true;
         },
        (error: any) => {
          this.handleError('Erro ao buscar usuário.')
        }
      );
    }
  }

  onBeforeSubmit(txtDenuncia: string) {
    this.protocol = SisUtil.gerarProtocolo(this.form.controls['DS_TITULO'].value);
    this.form.controls['PROTOCOLO'].setValue(this.protocol);

    if( GlobalConstants.COMPANY_ID !== 0){
      this.form.controls['EMPRESA_ID'].setValue(GlobalConstants.COMPANY_ID);
    }

    if( txtDenuncia ){
      let controlDsHistoria = <FormArray>this.form.controls['DS_HISTORIA'];
      (<FormGroup>controlDsHistoria.controls[0]).controls['DS_HISTORIA'].setValue(txtDenuncia);
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

    if(this.filesToUpload){
      for( let i=0; i<this.filesToUpload.length; i++ ){
        files.add(this.filesToUpload[i]);
      }
  
      this.fileSerive.uploadDenunciaAnexos(files)
      .pipe(
        tap((res: any) => {
          let controlDsHistoria = <FormArray>this.form.controls['DS_HISTORIA'];
          const dsNomeAnexo = SisUtil.formatFilesName(res);
          (<FormGroup>controlDsHistoria.controls[0]).controls['DS_NOME_ANEXO'].setValue(dsNomeAnexo);
        })
      )
      .subscribe(res =>  this.submit());
    }else{
      this.submit()
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

  onSign(){
    //this.router.navigate(['/entrar']);
    const isApply = false;
    this.router.navigate(['../entrar', isApply], { relativeTo: this.route });
  }

  onRegister(){
    //this.router.navigate(['/usuarios/novo']);
    const isApply = true;
    this.router.navigate(['../entrar', isApply], { relativeTo: this.route });
  }

  /**
   * Forward to the next slide
   * @param isToIdentify if true then set user at form
   */
  slideForward(isToIdentify?: boolean){
    if( isToIdentify === true ){
      if (this.form.controls['USUARIO_ID'].value){
        this.form.controls['TS_VISIVEL'].setValue(1);
      }
    }else if( isToIdentify === false ){
      this.form.controls['TS_VISIVEL'].setValue(0);
    }
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
