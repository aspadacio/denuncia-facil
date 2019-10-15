import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignRoutingModule } from './sign-routing.module';
import { SignComponent } from './sign.component';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [SignComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    SignRoutingModule,
    NgxMaskModule.forRoot(),
    FontAwesomeModule
  ]
})
export class SignModule { }
