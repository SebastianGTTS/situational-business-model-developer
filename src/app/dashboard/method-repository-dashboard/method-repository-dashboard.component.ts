import { Component } from '@angular/core';
import { MethodRepositoryDashboardService } from './method-repository-dashboard.service';
import {
  MethodElementInfo,
  MethodElementsInfoService,
} from '../../development-processes/shared/method-elements-info.service';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { Stakeholder } from '../../development-process-registry/method-elements/stakeholder/stakeholder';
import { Tool } from '../../development-process-registry/method-elements/tool/tool';
import { SituationalFactorDefinition } from '../../development-process-registry/method-elements/situational-factor/situational-factor-definition';
import { Domain } from '../../development-process-registry/knowledge/domain';
import { Type } from '../../development-process-registry/method-elements/type/type';
import { PhaseList } from '../../development-process-registry/phase/phase-list';
import { Icon } from '../../model/icon';
import { ProcessPattern } from '../../development-process-registry/process-pattern/process-pattern';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';

@Component({
  selector: 'app-method-repository-dashboard',
  templateUrl: './method-repository-dashboard.component.html',
  styleUrls: ['./method-repository-dashboard.component.scss'],
  providers: [MethodRepositoryDashboardService],
})
export class MethodRepositoryDashboardComponent {
  constructor(
    private methodElementsInfoService: MethodElementsInfoService,
    private methodRepositoryDashboardService: MethodRepositoryDashboardService
  ) {}

  get artifactElement(): MethodElementInfo {
    return this.methodElementsInfoService.methodElementInfoMap['Artifacts'];
  }

  get numberOfArtifacts(): number | undefined {
    return this.methodRepositoryDashboardService.numberElements[
      Artifact.typeName
    ];
  }

  get stakeholdersElement(): MethodElementInfo {
    return this.methodElementsInfoService.methodElementInfoMap['Stakeholders'];
  }

  get numberOfStakeholders(): number | undefined {
    return this.methodRepositoryDashboardService.numberElements[
      Stakeholder.typeName
    ];
  }

  get toolsElement(): MethodElementInfo {
    return this.methodElementsInfoService.methodElementInfoMap['Tools'];
  }

  get numberOfTools(): number | undefined {
    return this.methodRepositoryDashboardService.numberElements[Tool.typeName];
  }

  get situationalFactorsElement(): MethodElementInfo {
    return this.methodElementsInfoService.methodElementInfoMap[
      'Situational Factors'
    ];
  }

  get numberOfSituationalFactors(): number | undefined {
    return this.methodRepositoryDashboardService.numberElements[
      SituationalFactorDefinition.typeName
    ];
  }

  get domainsElement(): MethodElementInfo {
    return this.methodElementsInfoService.methodElementInfoMap['Domains'];
  }

  get numberOfDomains(): number | undefined {
    return this.methodRepositoryDashboardService.numberElements[
      Domain.typeName
    ];
  }

  get typesElement(): MethodElementInfo {
    return this.methodElementsInfoService.methodElementInfoMap['Types'];
  }

  get numberOfTypes(): number | undefined {
    return this.methodRepositoryDashboardService.numberElements[Type.typeName];
  }

  get phasesElement(): MethodElementInfo {
    return this.methodElementsInfoService.methodElementInfoMap['Phases'];
  }

  get numberOfPhases(): number | undefined {
    return this.methodRepositoryDashboardService.numberElements[
      PhaseList.typeName
    ];
  }

  readonly patternsElement: MethodElementInfo = {
    name: 'Method Patterns',
    description:
      'Method Patterns are used to structure Method Building Blocks in pattern-based Development Methods',
    icon: new Icon(undefined, ProcessPattern.defaultIcon),
    route: ['/', 'process'],
  };

  get numberOfPatterns(): number | undefined {
    return this.methodRepositoryDashboardService.numberElements[
      ProcessPattern.typeName
    ];
  }

  readonly developmentMethodsElement: MethodElementInfo = {
    name: 'Method Building Blocks',
    description:
      'Method Building Blocks are combined Method Elements for representing Development Steps',
    icon: new Icon(undefined, DevelopmentMethod.defaultIcon),
    route: ['/', 'methods'],
  };

  get numberOfDevelopmentMethods(): number | undefined {
    return this.methodRepositoryDashboardService.numberElements[
      DevelopmentMethod.typeName
    ];
  }
}
