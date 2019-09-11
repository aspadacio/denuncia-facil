import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeGuard } from './welcome.guard';
import { SharedModule } from '../shared/shared.module';
import { WelcomeHomeComponent } from './welcome-home/welcome-home.component';
import { WelcomeSiteComponent } from './welcome-site/welcome-site.component';

@NgModule({
  declarations: [
    WelcomeHomeComponent,
    WelcomeSiteComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    WelcomeRoutingModule,
    SharedModule
  ],
  providers: [
    WelcomeGuard
  ]
})
export class WelcomeModule { }
