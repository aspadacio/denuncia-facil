import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {NgxMaskModule} from 'ngx-mask'
import { DelatationsListComponent } from './delatations-list/delatations-list.component';
import { DelatationsRoutingModule } from './delatations-routing.module';
import { DelationsService } from './delations.service';
import { DateFormatPipe } from '../shared/pipes/date-format.pipe';
import { DateTimeFormatPipe } from '../shared/pipes/date-time-format.pipe';
import { CamelCasePipe } from '../shared/pipes/camel-case.pipe';
import { DelationFormComponent } from './delation-form/delation-form.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    DelatationsListComponent,
    DelationFormComponent,
    DateFormatPipe,
    DateTimeFormatPipe,
    CamelCasePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskModule,
    DelatationsRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    DelationsService
  ]
})
export class DelatationsModule { }
