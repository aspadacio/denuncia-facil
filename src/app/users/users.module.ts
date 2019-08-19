import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgxMaskModule} from 'ngx-mask'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersRoutingModule } from './users-routing.module';
import { UsersService } from '../shared/services/users.service';
import { UserFormComponent } from './user-form/user-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    UsersListComponent,
    UserFormComponent
  ],
  imports: [
    NgxMaskModule.forRoot(),
    FontAwesomeModule,
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    UsersRoutingModule
  ],
  providers: [
    UsersService
  ]
})
export class UsersModule { }
