import { Component } from '@angular/core';
import { MethodEngineerDashboardService } from './method-engineer-dashboard.service';
import { MethodElementInfo } from '../../development-processes/shared/method-elements-info.service';
import { Icon } from '../../model/icon';
import { CompanyModel } from '../../modules/canvas/canvas-meta-artifact/company-model';
import { BmPhaseProcess } from '../../development-process-registry/bm-process/bm-phase-process';
import { BmPatternProcess } from '../../development-process-registry/bm-process/bm-pattern-process';

@Component({
  selector: 'app-method-engineer-dashboard',
  templateUrl: './method-engineer-dashboard.component.html',
  styleUrls: ['./method-engineer-dashboard.component.scss'],
  providers: [MethodEngineerDashboardService],
})
export class MethodEngineerDashboardComponent {
  constructor(
    private methodEngineerDashboardService: MethodEngineerDashboardService
  ) {}

  readonly companyModelElement: MethodElementInfo = {
    name: 'Composed Models',
    description:
      'Composed Models are used to represent merged Canvas Building Blocks',
    icon: new Icon(undefined, CompanyModel.defaultIcon),
    route: ['/', 'companyModels'],
  };

  get numberOfCompanyModels(): number | undefined {
    return this.methodEngineerDashboardService.numberOfCompanyModels;
  }

  readonly phaseBasedMethodElement: MethodElementInfo = {
    name: 'Phase-based Development Methods',
    description:
      'Phase-based Development Methods are created from Phases and Method Building Blocks',
    icon: new Icon(undefined, BmPhaseProcess.defaultIcon),
    route: ['/', 'bmprocess', 'phase'],
  };

  get numberOfPhaseBasedMethods(): number | undefined {
    return this.methodEngineerDashboardService.numberOfPhaseBasedMethods;
  }

  readonly patternBasedMethodElement: MethodElementInfo = {
    name: 'Pattern-based Development Methods',
    description:
      'Pattern-based Development Methods are created from Method Patterns and Method Building Blocks',
    icon: new Icon(undefined, BmPatternProcess.defaultIcon),
    route: ['/', 'bmprocess', 'pattern'],
  };

  get numberOfPatternBasedMethods(): number | undefined {
    return this.methodEngineerDashboardService.numberOfPatternBasedMethods;
  }
}
