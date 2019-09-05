import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  // { path: ':context', component: WelcomeComponent },
  { path: 'empresas', loadChildren: './companies/companies.module#CompaniesModule' },
  { path: 'usuarios', loadChildren: './users/users.module#UsersModule' },
  { path: 'denuncias', loadChildren: './delatations/delatations.module#DelatationsModule' },
  { path: 'entrar', loadChildren: './sign/sign.module#SignModule' },
  { path: 'inicio', loadChildren: './welcome/welcome.module#WelcomeModule' }
];

@NgModule({
  imports: [
    //To reload the self-page. RouterActive doesnt works here.
    RouterModule.forRoot(routes)
      // {  onSameUrlNavigation: 'reload'})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
