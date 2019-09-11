import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {NgxMaskModule} from 'ngx-mask'

import { DelatationsListComponent } from './delatations-list/delatations-list.component';
import { DelatationsRoutingModule } from './delatations-routing.module';
import { DelationsService } from './delations.service';
import { DelationFormComponent } from './delation-form/delation-form.component';

import { SharedModule } from '../shared/shared.module';
import { DateTimeFormatPipeThis } from '../shared/pipes/date-time-format.pipe';

@NgModule({
  declarations: [
    DelatationsListComponent,
    DelationFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    DelatationsRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    DelationsService,
    DateTimeFormatPipeThis
  ]
})
export class DelatationsModule { }
