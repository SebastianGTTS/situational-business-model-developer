import { Injectable } from '@angular/core';
import { DevelopmentProcessRegistryModule } from './development-process-registry.module';
import {
  MetaModelApi,
  MetaModelDefinition,
  MetaModelType,
} from './meta-model-definition';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class MetaModelService {
  metaModels: MetaModelDefinition[] = [];

  registerMetaModel(definition: MetaModelDefinition): void {
    this.metaModels.push(definition);
  }

  getMetaModelApi(metaModelType: MetaModelType): MetaModelApi {
    return this.getMetaModelDefinition(metaModelType).api;
  }

  getMetaModelDefinition(metaModelType: MetaModelType): MetaModelDefinition {
    return this.metaModels.find(
      (metaModelDefinition) => metaModelDefinition.type === metaModelType
    );
  }
}
