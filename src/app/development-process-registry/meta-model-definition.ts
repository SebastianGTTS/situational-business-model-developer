import { ArtifactDataReference } from './running-process/artifact-data';
import { Router } from '@angular/router';
import { DatabaseEntry } from '../database/database-entry';

/**
 * Used to uniquely identify meta models.
 */
export type MetaModelType = string;

export type Reference = ProcessReference | MethodReference | ArtifactReference;

export interface ProcessReference {
  referenceType: 'Process';
  runningProcessId: string;
}

export interface MethodReference {
  referenceType: 'Method';
  runningProcessId: string;
  executionId: string;
}

export interface ArtifactReference {
  referenceType: 'Artifact';
  artifactId: string;
  versionId: number;
}

export interface MetaModelApi {
  view(
    model: ArtifactDataReference,
    router: Router,
    reference: Reference
  ): void;

  getName(model: ArtifactDataReference): Promise<string | undefined>;

  copy(model: ArtifactDataReference): Promise<ArtifactDataReference>;

  remove(model: ArtifactDataReference): Promise<void>;
}

/**
 * Used to save a relation to a specific meta model in the database.
 */
export interface MetaModelIdentifier extends DatabaseEntry {
  /**
   * The name of the meta model.
   */
  name: string;

  /**
   * The type of the meta model.
   */
  type: MetaModelType;
}

export interface MetaModelDefinition {
  name: string;
  type: MetaModelType;
  api: MetaModelApi;
}
