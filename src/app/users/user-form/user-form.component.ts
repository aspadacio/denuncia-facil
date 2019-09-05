import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { FormValidations } from 'src/app/shared/form-validations';
import { distinctUntilChanged, switchMap, map, tap, catchError } from 'rxjs/operators';
import { EMPTY, of, throwError } from 'rxjs';
import { ConsultaCepService } from 'src/app/shared/services/consulta-cep.service';
import { HttpClient } from '@angular/common/http';
import { UsersService } from '../../shared/services/users.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modal.service';
import { AlertModalComponent } from 'src/app/shared/alert-modal/alert-modal.component';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent extends BaseFormComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private cepService: ConsultaCepService,
    private usersService: UsersService,
    private alertService: ModalService
  ) {
    super();
   }

  ngOnInit() {
    //Check if has a ResolverGuard Params
    const user = this.route.snapshot.data['user'];
    if( user && user.id ){
      this.btnSubmit = 'Atualizar';
    }

    //Form Driven
    this.form = this.formBuilder.group({
      id: [user.id],
      cpf: [user.cpf, [Validators.required, FormValidations.cpfValidator, Validators.minLength(11), Validators.maxLength(14)]],
      nome: [user.nome, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      email: [user.email, [Validators.required, Validators.email]],
      confirmarEmail: [user.email, [Validators.required, FormValidations.equalsTo('email')]],
      endereco: this.formBuilder.group({
        cep: [user.endereco ? user.endereco.cep : null, [Validators.required, FormValidations.cepValidator, Validators.minLength(8), Validators.maxLength(9)]],
        numero: [user.endereco ? user.endereco.numero : null, [Validators.required, FormValidations.numberValidator]],
        complemento: [user.endereco ? user.endereco.complemento : null, [Validators.maxLength(60)]],
        logradouro: [user.endereco ? user.endereco.logradouro : null, Validators.required],
        bairro: [user.endereco ? user.endereco.bairro : null, Validators.required],
        municipio: [user.endereco ? user.endereco.municipio : null, Validators.required],
        estado: [user.endereco ? user.endereco.estado : null, Validators.required]
      })
    });

    this.form.get('endereco.cep').statusChanges
    .pipe(
      distinctUntilChanged(),
      switchMap(status => status === 'VALID' ? this.cepService.consultaCEP(this.form.controls['endereco'].get('cep').value) : EMPTY)
    )
    .subscribe(
      r => this.fillForm(r),
      err => this.handleError('Erro ao pesquisar CEP.'),
      () => {}
    );
  }

  submit() {
    let formToSent = Object.assign({}, this.form.value);
    this.usersService.save(formToSent).subscribe(
      success => {
        this.handleError("Usuário incluído com sucesso.");
        this.location.back();
      },
      error => {
        this.handleError("Erro ao incluir usuário. Tente novamente.");
      }
    );

    // this.http.post('https://httpbin.org/post', JSON.stringify(formToSent))
    //   .pipe(map(res => res))
    //   .subscribe(
    //     dados => {
    //       console.log(`onSubmit:: ${dados}`);
    //     },
    //     (error: any) => console.log(`${error.status}-${error.statusText}`)
    //   );
  }

  fillForm(data: any): void {
    if(data !== undefined){
      this.form.patchValue({
        endereco: {
          municipio: data.localidade,
          estado: data.uf,
          bairro: data.bairro,
          cep: data.cep,
          logradouro: data.logradouro,
          complemento: data.complemento
        }
      });
    }else{
      this.form.controls['endereco'].reset();
    }
  } 

  onCancel(){
    this.form.reset();
    this.location.back();
  }

  private handleError(msg: string){
    this.alertService.showAlert(AlertModalComponent, msg);
  }

}
