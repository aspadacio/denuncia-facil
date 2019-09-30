import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignComponent } from './sign.component';
import { SignGuard } from './sign.guard';

const routes: Routes = [
  { path: '',  component: SignComponent },
  {
    path: ':toApply',
    component: SignComponent,
    resolve: { toApply: SignGuard }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignRoutingModule { }
