import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AlertModalComponent } from 'src/app/shared/alert-modal/alert-modal.component';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Globals } from 'src/app/shared/constants';
import { ModalService } from 'src/app/shared/services/modal.service';
import { SisUtil } from 'src/app/shared/sis-util';
import { DelationsService } from '../delations.service';
import { text } from '@fortawesome/fontawesome-svg-core';


declare var $: any;
const MAX_CHARACTERS: number = 2000;

@Component({
  selector: 'app-delation-form',
  templateUrl: './delation-form.component.html',
  styleUrls: ['./delation-form.component.css']
})
export class DelationFormComponent extends BaseFormComponent implements OnInit {

  //Not Async
  public idCompany: number;
  public nmCaracters: number;
  public protocol: string;
  public txtDelatation: string;

  public submitted: boolean = false;

  private numberFiles: number = 1;
  private filesUploadNames: string[] = [];
  public files = []; //To convey File' name & type (pdf, png, jpg)

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private delatationService: DelationsService,
    public alertService: ModalService,
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
          dsHistoria: ['', [Validators.required]],
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
    this.submit();
  }
  
  submit() {
    let fromToSend = Object.assign({}, this.form.value);
    console.log(fromToSend);
    this.delatationService.save(fromToSend)
    .subscribe(
      success => {
        this.handleError('Denúncia feita com sucesso!')
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
    const selectedFiles = <FileList>event.srcElement.files;
    if (this.numberFiles <= 3) {
      for (let i = 0; i < selectedFiles.length; i++) {
        this.numberFiles++;
        this.filesUploadNames.push(selectedFiles[i].name);
        let fileStrg = selectedFiles[i].name.split('.');
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
      //Show message error
    }
    //console.log(this.files);
    //this.upload(selectedFiles);
  }

  private upload(files: FileList) {
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('arquivos', files[i], files[i].name);
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
    this.numberFiles = this.files.length;
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
