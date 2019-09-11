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
import { DateFormatPipeThis } from './pipes/date-format.pipe';
import { DateTimeFormatPipeThis } from './pipes/date-time-format.pipe';

@NgModule({
  declarations: [
    DebugFormComponent,
    AlertModalComponent,
    ConfirmModalComponent,
    ScrollDirective,
    LoadingSpinnerComponent,
    CommentModalComponent,
    CamelCasePipe,
    NotFoundComponent,
    DateFormatPipeThis,
    DateTimeFormatPipeThis
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
    CamelCasePipe,
    DateFormatPipeThis,
    DateTimeFormatPipeThis
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
