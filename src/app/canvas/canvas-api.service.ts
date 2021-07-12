import { Injectable } from '@angular/core';
import { ModuleApiService } from '../development-process-registry/module-api/module-api-service';
import { MethodExecutionInput } from '../development-process-registry/module-api/method-execution-input';
import { StepInfo } from '../development-process-registry/module-api/step-info';
import { InstanceArtifactData } from '../canvas-meta-model/instance-artifact-data';

@Injectable({
  providedIn: 'root'
})
export class CanvasApiService implements ModuleApiService {

  createCanvas(input: MethodExecutionInput): void {
    const stepInfo = this.getStepInfo(input);
    input.router.navigate(['canvas', 'instance', 'create'], {queryParams: stepInfo}).then();
  }

  editCanvas(input: MethodExecutionInput): void {
    const stepInfo = this.getStepInfo(input);
    const reference: InstanceArtifactData = input.inputStepArtifacts[0].data.data;
    input.router.navigate(['canvas', reference.id, 'instance', reference.instanceId, 'edit'], {queryParams: stepInfo}).then();
  }

  refineCanvas(input: MethodExecutionInput): void {
    const stepInfo = this.getStepInfo(input);
    const reference: InstanceArtifactData = input.inputStepArtifacts[0].data.data;
    input.router.navigate(['canvas', reference.id, 'instance', reference.instanceId, 'refine'], {queryParams: stepInfo}).then();
  }

  compareCompetitors(input: MethodExecutionInput): void {
    const stepInfo = this.getStepInfo(input);
    const reference: InstanceArtifactData = input.inputStepArtifacts[0].data.data;
    input.router.navigate(['canvas', reference.id, 'instance', reference.instanceId, 'compare'], {queryParams: stepInfo}).then();
  }

  createCompetitors(input: MethodExecutionInput): void {
    const stepInfo = this.getStepInfo(input);
    const reference: InstanceArtifactData = input.inputStepArtifacts[0].data.data;
    input.router.navigate(['canvas', reference.id, 'instance', reference.instanceId, 'competitors'], {queryParams: stepInfo}).then();
  }

  manageCompetitors(input: MethodExecutionInput): void {
    const stepInfo = this.getStepInfo(input);
    const reference: InstanceArtifactData = input.inputStepArtifacts[0].data.data;
    input.router.navigate(
      ['canvas', reference.id, 'instance', reference.instanceId, 'competitors', 'edit'],
      {queryParams: stepInfo}
    ).then();
  }

  viewCanvas(input: MethodExecutionInput): void {
    const stepInfo = this.getStepInfo(input);
    const reference: InstanceArtifactData = input.inputStepArtifacts[0].data.data;
    input.router.navigate(
      ['canvas', reference.id, 'instance', reference.instanceId, 'view'],
      {queryParams: stepInfo}
    ).then();
  }

  editModel(input: MethodExecutionInput): void {
    const stepInfo = this.getStepInfo(input);
    const reference: InstanceArtifactData = input.inputStepArtifacts[0].data.data;
    input.router.navigate(
      ['canvas', reference.id, 'instance', reference.instanceId, 'model', 'edit'],
      {queryParams: stepInfo}
    ).then();
  }

  executeMethod(methodName: string, input: MethodExecutionInput): void {
    switch (methodName) {
      case 'createCanvas':
        this.createCanvas(input);
        break;
      case 'editCanvas':
        this.editCanvas(input);
        break;
      case 'refineCanvas':
        this.refineCanvas(input);
        break;
      case 'compareCompetitors':
        this.compareCompetitors(input);
        break;
      case 'createCompetitors':
        this.createCompetitors(input);
        break;
      case 'manageCompetitors':
        this.manageCompetitors(input);
        break;
      case 'viewCanvas':
        this.viewCanvas(input);
        break;
      case 'editModel':
        this.editModel(input);
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
