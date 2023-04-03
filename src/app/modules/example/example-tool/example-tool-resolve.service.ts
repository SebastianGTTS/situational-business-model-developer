import { Injectable } from '@angular/core';
import { RunningProcessService } from '../../../development-process-registry/running-process/running-process.service';
import { StepInfo } from '../../../development-process-registry/module-api/step-info';
import { DbId } from '../../../database/database-entry';
import {
  ArtifactData,
  ArtifactDataReference,
  ArtifactDataType,
} from '../../../development-process-registry/running-process/artifact-data';
import { Example } from '../example-meta-artifact/example';
import { ArtifactVersionId } from '../../../development-process-registry/running-process/artifact-version';

@Injectable({
  providedIn: 'root',
})
export class ExampleToolResolveService {
  constructor(private runningProcessService: RunningProcessService) {}

  resolve(stepInfo: StepInfo, exampleId: DbId): void {
    void this.runningProcessService.finishExecuteStep(stepInfo, {
      outputArtifactData: [this.getArtifactData(exampleId)],
    });
  }

  async resolveCreateManually(
    runningProcessId: DbId,
    exampleId: DbId,
    artifactId: DbId
  ): Promise<void> {
    await this.runningProcessService.addInternalArtifact(
      runningProcessId,
      artifactId,
      this.getArtifactData(exampleId)
    );
  }

  async resolveEditManually(
    runningProcessId: DbId,
    artifactVersionId: ArtifactVersionId
  ): Promise<void> {
    await this.runningProcessService.finishEditInternalArtifact(
      runningProcessId,
      artifactVersionId
    );
  }

  // noinspection JSMethodCanBeStatic
  private getArtifactData(exampleId: DbId): ArtifactData {
    const reference: ArtifactDataReference = {
      id: exampleId,
      type: Example.typeName,
    };
    return new ArtifactData(undefined, {
      data: reference,
      type: ArtifactDataType.REFERENCE,
    });
  }
}
