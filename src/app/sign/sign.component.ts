import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { FormValidations } from '../shared/form-validations';
import { ModalService } from '../shared/services/modal.service';
import { UsersService } from '../shared/services/users.service';
import { AlertModalComponent } from '../shared/alert-modal/alert-modal.component';
import { Location } from '@angular/common';
import { tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalConstants } from '../shared/constants';

@Component({
  selector: 'sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent extends BaseFormComponent implements OnInit {

  public isForLogin: boolean;
  public password: string;
  public confirmPwd: string;
  public userName: string;
  public userLastName: string;

  public context: string;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private alertService: ModalService,
    private location: Location,
    private router: Router,
    public route: ActivatedRoute
  ) {
    super();
   }

  ngOnInit() {
    this.isForLogin = true;
    if (this.route.snapshot.data['opts']) {
      this.context = this.route.snapshot.data['opts'].context;
      this.isForLogin = this.route.snapshot.data['opts'].toApply ? false : true;
    }

    this.form = this.formBuilder.group({
      id: [null],
      cpf: [null, [Validators.required, FormValidations.cpfValidator, Validators.minLength(11), Validators.maxLength(14)]],
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      email: [null, [Validators.required, Validators.email]],
      hash: [null, [Validators.required]],
      seed: [null, [Validators.required]]
    });
  }

  submit() {
    let formToSent = Object.assign({}, this.form.value);
    this.usersService.save(formToSent).subscribe(
      success => {
        this.handleAlert("Usuário incluído com sucesso.");
        this.location.back();
      },
      error => {
        this.handleAlert("Erro ao incluir usuário. Tente novamente.");
      }
    );
  }

  onBeforeSubmit(isApply: boolean){
    if( isApply ){
      this.usersService.register(this.password)
      .subscribe(
        (success: any) => {
          this.form.controls['hash'].setValue(success.hash);
          this.form.controls['seed'].setValue(success.seed);
          this.onMountName();
          this.submit();
        },
        error => {
          this.handleAlert("Erro ao encriptar senha. Contate o administrador.");
        }
      );
    }else{
      this.usersService.validate(this.password, this.form.controls['cpf'].value)
      .subscribe(
        (success: any) => { 
          if(success.isEquals){
            //this.router.navigate([`/site/${Globals.COMPANY_CONTEXT}/denuncias/${this.form.controls['cpf'].value}`]);
            //this.router.navigate([`/site/${GlobalConstants.COMPANY_CONTEXT}/${this.form.controls['cpf'].value}`]);
            GlobalConstants.USER_LOGGED_CPF = this.form.controls['cpf'].value;
            this.location.back();
          }else{
            this.handleAlert("Senha incorreta! Tente novamente.");
          }  
        },
        error => {
          console.log(`Senha: ${this.password} | Cpf: ${this.form.controls['cpf'].value}`);
          this.handleAlert("Erro ao logar. Contate o administrador.");
        }
      );
    }
  }

  private onMountName(){
    this.form.controls['nome'].setValue(this.userName + ' ' + this.userLastName);
  }

  onAddPwd(str: string){
    this.password = str;
  }

  onAddConfirmPwd(str: string){
    this.confirmPwd = str;
  }

  onAddName(str: string){
    this.userName = str;
  }

  onAddLastName(str: string){
    this.userLastName = str;
  }

  private handleAlert(msg: string){
    this.alertService.showAlert(AlertModalComponent, msg);
  }

  onApply(){
    this.isForLogin = !this.isForLogin;
  }

}
