import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DelatationsListComponent } from './delatations-list/delatations-list.component';
import { DelationFormComponent } from './delation-form/delation-form.component';
import { DelationsResolverGuard } from './delations-resolver.guard';
import { NotFoundComponent } from '../shared/not-found/not-found.component';

const routes: Routes = [
  {
    path: '', 
    component: DelatationsListComponent,
    children: [
      
      {
        path: "editar/:id",
        component: DelationFormComponent,
        resolve: { delation: DelationsResolverGuard }
      },
      {
        path: "detalhes/:protocol",
        component: DelatationsListComponent,
        resolve: { delation: DelationsResolverGuard }
      }
    ]
  },
  {
    path: "novo",
    component: DelationFormComponent
  },
  {
    path: "nao-encontrado",
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
],
  exports: [RouterModule]
})
export class DelatationsRoutingModule { }
