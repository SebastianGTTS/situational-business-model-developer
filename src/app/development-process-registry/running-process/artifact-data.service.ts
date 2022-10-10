import { Injectable } from '@angular/core';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import {
  ArtifactData,
  ArtifactDataReference,
  ArtifactDataType,
} from './artifact-data';
import { MetaModelService } from '../meta-model.service';
import { MetaModelType, Reference } from '../meta-model-definition';
import { Router } from '@angular/router';
import { DbId } from '../../database/database-entry';

export enum ArtifactDataErrors {
  WRONG_ARTIFACT_TYPE = 'You can only delete reference artifacts',
}

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class ArtifactDataService {
  constructor(
    private metaModelService: MetaModelService,
    private router: Router
  ) {}

  /**
   * Get the name of an internal artifact
   *
   * @param metaModelType
   * @param artifact
   */
  async getName(
    metaModelType: MetaModelType,
    artifact: ArtifactData
  ): Promise<string | undefined> {
    if (artifact.type !== ArtifactDataType.REFERENCE) {
      throw new Error(ArtifactDataErrors.WRONG_ARTIFACT_TYPE);
    }
    const api = this.metaModelService.getMetaModelApi(metaModelType);
    return api.getName(artifact.data as ArtifactDataReference);
  }

  /**
   * Creates an internal artifact
   *
   * @param metaModelType
   * @param reference
   * @param artifactId
   */
  create(
    metaModelType: MetaModelType,
    reference: Reference,
    artifactId: DbId
  ): void {
    const api = this.metaModelService.getMetaModelApi(metaModelType);
    api.create(this.router, reference, artifactId);
  }

  view(artifact: ArtifactData, reference: Reference): void {
    if (artifact.type !== ArtifactDataType.REFERENCE) {
      throw new Error(ArtifactDataErrors.WRONG_ARTIFACT_TYPE);
    }
    const artifactDataReference: ArtifactDataReference =
      artifact.data as ArtifactDataReference;
    const api = this.metaModelService.getMetaModelApi(
      artifactDataReference.type
    );
    api.view(artifactDataReference, this.router, reference);
  }

  /**
   * Edit an internal artifact
   *
   * @param artifact
   * @param reference
   */
  edit(artifact: ArtifactData, reference: Reference): void {
    if (artifact.type !== ArtifactDataType.REFERENCE) {
      throw new Error(ArtifactDataErrors.WRONG_ARTIFACT_TYPE);
    }
    const artifactDataReference: ArtifactDataReference =
      artifact.data as ArtifactDataReference;
    const api = this.metaModelService.getMetaModelApi(
      artifactDataReference.type
    );
    api.edit(artifactDataReference, this.router, reference);
  }

  /**
   * Removes an artifact reference
   *
   * @param artifact the artifact to remove
   */
  async remove(artifact: ArtifactData): Promise<void> {
    if (artifact.type !== ArtifactDataType.REFERENCE) {
      throw new Error(ArtifactDataErrors.WRONG_ARTIFACT_TYPE);
    }
    const reference: ArtifactDataReference =
      artifact.data as ArtifactDataReference;
    const api = this.metaModelService.getMetaModelApi(reference.type);
    try {
      await api.remove(reference);
    } catch (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: any
    ) {
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
    const reference: ArtifactDataReference =
      artifact.data as ArtifactDataReference;
    const api = this.metaModelService.getMetaModelApi(reference.type);
    return new ArtifactData(undefined, {
      ...artifact,
      data: await api.copy(reference),
    });
  }
}
