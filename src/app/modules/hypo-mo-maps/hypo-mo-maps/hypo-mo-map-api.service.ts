import { Injectable } from '@angular/core';
import { ModuleApiService } from '../../../development-process-registry/module-api/module-api-service';
import { MethodExecutionInput } from '../../../development-process-registry/module-api/method-execution-input';
import { StepInfo } from '../../../development-process-registry/module-api/step-info';
import { ArtifactDataReference } from '../../../development-process-registry/running-process/artifact-data';
import { HypoMoMapTreeService } from '../hypo-mo-map-meta-model/hypo-mo-map-tree.service';

@Injectable({
  providedIn: 'root',
})
export class HypoMoMapApiService implements ModuleApiService {
  constructor(private hypoMoMapTreeService: HypoMoMapTreeService) {}

  private createHypoMoMap(input: MethodExecutionInput): void {
    const stepInfo = this.getStepInfo(input);
    void input.router.navigate(['hypomomaps', 'hypomomaps', 'create'], {
      queryParams: stepInfo,
    });
  }

  private async addHypotheses(input: MethodExecutionInput): Promise<void> {
    const stepInfo = this.getStepInfo(input);
    const reference: ArtifactDataReference = input.inputStepArtifacts[0].data
      .data as ArtifactDataReference;
    const hypoMoMapTree = await this.hypoMoMapTreeService.get(reference.id);
    await input.router.navigate(
      [
        'hypomomaps',
        'hypomomaps',
        reference.id,
        'version',
        hypoMoMapTree.getLatestHypoMoMap().id,
        'hypotheses',
      ],
      { queryParams: stepInfo }
    );
  }

  private async addExperiments(input: MethodExecutionInput): Promise<void> {
    const stepInfo = this.getStepInfo(input);
    const reference: ArtifactDataReference = input.inputStepArtifacts[0].data
      .data as ArtifactDataReference;
    const hypoMoMapTree = await this.hypoMoMapTreeService.get(reference.id);
    await input.router.navigate(
      [
        'hypomomaps',
        'hypomomaps',
        reference.id,
        'version',
        hypoMoMapTree.getLatestHypoMoMap().id,
        'experiments',
      ],
      { queryParams: stepInfo }
    );
  }

  private async executeExperiments(input: MethodExecutionInput): Promise<void> {
    const stepInfo = this.getStepInfo(input);
    const reference: ArtifactDataReference = input.inputStepArtifacts[0].data
      .data as ArtifactDataReference;
    const hypoMoMapTree = await this.hypoMoMapTreeService.get(reference.id);
    await input.router.navigate(
      [
        'hypomomaps',
        'hypomomaps',
        reference.id,
        'version',
        hypoMoMapTree.getLatestHypoMoMap().id,
        'execute',
      ],
      { queryParams: stepInfo }
    );
  }

  private async editHypoMoMap(input: MethodExecutionInput): Promise<void> {
    const stepInfo = this.getStepInfo(input);
    const reference: ArtifactDataReference = input.inputStepArtifacts[0].data
      .data as ArtifactDataReference;
    const hypoMoMapTree = await this.hypoMoMapTreeService.get(reference.id);
    await input.router.navigate(
      [
        'hypomomaps',
        'hypomomaps',
        reference.id,
        'version',
        hypoMoMapTree.getLatestHypoMoMap().id,
        'edit',
      ],
      { queryParams: stepInfo }
    );
  }

  private async viewHypoMoMap(input: MethodExecutionInput): Promise<void> {
    const stepInfo = this.getStepInfo(input);
    const reference: ArtifactDataReference = input.inputStepArtifacts[0].data
      .data as ArtifactDataReference;
    const hypoMoMapTree = await this.hypoMoMapTreeService.get(reference.id);
    await input.router.navigate(
      [
        'hypomomaps',
        'hypomomaps',
        reference.id,
        'version',
        hypoMoMapTree.getLatestHypoMoMap().id,
        'view',
      ],
      { queryParams: stepInfo }
    );
  }

  executeMethod(methodName: string, input: MethodExecutionInput): void {
    switch (methodName) {
      case 'createHypoMoMap':
        this.createHypoMoMap(input);
        break;
      case 'addHypotheses':
        void this.addHypotheses(input);
        break;
      case 'addExperiments':
        void this.addExperiments(input);
        break;
      case 'executeExperiments':
        void this.executeExperiments(input);
        break;
      case 'editHypoMoMap':
        void this.editHypoMoMap(input);
        break;
      case 'viewHypoMoMap':
        void this.viewHypoMoMap(input);
        break;
    }
  }

  // noinspection JSMethodCanBeStatic
  private getStepInfo(input: MethodExecutionInput): StepInfo {
    return {
      step: input.runningMethod.currentStepNumber,
      executionId: input.runningMethod.executionId,
      runningProcessId: input.runningProcess._id,
    };
  }
}
