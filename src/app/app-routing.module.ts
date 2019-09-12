import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'empresas', loadChildren: './companies/companies.module#CompaniesModule' },
  { path: 'usuarios', loadChildren: './users/users.module#UsersModule' },
  { path: 'denuncias', loadChildren: './delatations/delatations.module#DelatationsModule' },
  { path: 'entrar', loadChildren: './sign/sign.module#SignModule' },
  { path: 'site', loadChildren: './welcome/welcome.module#WelcomeModule' },
  { path: '', pathMatch: 'full', redirectTo: 'site' }
];

@NgModule({
  imports: [
    //To reload the self-page. RouterActive doesnt works here.
    RouterModule.forRoot(routes,
       {  
         onSameUrlNavigation: 'reload', 
         //useHash: true 
        }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
