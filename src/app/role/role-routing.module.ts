import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../database/auth.guard';
import { RoleSwitchComponent } from './role-switch/role-switch.component';

const routes: Routes = [
  {
    path: 'role',
    canActivate: [AuthGuard],
    component: RoleSwitchComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleRoutingModule {}
