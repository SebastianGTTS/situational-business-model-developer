import { Injectable } from '@angular/core';
import { DevelopmentProcessRegistryModule } from './development-process-registry.module';
import { MetaModelApi, MetaModelDefinition } from './meta-model-definition';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class MetaModelService {
  metaModels: MetaModelDefinition[] = [];

  registerMetaModel(definition: MetaModelDefinition) {
    this.metaModels.push(definition);
  }

  getMetaModelApi(metaModelType: any): MetaModelApi {
    return this.getMetaModelDefinition(metaModelType).api;
  }

  getMetaModelDefinition(metaModelType: any): MetaModelDefinition {
    return this.metaModels.find(
      (metaModelDefinition) => metaModelDefinition.type === metaModelType
    );
  }
}
