import { Injectable } from '@angular/core';
import { RunningProcessService } from '../../../development-process-registry/running-process/running-process.service';
import { StepInfo } from '../../../development-process-registry/module-api/step-info';
import {
  ArtifactData,
  ArtifactDataReference,
  ArtifactDataType,
} from '../../../development-process-registry/running-process/artifact-data';
import { DbId } from '../../../database/database-entry';
import { WhiteboardInstance } from '../whiteboard-meta-model/whiteboard-instance';
import { ArtifactVersionId } from '../../../development-process-registry/running-process/artifact-version';

@Injectable({
  providedIn: 'root',
})
export class WhiteboardResolveService {
  constructor(private runningProcessService: RunningProcessService) {}

  async resolveCreateWhiteboardInstanceManually(
    runningProcessId: DbId,
    whiteboardInstanceId: DbId,
    artifactId: DbId
  ): Promise<void> {
    await this.runningProcessService.addInternalArtifact(
      runningProcessId,
      artifactId,
      this.getPlaceData(whiteboardInstanceId)
    );
  }

  async resolveEditWhiteboardInstanceManually(
    runningProcessId: DbId,
    artifactVersionId: ArtifactVersionId
  ): Promise<void> {
    await this.runningProcessService.finishEditInternalArtifact(
      runningProcessId,
      artifactVersionId
    );
  }

  resolve(stepInfo: StepInfo, whiteboardInstanceId: DbId): void {
    const placeData = this.getPlaceData(whiteboardInstanceId);
    void this.runningProcessService.finishExecuteStep(stepInfo, {
      outputArtifactData: [placeData],
    });
  }

  // noinspection JSMethodCanBeStatic
  private getPlaceData(whiteboardInstanceId: DbId): ArtifactData {
    const reference: ArtifactDataReference = {
      id: whiteboardInstanceId,
      type: WhiteboardInstance.typeName,
    };
    return new ArtifactData(undefined, {
      data: reference,
      type: ArtifactDataType.REFERENCE,
    });
  }
}
