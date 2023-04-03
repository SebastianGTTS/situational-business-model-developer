import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../database/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { InternalRoles } from '../role/user.service';
import { BusinessDeveloperDashboardComponent } from './business-developer-dashboard/business-developer-dashboard.component';
import { MethodRepositoryDashboardComponent } from './method-repository-dashboard/method-repository-dashboard.component';
import { ModelRepositoryDashboardComponent } from './model-repository-dashboard/model-repository-dashboard.component';
import { MethodEngineerDashboardComponent } from './method-engineer-dashboard/method-engineer-dashboard.component';

const routes: Routes = [
  {
    path: 'dashboards',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'method-repository-dashboard',
        canActivate: [RoleGuard],
        data: {
          roles: [InternalRoles.DOMAIN_EXPERT],
        },
        component: MethodRepositoryDashboardComponent,
      },
      {
        path: 'model-repository-dashboard',
        canActivate: [RoleGuard],
        data: {
          roles: [InternalRoles.DOMAIN_EXPERT],
        },
        component: ModelRepositoryDashboardComponent,
      },
      {
        path: 'method-engineer-dashboard',
        canActivate: [RoleGuard],
        data: {
          roles: [InternalRoles.METHOD_ENGINEER],
        },
        component: MethodEngineerDashboardComponent,
      },
      {
        path: 'business-developer-dashboard',
        canActivate: [RoleGuard],
        data: {
          roles: [InternalRoles.BUSINESS_DEVELOPER],
        },
        component: BusinessDeveloperDashboardComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
