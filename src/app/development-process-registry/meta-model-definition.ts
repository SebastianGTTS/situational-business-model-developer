import { ArtifactDataReference } from './running-process/artifact-data';
import { Router } from '@angular/router';

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

export interface MetaModelDefinition {
  name: string;
  type: any;
  api?: MetaModelApi;
}
