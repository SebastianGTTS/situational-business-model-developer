import { Injectable } from '@angular/core';
import { RunningProcessService } from '../development-process-registry/running-process/running-process.service';
import { StepInfo } from '../development-process-registry/module-api/step-info';
import {
  ArtifactData,
  ArtifactDataReference,
  ArtifactDataType,
} from '../development-process-registry/running-process/artifact-data';
import { DbId } from '../database/database-entry';
import { WhiteboardInstance } from '../whiteboard-meta-model/whiteboard-instance';

@Injectable({
  providedIn: 'root',
})
export class WhiteboardResolveService {
  constructor(private runningProcessService: RunningProcessService) {}

  resolve(stepInfo: StepInfo, whiteboardInstanceId: DbId): void {
    const placeData = this.getPlaceData(whiteboardInstanceId);
    void this.runningProcessService.finishExecuteStep(stepInfo, {
      outputArtifactData: [placeData],
    });
  }

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
