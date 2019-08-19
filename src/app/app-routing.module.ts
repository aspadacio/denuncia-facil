import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'companies', loadChildren: './companies/companies.module#CompaniesModule' },
  { path: 'users', loadChildren: './users/users.module#UsersModule' },
  { path: 'delatations', loadChildren: './delatations/delatations.module#DelatationsModule' },
  { path: '', pathMatch: 'full', redirectTo: 'delatations' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
