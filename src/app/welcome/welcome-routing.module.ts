import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { WelcomeGuard } from './welcome.guard';
import { WelcomeHomeComponent } from './welcome-home/welcome-home.component';
import { WelcomeSiteComponent } from './welcome-site/welcome-site.component';
import { DelatationListComponent } from '../site/delatation-list/delatation-list.component';
import { DelatationGuard } from '../site/delatation.guard';
import { DelatationFormComponent } from '../site/delatation-form/delatation-form.component';
import { SignComponent } from '../sign/sign.component';
import { DelatationLoggedGuard } from '../site/delatation-logged.guard';

const routes: Routes = [
    {
      path: '', 
      component: WelcomeSiteComponent,
      children: [
        {
          path: ':context/denunciar', 
          component: DelatationFormComponent
        },
        {
          path: ':context/denunciar/:cpf', 
          component: DelatationFormComponent,
          resolve: { 
            opts: DelatationLoggedGuard
          }
        },
        {
          path: ':context/denuncias', 
          component: DelatationListComponent, 
          resolve: { company: DelatationGuard }
        },
        {
          path: ':context/denuncias/:cpf', 
          component: DelatationListComponent, 
          resolve: { user: DelatationGuard }
        },
        {
          path: ':context/denuncia/:protocol', 
          component: DelatationListComponent, 
          resolve: { delatation: DelatationGuard }
        },
        {
          path: ':context/entrar', 
          loadChildren: '../sign/sign.module#SignModule'
        },
        {
          path: ':context/:cpf',
          component: WelcomeHomeComponent
        },
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