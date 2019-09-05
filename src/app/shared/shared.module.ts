import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebugFormComponent } from './debug-form/debug-form.component';
import { ConsultaCepService } from './services/consulta-cep.service';
import { ConsultaCnpjService } from './services/consulta-cnpj.service';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { ScrollDirective } from './directives/scroll.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { CommentModalComponent } from './comment-modal/comment-modal.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CamelCasePipe } from './pipes/camel-case.pipe';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    DebugFormComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    ScrollDirective,
    LoadingSpinnerComponent,
    CommentModalComponent,
    CamelCasePipe,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    DebugFormComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    LoadingSpinnerComponent,
    CommentModalComponent,
    CamelCasePipe
  ],
  providers: [
    ConsultaCepService,
    ConsultaCnpjService
  ],
  entryComponents: [
    AlertModalComponent,
    ConfirmModalComponent,
    LoadingSpinnerComponent,
    CommentModalComponent
  ]
})
export class SharedModule { }
