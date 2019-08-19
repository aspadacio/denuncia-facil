import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UsersResolverGuard } from './users-resolver.guard';

const routes: Routes = [
  {
    path: '', component: UsersListComponent
  },
  {
    path: 'new', 
    component: UserFormComponent, 
    resolve: { user: UsersResolverGuard }
  },
  {
    path: 'edit/:id', 
    component: UserFormComponent, 
    resolve: { user: UsersResolverGuard }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
