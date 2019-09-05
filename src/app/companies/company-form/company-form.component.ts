import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { FormValidations } from 'src/app/shared/form-validations';
import { ConsultaCnpjService } from 'src/app/shared/services/consulta-cnpj.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { AlertModalComponent } from 'src/app/shared/alert-modal/alert-modal.component';

import { CompaniesService } from 'src/app/shared/services/companies.service';
import { distinctUntilChanged, switchMap, tap, map } from 'rxjs/operators';
import { empty, Observable } from 'rxjs';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent extends BaseFormComponent implements OnInit {
  
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
      atividadePrincipal: [company.atividade_principal],
      atividadesSecundarias: [company.atividades_secundarias],
      billing: [company.billing],
      extra: [company.extra],
      qsa: [company.qsa]
    });

    //Escutando a Alteração do campo CNPJ
    this.form.get('cnpj').statusChanges
    .pipe(
      distinctUntilChanged(), //It's like filter, but just emits the values that are distinct from the previous
      switchMap(status => status === 'VALID' ? this.callConsultaCNPJ() : empty()),
      map(r => r = r[0])
    )
    //Se o RxJS emitir um EMPTY, então, a cadeia abaixo do .subscribe([...]) não é executada
    .subscribe(
      r => this.fillForm(r),
      err => this.handleError("Erro ao pesquisar CNPJ."),
      () => {}
    );
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
        cnpj: data.cnpj,
        nome: data.nome,
        municipio: data.municipio,
        uf: data.uf,
        bairro: data.bairro,
        cep: data.cep,
        logradouro: data.logradouro,
        complemento: data.complemento
      });
    }else{
      this.form.reset();
    }
  }

  private callConsultaCNPJ(): Observable<Object> {
    //console.log(this.form.controls['nome']);
    return this.cnpjService.consultaCNPJ(this.form.controls['cnpj'].value);
  }

  onCancel(){
    this.form.reset();
    this.location.back();
  }

  private handleError(msg: string){
    this.alertService.showAlert(AlertModalComponent, msg);
  }

}
