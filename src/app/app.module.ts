import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import { SettingsService } from './settings.service';
import { registerLocaleData } from '@angular/common';
import localeBr from '@angular/common/locales/pt';
registerLocaleData(localeBr);

import localeHe from '@angular/common/locales/he';
registerLocaleData(localeHe);

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { Globals } from './shared/constants';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    FontAwesomeModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot()
  ],
  exports: [],
  providers: [
    //Set Locale
    SettingsService,
     {
       provide: LOCALE_ID,
       deps: [SettingsService],
       useFactory: (settingsService: SettingsService) => settingsService.getLocale()
     },
     Globals //Globals vars
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor() {
    library.add(fas, far);
  }
}
