import { Injectable } from '@angular/core';
import { RunningProcessService } from '../../../development-process-registry/running-process/running-process.service';
import { DbId } from '../../../database/database-entry';
import {
  ArtifactData,
  ArtifactDataReference,
  ArtifactDataType,
} from '../../../development-process-registry/running-process/artifact-data';
import { HypoMoMapTree } from '../hypo-mo-map-meta-artifact/hypo-mo-map-tree';
import { StepInfo } from '../../../development-process-registry/module-api/step-info';
import { ArtifactVersionId } from '../../../development-process-registry/running-process/artifact-version';

@Injectable({
  providedIn: 'root',
})
export class HypoMoMapToolResolveService {
  constructor(private runningProcessService: RunningProcessService) {}

  async resolveCreateHypoMoMapManually(
    runningProcessId: DbId,
    hypoMoMapTreeId: DbId,
    artifactId: DbId
  ): Promise<void> {
    await this.runningProcessService.addInternalArtifact(
      runningProcessId,
      artifactId,
      this.getHypoMoMapData(hypoMoMapTreeId)
    );
  }

  async resolveEditHypoMoMapManually(
    runningProcessId: DbId,
    artifactVersionId: ArtifactVersionId
  ): Promise<void> {
    await this.runningProcessService.finishEditInternalArtifact(
      runningProcessId,
      artifactVersionId
    );
  }

  async resolve(stepInfo: StepInfo, hypoMoMapTreeId: DbId): Promise<void> {
    const hypoMoMapTreeData = this.getHypoMoMapData(hypoMoMapTreeId);
    await this.runningProcessService.finishExecuteStep(stepInfo, {
      outputArtifactData: [hypoMoMapTreeData],
    });
  }

  // noinspection JSMethodCanBeStatic
  private getHypoMoMapData(hypoMoMapTreeId: DbId): ArtifactData {
    const reference: ArtifactDataReference = {
      id: hypoMoMapTreeId,
      type: HypoMoMapTree.typeName,
    };
    return new ArtifactData(undefined, {
      data: reference,
      type: ArtifactDataType.REFERENCE,
    });
  }
}
