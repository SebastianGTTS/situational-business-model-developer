import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { BusinessDeveloperDashboardComponent } from './business-developer-dashboard/business-developer-dashboard.component';
import { MethodRepositoryDashboardComponent } from './method-repository-dashboard/method-repository-dashboard.component';
import { DashboardItemComponent } from './dashboard-item/dashboard-item.component';
import { ModelRepositoryDashboardComponent } from './model-repository-dashboard/model-repository-dashboard.component';
import { MethodEngineerDashboardComponent } from './method-engineer-dashboard/method-engineer-dashboard.component';

@NgModule({
  declarations: [
    BusinessDeveloperDashboardComponent,
    DashboardItemComponent,
    MethodEngineerDashboardComponent,
    MethodRepositoryDashboardComponent,
    ModelRepositoryDashboardComponent,
  ],
  imports: [DashboardRoutingModule, SharedModule],
})
export class DashboardModule {}
