import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RunningProcessService } from '../../development-process-registry/running-process/running-process.service';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';
import { RunningMethod } from '../../development-process-registry/running-process/running-method';
import { FormArray } from '@angular/forms';
import { OutputArtifactMappingFormService } from '../shared/output-artifact-mapping-form.service';
import { Comment } from '../../development-process-registry/running-process/comment';
import { ArtifactDataReference } from '../../development-process-registry/running-process/artifact-data';
import { MetaModelApi } from '../../development-process-registry/meta-model-definition';
import { RunningMethodLoaderService } from '../shared/running-method-loader.service';

enum State {
  INPUT_SELECTION,
  EXECUTION,
  OUTPUT_SELECTION,
}

@Component({
  selector: 'app-running-process-method',
  templateUrl: './running-process-method.component.html',
  styleUrls: ['./running-process-method.component.css'],
  providers: [RunningMethodLoaderService],
})
export class RunningProcessMethodComponent {
  constructor(
    private outputArtifactMappingFormService: OutputArtifactMappingFormService,
    private route: ActivatedRoute,
    private router: Router,
    private runningMethodLoaderService: RunningMethodLoaderService,
    private runningProcessService: RunningProcessService
  ) {}

  async selectInputArtifacts(inputArtifactMapping: FormArray): Promise<void> {
    const inputArtifactMappingValue = inputArtifactMapping.value;
    const inputArtifactMap = (mapping: {
      artifact: number;
    }): { artifact: number; version: number } => {
      return {
        artifact: mapping.artifact,
        version:
          this.runningProcess.artifacts[mapping.artifact].versions.length - 1,
      };
    };
    await this.runningProcessService.setInputArtifacts(
      this.runningProcess,
      this.runningMethod.executionId,
      inputArtifactMappingValue.map(inputArtifactMap)
    );
  }

  async executeMethodStep(): Promise<void> {
    await this.runningProcessService.executeMethodStep(
      this.runningProcess,
      this.runningMethod.executionId
    );
  }

  async updateOutputArtifacts(
    outputArtifactsMapping: FormArray
  ): Promise<void> {
    const mapping = this.outputArtifactMappingFormService.get(
      outputArtifactsMapping.value
    );
    await this.runningProcessService.updateOutputArtifacts(
      this.runningProcess,
      this.runningMethod.executionId,
      mapping
    );
  }

  async finishExecution(): Promise<void> {
    let runningProcess = this.runningProcess;
    await this.runningProcessService.stopMethodExecution(
      runningProcess,
      this.runningMethod.executionId
    );
    runningProcess = await this.runningProcessService.get(runningProcess._id);
    await this.runningProcessService.jumpSteps(runningProcess);
    await this.router.navigate([
      'runningprocess',
      'runningprocessview',
      runningProcess._id,
    ]);
  }

  async abortMethodExecution(): Promise<void> {
    await this.runningProcessService.abortMethodExecution(
      this.runningProcess,
      this.runningMethod.executionId
    );
    await this.router.navigate([
      'runningprocess',
      'runningprocessview',
      this.runningProcess._id,
    ]);
  }

  async addComment(comment: Comment): Promise<void> {
    await this.runningProcessService.addComment(
      this.runningProcess._id,
      this.runningMethod.executionId,
      comment
    );
  }

  async updateComment(comment: Comment): Promise<void> {
    await this.runningProcessService.updateComment(
      this.runningProcess._id,
      this.runningMethod.executionId,
      comment
    );
  }

  async removeComment(commentId: string): Promise<void> {
    await this.runningProcessService.removeComment(
      this.runningProcess._id,
      this.runningMethod.executionId,
      commentId
    );
  }

  viewArtifactReference(
    reference: ArtifactDataReference,
    api: MetaModelApi
  ): void {
    api.view(reference, this.router, {
      referenceType: 'Method',
      runningProcessId: this.runningProcess._id,
      executionId: this.runningMethod.executionId,
    });
  }

  getState(): State {
    if (this.runningMethod.inputArtifacts == null) {
      return State.INPUT_SELECTION;
    } else if (this.runningMethod.hasStepsLeft()) {
      return State.EXECUTION;
    } else {
      return State.OUTPUT_SELECTION;
    }
  }

  getStateInputSelection(): State {
    return State.INPUT_SELECTION;
  }

  getStateExecution(): State {
    return State.EXECUTION;
  }

  getStateOutputSelection(): State {
    return State.OUTPUT_SELECTION;
  }

  get error(): boolean {
    return this.runningMethodLoaderService.error;
  }

  get errorStatus(): number {
    return this.runningMethodLoaderService.errorStatus;
  }

  get errorReason(): string {
    return this.runningMethodLoaderService.errorReason;
  }

  get runningProcess(): RunningProcess {
    return this.runningMethodLoaderService.runningProcess;
  }

  get runningMethod(): RunningMethod {
    return this.runningMethodLoaderService.runningMethod;
  }
}
