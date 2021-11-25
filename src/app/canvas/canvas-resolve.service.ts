import { Injectable } from '@angular/core';
import {
  ArtifactData,
  ArtifactDataType,
} from '../development-process-registry/running-process/artifact-data';
import { InstanceArtifactData } from '../canvas-meta-model/instance-artifact-data';
import { RunningProcessService } from '../development-process-registry/running-process/running-process.service';
import { StepInfo } from '../development-process-registry/module-api/step-info';

@Injectable({
  providedIn: 'root',
})
export class CanvasResolveService {
  constructor(private runningProcessService: RunningProcessService) {}

  resolveCreateCanvas(
    stepInfo: StepInfo,
    companyModelId: string,
    instanceId: number
  ): void {
    const artifactData = this.getArtifactData(companyModelId, instanceId);
    void this.runningProcessService.finishExecuteStep(stepInfo, {
      outputArtifactData: [artifactData],
    });
  }

  resolveEditCanvas(
    stepInfo: StepInfo,
    companyModelId: string,
    instanceId: number
  ): void {
    const artifactData = this.getArtifactData(companyModelId, instanceId);
    void this.runningProcessService.finishExecuteStep(stepInfo, {
      outputArtifactData: [artifactData],
    });
  }

  private getArtifactData(
    companyModelId: string,
    instanceId: number
  ): ArtifactData {
    return new ArtifactData({
      data: new InstanceArtifactData({
        id: companyModelId,
        instanceId,
      }),
      type: ArtifactDataType.REFERENCE,
    });
  }
}
