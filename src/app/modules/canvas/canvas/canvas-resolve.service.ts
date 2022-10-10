import { Injectable } from '@angular/core';
import {
  ArtifactData,
  ArtifactDataType,
} from '../../../development-process-registry/running-process/artifact-data';
import { InstanceArtifactData } from '../canvas-meta-model/instance-artifact-data';
import { RunningProcessService } from '../../../development-process-registry/running-process/running-process.service';
import { StepInfo } from '../../../development-process-registry/module-api/step-info';
import { DbId } from '../../../database/database-entry';
import { ArtifactVersionId } from '../../../development-process-registry/running-process/artifact-version';

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
    const artifactData = CanvasResolveService.getArtifactData(
      companyModelId,
      instanceId
    );
    void this.runningProcessService.finishExecuteStep(stepInfo, {
      outputArtifactData: [artifactData],
    });
  }

  async resolveCreateCanvasManually(
    runningProcessId: DbId,
    companyModelId: string,
    instanceId: number,
    artifactId: DbId
  ): Promise<void> {
    await this.runningProcessService.addInternalArtifact(
      runningProcessId,
      artifactId,
      CanvasResolveService.getArtifactData(companyModelId, instanceId)
    );
  }

  async resolveEditCanvasManually(
    runningProcessId: DbId,
    artifactVersionId: ArtifactVersionId
  ): Promise<void> {
    await this.runningProcessService.finishEditInternalArtifact(
      runningProcessId,
      artifactVersionId
    );
  }

  resolveEditCanvas(
    stepInfo: StepInfo,
    companyModelId: string,
    instanceId: number
  ): void {
    const artifactData = CanvasResolveService.getArtifactData(
      companyModelId,
      instanceId
    );
    void this.runningProcessService.finishExecuteStep(stepInfo, {
      outputArtifactData: [artifactData],
    });
  }

  private static getArtifactData(
    companyModelId: string,
    instanceId: number
  ): ArtifactData {
    const instanceArtifactData: InstanceArtifactData = {
      type: 'CompanyModel',
      id: companyModelId,
      instanceId,
    };
    return new ArtifactData(undefined, {
      data: instanceArtifactData,
      type: ArtifactDataType.REFERENCE,
    });
  }
}
