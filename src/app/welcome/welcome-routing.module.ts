import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome.component';
import { NgModule } from '@angular/core';
import { WelcomeGuard } from './welcome.guard';

const routes: Routes = [
    {
      path: '', 
      component: WelcomeComponent, 
      canActivateChild: [
        WelcomeGuard
      ],
      children: [
        // { path: ':contexto', component: WelcomeComponent }
      ]
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class WelcomeRoutingModule { }