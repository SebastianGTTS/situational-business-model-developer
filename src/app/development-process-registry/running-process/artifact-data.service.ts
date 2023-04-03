import { Injectable } from '@angular/core';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import {
  ArtifactData,
  ArtifactDataReference,
  ArtifactDataType,
} from './artifact-data';
import { MetaArtifactService } from '../meta-artifact.service';
import { MetaArtifactType, Reference } from '../meta-artifact-definition';
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
    private metaArtifactService: MetaArtifactService,
    private router: Router
  ) {}

  /**
   * Get the name of an internal artifact
   *
   * @param metaArtifactType
   * @param artifact
   */
  async getName(
    metaArtifactType: MetaArtifactType,
    artifact: ArtifactData
  ): Promise<string | undefined> {
    if (artifact.type !== ArtifactDataType.REFERENCE) {
      throw new Error(ArtifactDataErrors.WRONG_ARTIFACT_TYPE);
    }
    const api = this.metaArtifactService.getMetaArtifactApi(metaArtifactType);
    return api.getName(artifact.data as ArtifactDataReference);
  }

  /**
   * Creates an internal artifact
   *
   * @param metaArtifactType
   * @param reference
   * @param artifactId
   */
  create(
    metaArtifactType: MetaArtifactType,
    reference: Reference,
    artifactId: DbId
  ): void {
    const api = this.metaArtifactService.getMetaArtifactApi(metaArtifactType);
    api.create(this.router, reference, artifactId);
  }

  view(artifact: ArtifactData, reference: Reference): void {
    if (artifact.type !== ArtifactDataType.REFERENCE) {
      throw new Error(ArtifactDataErrors.WRONG_ARTIFACT_TYPE);
    }
    const artifactDataReference: ArtifactDataReference =
      artifact.data as ArtifactDataReference;
    const api = this.metaArtifactService.getMetaArtifactApi(
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
    const api = this.metaArtifactService.getMetaArtifactApi(
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
    const api = this.metaArtifactService.getMetaArtifactApi(reference.type);
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
    const api = this.metaArtifactService.getMetaArtifactApi(reference.type);
    return new ArtifactData(undefined, {
      ...artifact,
      data: await api.copy(reference),
    });
  }
}
