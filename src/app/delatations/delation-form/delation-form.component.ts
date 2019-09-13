import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AlertModalComponent } from 'src/app/shared/alert-modal/alert-modal.component';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Company } from 'src/app/shared/models/company';
import { Delation } from 'src/app/shared/models/delation';
import { ModalService } from 'src/app/shared/services/modal.service';
import { CompaniesService } from 'src/app/shared/services/companies.service';
import { Globals } from 'src/app/shared/constants';

declare var $: any;

@Component({
  selector: 'app-delation-form',
  templateUrl: './delation-form.component.html',
  styleUrls: ['./delation-form.component.css']
})
export class DelationFormComponent extends BaseFormComponent implements OnInit, AfterViewInit {

  //Not Async
  public company: Company;
  public idCompany: number;

  public submitted: boolean = false;

  private numberFiles: number = 1;
  private filesUploadNames: string[] = [];
  public files = []; //To convey File' name & type (pdf, png, jpg)

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private companiesService: CompaniesService,
    public alertService: ModalService,
  ) {
    super();
    this.btnSubmit = "Publicar";
  }

  ngOnInit() {
    // const delation: Delation = this.route.snapshot.data['delation'];
    // if (delation && delation.id) {
    //   this.btnSubmit = 'Atualizar';
    // }

    this.form = this.formBuilder.group({
      id: [null],
      idEmpresa: [null],
      idUsuario: [null],
      dsTitulo: [null, [Validators.required]],
      dsHistoria: this.formBuilder.group({
        dsHistoria: ['', [Validators.required]],
        tsHistoria: [Date.now(), [Validators.required]]
      }),
      dsResposta: this.formBuilder.group({
        dsResposta: ['', [Validators.required]],
        tsResposta: [Date.now(), [Validators.required]]
      }),
      tsReclamacao: [null]
    });

    //Get Company from COMPANY_CONTEXT
    this.companiesService.list()
      .pipe(
        map(companies => companies.filter(v => v.contexto === Globals.COMPANY_CONTEXT))
      )
      .subscribe(
        companies => {
          this.company = companies[0];
        },
        err => { this.handleError('Erro ao obter lista de Empresas. Tente novamente.'); },
        () => { this.handleBsSelectRefresh("selectpicker-company"); }
      );

  }

  ngAfterViewInit(): void { }

  submit() {
    this.submitted = true;
    console.log('ENVIANDO.....................');
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

  onAnonymous(){
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
