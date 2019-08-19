import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebugFormComponent } from './debug-form/debug-form.component';
import { ConsultaCepService } from './services/consulta-cep.service';
import { ConsultaCnpjService } from './services/consulta-cnpj.service';
import { GenericCrudService } from './services/generic-crud.service';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { ScrollDirective } from './directives/scroll.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component'

@NgModule({
  declarations: [
    DebugFormComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    ScrollDirective,
    LoadingSpinnerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DebugFormComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    LoadingSpinnerComponent
  ],
  providers: [
    ConsultaCepService,
    ConsultaCnpjService,
    GenericCrudService
  ],
  entryComponents: [
    AlertModalComponent,
    ConfirmModalComponent,
    LoadingSpinnerComponent
  ]
})
export class SharedModule { }
