import { Injectable } from '@angular/core';
import { MetaModelService } from '../../../development-process-registry/meta-model.service';
import { CompanyModel } from './company-model';
import {
  MetaModelApi,
  MetaModelDefinition,
} from '../../../development-process-registry/meta-model-definition';
import { CanvasMetaModelApiService } from './canvas-meta-model-api.service';

@Injectable()
export class CanvasMetaModelService {
  constructor(
    private canvasMetaModelApiService: CanvasMetaModelApiService,
    private metaModelService: MetaModelService
  ) {}

  init(): void {
    const definition: MetaModelDefinition = {
      name: 'Canvas',
      type: CompanyModel.typeName,
      api: this.canvasMetaModelApiService,
    };
    this.metaModelService.registerMetaModel(definition);
    console.log('Registered Canvas Meta Model');
  }

  registerCreateMethod(create: MetaModelApi['create']): void {
    this.canvasMetaModelApiService.createMethod = create;
  }

  registerEditMethod(edit: MetaModelApi['edit']): void {
    this.canvasMetaModelApiService.editMethod = edit;
  }

  registerViewMethod(view: MetaModelApi['view']): void {
    this.canvasMetaModelApiService.viewMethod = view;
  }
}
