import { Injectable } from '@angular/core';
import { DevelopmentProcessRegistryModule } from './development-process-registry.module';
import {
  MetaArtifactApi,
  MetaArtifactDefinition,
  MetaArtifactType,
} from './meta-artifact-definition';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class MetaArtifactService {
  metaArtifacts: MetaArtifactDefinition[] = [];

  registerMetaArtifact(definition: MetaArtifactDefinition): void {
    this.metaArtifacts.push(definition);
  }

  getMetaArtifactApi(
    metaArtifactType: MetaArtifactType | undefined
  ): MetaArtifactApi {
    const metaArtifactApi =
      this.getMetaArtifactDefinition(metaArtifactType)?.api;
    if (metaArtifactApi == null) {
      throw new Error('No meta artifact api for type ' + metaArtifactType);
    }
    return metaArtifactApi;
  }

  getMetaArtifactDefinition(
    metaArtifactType: MetaArtifactType | undefined
  ): MetaArtifactDefinition | undefined {
    return this.metaArtifacts.find(
      (metaArtifactDefinition) =>
        metaArtifactDefinition.type === metaArtifactType
    );
  }
}
