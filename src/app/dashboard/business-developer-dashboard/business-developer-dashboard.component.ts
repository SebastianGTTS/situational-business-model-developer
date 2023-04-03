import { Component } from '@angular/core';
import { BusinessDeveloperDashboardService } from './business-developer-dashboard.service';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';

@Component({
  selector: 'app-business-developer-dashboard',
  templateUrl: './business-developer-dashboard.component.html',
  styleUrls: ['./business-developer-dashboard.component.scss'],
  providers: [BusinessDeveloperDashboardService],
})
export class BusinessDeveloperDashboardComponent {
  constructor(
    private businessDeveloperDashboardService: BusinessDeveloperDashboardService
  ) {}

  get numberOfRunningMethods(): number | undefined {
    return this.businessDeveloperDashboardService.numberOfRunningMethods;
  }

  get numberOfCompletedMethods(): number | undefined {
    return this.businessDeveloperDashboardService.numberOfCompletedMethods;
  }

  get numberOfArtifacts(): number | undefined {
    return this.businessDeveloperDashboardService.numberOfArtifacts;
  }

  get lastVisitedRunningProcess(): RunningProcess | undefined {
    return this.businessDeveloperDashboardService.lastVisitedRunningProcess;
  }
}
