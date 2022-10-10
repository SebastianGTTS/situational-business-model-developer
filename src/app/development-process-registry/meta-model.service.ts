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

  getMetaModelApi(metaModelType: MetaModelType | undefined): MetaModelApi {
    const metaModelApi = this.getMetaModelDefinition(metaModelType)?.api;
    if (metaModelApi == null) {
      throw new Error('No meta model api for type ' + metaModelType);
    }
    return metaModelApi;
  }

  getMetaModelDefinition(
    metaModelType: MetaModelType | undefined
  ): MetaModelDefinition | undefined {
    return this.metaModels.find(
      (metaModelDefinition) => metaModelDefinition.type === metaModelType
    );
  }
}
