import { Injectable } from '@angular/core';
import { ModuleApiService } from '../development-process-registry/module-api/module-api-service';
import { MethodExecutionInput } from '../development-process-registry/module-api/method-execution-input';
import { StepInfo } from '../development-process-registry/module-api/step-info';
import { ArtifactDataReference } from '../development-process-registry/running-process/artifact-data';

@Injectable({
  providedIn: 'root',
})
export class WhiteboardApiService implements ModuleApiService {
  constructor() {}

  createWhiteboard(input: MethodExecutionInput): void {
    const stepInfo = this.getStepInfo(input);
    void input.router.navigate(['whiteboard', 'instance', 'create'], {
      queryParams: stepInfo,
    });
  }

  editWhiteboard(input: MethodExecutionInput): void {
    const stepInfo: StepInfo = this.getStepInfo(input);
    const reference: ArtifactDataReference =
      input.inputStepArtifacts[0].data.data;
    void input.router.navigate(
      ['whiteboard', 'instance', reference.id, 'edit'],
      { queryParams: stepInfo }
    );
  }

  viewWhiteboard(input: MethodExecutionInput): void {
    const stepInfo: StepInfo = this.getStepInfo(input);
    const reference: ArtifactDataReference =
      input.inputStepArtifacts[0].data.data;
    void input.router.navigate(
      ['whiteboard', 'instance', reference.id, 'view'],
      { queryParams: stepInfo }
    );
  }

  executeMethod(methodName: string, input: MethodExecutionInput): void {
    switch (methodName) {
      case 'createWhiteboard':
        this.createWhiteboard(input);
        break;
      case 'editWhiteboard':
        this.editWhiteboard(input);
        break;
      case 'viewWhiteboard':
        this.viewWhiteboard(input);
        break;
    }
  }

  private getStepInfo(input: MethodExecutionInput): StepInfo {
    return {
      step: input.runningMethod.currentStepNumber,
      executionId: input.runningMethod.executionId,
      runningProcessId: input.runningProcess._id,
    };
  }
}
