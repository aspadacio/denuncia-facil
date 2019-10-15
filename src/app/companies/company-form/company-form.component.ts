import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { FormValidations } from 'src/app/shared/form-validations';
import { ConsultaCnpjService } from 'src/app/shared/services/consulta-cnpj.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { AlertModalComponent } from 'src/app/shared/alert-modal/alert-modal.component';

import { CompaniesService } from 'src/app/shared/services/companies.service';
import { distinctUntilChanged, switchMap, tap, map, filter, debounceTime } from 'rxjs/operators';
import { empty, Observable, EMPTY } from 'rxjs';
import { SisUtil } from 'src/app/shared/sis-util';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent extends BaseFormComponent implements OnInit {

  contextField = new FormControl();
  hasSameContext: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private companiesService: CompaniesService,
    private cnpjService: ConsultaCnpjService,
    private alertService: ModalService,
    private route: ActivatedRoute,
    private location: Location
  ) { 
    super();
  }

  ngOnInit() {
    const company = this.route.snapshot.data['company'];
    if( company && company.id ){
      this.btnSubmit = 'Atualizar';
    }

    //Form Driven - Mapeando a página
    this.form = this.formBuilder.group({
      id: [company.id],
      cnpj: [company.cnpj, [Validators.required, Validators.maxLength(18), FormValidations.cnpjValidator]],
      nome: [company.nome, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      fantasia: [company.fantasia, [Validators.maxLength(60)]],
      municipio: [company.municipio, [Validators.required]],
      uf: [company.uf, [Validators.required, Validators.maxLength(2)]],
      bairro: [company.bairro, [Validators.required]],
      cep: [company.cep, [Validators.required, FormValidations.cepValidator]],
      logradouro: [company.logradouro, [Validators.required]],
      complemento: [company.complemento],
      contexto: [company.contexto, [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      numero: [company.numero]
    });

    //Escutando a Alteração do campo CNPJ
    this.form.get('cnpj').statusChanges
    .pipe(
      distinctUntilChanged(), //It's like filter, but just emits the values that are distinct from the previous
      switchMap(status => status === 'VALID' ? this.callConsultaCNPJ() : empty())
    )
    //Se o RxJS emitir um EMPTY, então, a cadeia abaixo do .subscribe([...]) não é executada
    .subscribe(
      r => this.fillForm(r),
      err => this.handleError("Erro ao pesquisar CNPJ. " + err),
      () => {}
    );

    //Nome do Site
    this.contextField.valueChanges
    .pipe(
      map((v: string) => v.trim().toLowerCase()),
      filter(v => v.length > 3 && v.length <= 25),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((context: string) => 
        this.companiesService.findParams({
          'key': 'contexto', 
          'value': context
        })
      ),
      map((x: any) => x = x.result[0]),
      tap((x: any) => {
        if(x && x.CONTEXTO){
          this.hasSameContext = true;
        }else{
          this.hasSameContext = false;
          this.form.get('contexto').setValue(this.contextField.value.trim().toLowerCase());
        }
      })
    )
    .subscribe();
    //.subscribe((res: any) => res ? this.handleError('Já existe esse contexto!') : console.log('Nome de site permitido!!!'));

  }

  submit() {
    let formToSent = Object.assign({}, this.form.value);
    this.companiesService.save(formToSent).subscribe(
      success => {
        this.handleError("Empresa incluída com sucesso.");
        this.location.back();
      },
      error => {
        this.handleError("Erro ao incluir Empresa. Tente novamente.");
      }
    );
  }

  fillForm(data: any): void{
    if(data !== undefined){
      this.form.patchValue({
        cnpj: SisUtil.replaceStr(data.cnpj),
        nome: data.nome,
        municipio: data.municipio,
        uf: data.uf,
        bairro: data.bairro,
        cep: SisUtil.replaceStr(data.cep),
        logradouro: data.logradouro,
        complemento: data.complemento,
        numero: data.numero,
        fantasia: data.fantasia
      });
    }else{
      this.form.reset();
    }
  }

  private callConsultaCNPJ(): any {
    return this.cnpjService.consultaCNPJ(this.form.controls['cnpj'].value);
  }

  onCancel(){
    this.form.reset();
    this.location.back();
  }

  /**
   * Formata o nome do site para não haver espaços e caixa alta
   * @param event Nome do site inserido
   */
  public onSetLowerCase(event: any){
    event.target.value = (<string>event.srcElement.value).toLowerCase().trim();
  }

  private handleError(msg: string){
    this.alertService.showAlert(AlertModalComponent, msg);
  }

}
