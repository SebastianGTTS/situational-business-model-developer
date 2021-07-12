import { ArtifactDataReference } from './running-process/artifact-data';
import { Router } from '@angular/router';

export interface MetaModelApi {

  view(model: ArtifactDataReference, router: Router, runningProcessId: string, executionId?: string): void;

  copy(model: ArtifactDataReference): Promise<ArtifactDataReference>;

  remove(model: ArtifactDataReference): Promise<void>;

}

export interface MetaModelDefinition {

  name: string;
  type: any;
  api?: MetaModelApi;

}
