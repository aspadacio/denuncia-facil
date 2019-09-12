import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { CommentModalComponent } from './comment-modal/comment-modal.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { DebugFormComponent } from './debug-form/debug-form.component';
import { ScrollDirective } from './directives/scroll.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CamelCasePipe } from './pipes/camel-case.pipe';
import { DateFormatPipeThis } from './pipes/date-format.pipe';
import { DateTimeFormatPipeThis } from './pipes/date-time-format.pipe';
import { ConsultaCepService } from './services/consulta-cep.service';
import { ConsultaCnpjService } from './services/consulta-cnpj.service';
import { HttpClientJsonpModule } from '@angular/common/http';


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
    FontAwesomeModule,
    HttpClientJsonpModule
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
