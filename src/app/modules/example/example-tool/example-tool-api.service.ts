import { Injectable } from '@angular/core';
import { ModuleApiService } from '../../../development-process-registry/module-api/module-api-service';
import { MethodExecutionInput } from '../../../development-process-registry/module-api/method-execution-input';
import { StepInfo } from '../../../development-process-registry/module-api/step-info';
import { ArtifactDataReference } from '../../../development-process-registry/running-process/artifact-data';

@Injectable({
  providedIn: 'root',
})
export class ExampleToolApiService implements ModuleApiService {
  private createExample(input: MethodExecutionInput): void {
    const stepInfo: StepInfo = this.getStepInfo(input);
    void input.router.navigate(['example', 'examples', 'create'], {
      queryParams: stepInfo,
    });
  }

  private editExample(input: MethodExecutionInput): void {
    const stepInfo: StepInfo = this.getStepInfo(input);
    const reference: ArtifactDataReference = input.inputStepArtifacts[0].data
      .data as ArtifactDataReference;
    void input.router.navigate(['example', 'examples', reference.id, 'edit'], {
      queryParams: stepInfo,
    });
  }

  private viewExample(input: MethodExecutionInput): void {
    const stepInfo: StepInfo = this.getStepInfo(input);
    const reference: ArtifactDataReference = input.inputStepArtifacts[0].data
      .data as ArtifactDataReference;
    void input.router.navigate(['example', 'examples', reference.id, 'view'], {
      queryParams: stepInfo,
    });
  }

  executeMethod(methodName: string, input: MethodExecutionInput): void {
    switch (methodName) {
      case 'createExample':
        this.createExample(input);
        break;
      case 'editExample':
        this.editExample(input);
        break;
      case 'viewExample':
        this.viewExample(input);
        break;
      default:
        throw new Error('Not implemented');
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
