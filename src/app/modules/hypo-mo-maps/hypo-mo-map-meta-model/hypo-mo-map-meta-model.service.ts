import { Injectable } from '@angular/core';
import {
  MetaModelApi,
  MetaModelDefinition,
  MetaModelIdentifier,
} from '../../../development-process-registry/meta-model-definition';
import { HypoMoMapTree } from './hypo-mo-map-tree';
import { MetaModelService } from '../../../development-process-registry/meta-model.service';
import { HypoMoMapMetaModelApiService } from './hypo-mo-map-meta-model-api.service';

@Injectable()
export class HypoMoMapMetaModelService {
  readonly hypoMoMapMetaModelIdentifier: Readonly<MetaModelIdentifier> = {
    name: 'HypoMoMap',
    type: HypoMoMapTree.typeName,
  };

  constructor(
    private hypoMoMapMetaModelApiService: HypoMoMapMetaModelApiService,
    private metaModelService: MetaModelService
  ) {}

  init(): void {
    const definition: MetaModelDefinition = {
      ...this.hypoMoMapMetaModelIdentifier,
      api: this.hypoMoMapMetaModelApiService,
    };
    this.metaModelService.registerMetaModel(definition);
    console.log('Registered HypoMoMap Meta Model');
  }

  registerCreateMethod(create: MetaModelApi['create']): void {
    this.hypoMoMapMetaModelApiService.createMethod = create;
  }

  registerEditMethod(edit: MetaModelApi['edit']): void {
    this.hypoMoMapMetaModelApiService.editMethod = edit;
  }

  registerViewMethod(view: MetaModelApi['view']): void {
    this.hypoMoMapMetaModelApiService.viewMethod = view;
  }
}
