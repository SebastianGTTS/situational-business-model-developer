import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../database/auth.guard';
import { StartComponent } from './start/start.component';

const routes: Routes = [
  {
    path: 'start',
    canActivate: [AuthGuard],
    component: StartComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartRoutingModule {}
