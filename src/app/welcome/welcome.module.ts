import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxMaskModule } from 'ngx-mask';
import { DelationsService } from '../delatations/delations.service';
import { SharedModule } from '../shared/shared.module';
import { DelatationFormComponent } from '../site/delatation-form/delatation-form.component';
import { DelatationListComponent } from '../site/delatation-list/delatation-list.component';
import { WelcomeHomeComponent } from './welcome-home/welcome-home.component';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeSiteComponent } from './welcome-site/welcome-site.component';
import { WelcomeGuard } from './welcome.guard';
import { DateTimeFormatPipeThis } from '../shared/pipes/date-time-format.pipe';
import { SplitPipe } from '../shared/pipes/split.pipe';

@NgModule({
  declarations: [
    WelcomeHomeComponent,
    WelcomeSiteComponent,
    DelatationListComponent,
    DelatationFormComponent
  ],
  imports: [
    CommonModule,
    NgxMaskModule.forRoot(),
    FontAwesomeModule,
    ReactiveFormsModule,
    WelcomeRoutingModule,
    SharedModule
  ],
  providers: [
    WelcomeGuard,
    DelationsService,
    DateTimeFormatPipeThis,
    SplitPipe
  ]
})
export class WelcomeModule { }
