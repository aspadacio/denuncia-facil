import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyFormComponent } from './company-form/company-form.component';
import { CompaniesListComponent } from './companies-list/companies-list.component';
import { CompaniesResolverGuard } from './companies-resolver.guard';

const routes: Routes = [
  {
    path: '', component: CompaniesListComponent
  },
  {
    path: "new",
    component: CompanyFormComponent,
    resolve: { company: CompaniesResolverGuard }
  },
  {
    path: "edit/:id",
    component: CompanyFormComponent,
    resolve: { company: CompaniesResolverGuard }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniesRoutingModule { }
