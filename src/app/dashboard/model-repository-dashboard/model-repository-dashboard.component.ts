import { Component } from '@angular/core';
import { ModelRepositoryDashboardService } from './model-repository-dashboard.service';
import {
  MethodElementInfo,
  MethodElementsInfoService,
} from '../../development-processes/shared/method-elements-info.service';
import { Icon } from '../../model/icon';
import { Domain } from '../../development-process-registry/knowledge/domain';
import { CanvasDefinition } from '../../modules/canvas/canvas-meta-artifact/canvas-definition';
import { ExpertModel } from '../../modules/canvas/canvas-meta-artifact/expert-model';

@Component({
  selector: 'app-model-repository-dashboard',
  templateUrl: './model-repository-dashboard.component.html',
  styleUrls: ['./model-repository-dashboard.component.scss'],
  providers: [ModelRepositoryDashboardService],
})
export class ModelRepositoryDashboardComponent {
  constructor(
    private methodElementsInfoService: MethodElementsInfoService,
    private modelRepositoryDashboardService: ModelRepositoryDashboardService
  ) {}

  get domainsElement(): MethodElementInfo {
    return this.methodElementsInfoService.methodElementInfoMap['Domains'];
  }

  get numberOfDomains(): number | undefined {
    return this.modelRepositoryDashboardService.numberElements[Domain.typeName];
  }

  readonly canvasModelsElement: MethodElementInfo = {
    name: 'Canvas Models',
    description: 'Canvas Models different types of canvases for visualisation',
    icon: new Icon(undefined, CanvasDefinition.defaultIcon),
    route: ['/', 'canvas', 'definitions'],
  };

  get numberOfCanvasModels(): number | undefined {
    return this.modelRepositoryDashboardService.numberElements[
      CanvasDefinition.typeName
    ];
  }

  readonly expertModelsElement: MethodElementInfo = {
    name: 'Canvas Building Blocks',
    description:
      'Canvas Building Blocks represent the knowledge of experts about a certain domain',
    icon: new Icon(undefined, ExpertModel.defaultIcon),
    route: ['/', 'expertModels'],
  };

  get numberOfExpertModels(): number | undefined {
    return this.modelRepositoryDashboardService.numberElements[
      ExpertModel.typeName
    ];
  }
}
