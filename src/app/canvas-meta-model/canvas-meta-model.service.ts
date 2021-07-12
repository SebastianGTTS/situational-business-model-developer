import { Injectable } from '@angular/core';
import { MetaModelService } from '../development-process-registry/meta-model.service';
import { CompanyModel } from './company-model';
import { MetaModelDefinition } from '../development-process-registry/meta-model-definition';
import { CanvasMetaModelApiService } from './canvas-meta-model-api.service';
import { ArtifactDataReference } from '../development-process-registry/running-process/artifact-data';
import { Router } from '@angular/router';

@Injectable()
export class CanvasMetaModelService {

  constructor(
    private canvasMetaModelApiService: CanvasMetaModelApiService,
    private metaModelService: MetaModelService,
  ) {
  }

  init() {
    const definition: MetaModelDefinition = {
      name: 'Canvas',
      type: CompanyModel.typeName,
      api: this.canvasMetaModelApiService,
    };
    this.metaModelService.registerMetaModel(definition);
    console.log('Registered Canvas Meta Model');
  }

  registerViewMethod(view: (model: ArtifactDataReference, router: Router, runningProcessId: string, executionId?: string) => void) {
    this.canvasMetaModelApiService.viewMethod = view;
  }

}
