import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import {NgxMaskModule} from 'ngx-mask'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CompanyFormComponent } from './company-form/company-form.component';
import { CompaniesRoutingModule } from './companies-routing.module';
import { CompaniesListComponent } from './companies-list/companies-list.component';
import { CompaniesService } from '../shared/services/companies.service';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CompanyFormComponent,
    CompaniesListComponent
  ],
  imports: [
    NgxMaskModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    CommonModule,
    SharedModule,
    CompaniesRoutingModule
  ],
  providers: [
    CompaniesService
  ]
})
export class CompaniesModule { }
