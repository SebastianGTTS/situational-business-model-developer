import { Injectable } from '@angular/core';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import {
  ArtifactData,
  ArtifactDataReference,
  ArtifactDataType,
} from './artifact-data';
import { MetaModelService } from '../meta-model.service';

export enum ArtifactDataErrors {
  WRONG_ARTIFACT_TYPE = 'You can only delete reference artifacts',
}

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class ArtifactDataService {
  constructor(private metaModelService: MetaModelService) {}

  /**
   * Removes an artifact reference
   *
   * @param artifact the artifact to remove
   */
  async remove(artifact: ArtifactData): Promise<void> {
    if (artifact.type !== ArtifactDataType.REFERENCE) {
      throw new Error(ArtifactDataErrors.WRONG_ARTIFACT_TYPE);
    }
    const reference: ArtifactDataReference = artifact.data;
    const api = this.metaModelService.getMetaModelApi(reference.type);
    try {
      await api.remove(reference);
    } catch (error) {
      if (
        error.status === 404 &&
        error.name === 'not_found' &&
        error.reason === 'deleted'
      ) {
        console.log(reference.id + ' (' + reference.type + ') already deleted');
      } else {
        throw error;
      }
    }
  }

  /**
   * Copy an artifact reference
   *
   * @param artifact the artifact to copy
   * @return the copied artifact
   */
  async copy(artifact: ArtifactData): Promise<ArtifactData> {
    if (artifact.type !== ArtifactDataType.REFERENCE) {
      throw new Error(ArtifactDataErrors.WRONG_ARTIFACT_TYPE);
    }
    const reference: ArtifactDataReference = artifact.data;
    const api = this.metaModelService.getMetaModelApi(reference.type);
    return new ArtifactData(undefined, {
      ...artifact,
      data: await api.copy(reference),
    });
  }
}
