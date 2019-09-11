import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { WelcomeGuard } from './welcome.guard';
import { WelcomeHomeComponent } from './welcome-home/welcome-home.component';
import { WelcomeSiteComponent } from './welcome-site/welcome-site.component';

const routes: Routes = [
    {
      path: '', 
      component: WelcomeSiteComponent,
      children: [
        { 
          path: ':context', 
          component: WelcomeHomeComponent,
          resolve: { context: WelcomeGuard }
        }
      ]
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class WelcomeRoutingModule { }