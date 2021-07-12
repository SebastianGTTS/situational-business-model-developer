import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RunningProcessService } from '../../development-process-registry/running-process/running-process.service';
import { RunningProcess } from '../../development-process-registry/running-process/running-process';
import { RunningMethod } from '../../development-process-registry/running-process/running-method';
import { FormArray } from '@angular/forms';
import { OutputArtifactMappingFormService } from '../shared/output-artifact-mapping-form.service';
import { Comment } from '../../development-process-registry/running-process/comment';
import { ArtifactDataReference } from '../../development-process-registry/running-process/artifact-data';
import { MetaModelApi } from '../../development-process-registry/meta-model-definition';

enum State {
  INPUT_SELECTION, EXECUTION, OUTPUT_SELECTION,
}

@Component({
  selector: 'app-running-process-method',
  templateUrl: './running-process-method.component.html',
  styleUrls: ['./running-process-method.component.css']
})
export class RunningProcessMethodComponent implements OnInit, OnDestroy {

  runningProcess: RunningProcess;
  runningMethod: RunningMethod;

  private routeSubscription: Subscription;

  constructor(
    private outputArtifactMappingFormService: OutputArtifactMappingFormService,
    private route: ActivatedRoute,
    private router: Router,
    private runningProcessService: RunningProcessService,
  ) {
  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      const processId = paramMap.get('id');
      const executionId = paramMap.get('executionId');
      this.loadExecutionMethod(processId, executionId).then();
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  async selectInputArtifacts(inputArtifactMapping: FormArray) {
    const inputArtifactMappingValue = inputArtifactMapping.value;
    const inputArtifactMap = (mapping) => {
      if (typeof mapping.version === 'number') {
        return {
          artifact: mapping.artifact,
          version: mapping.version,
        };
      } else {
        return {
          artifact: mapping.artifact,
          version: this.runningProcess.artifacts[mapping.artifact].versions.length - 1,
        };
      }
    };
    await this.runningProcessService.setInputArtifacts(
      this.runningProcess,
      this.runningMethod.executionId,
      inputArtifactMappingValue.map(inputArtifactMap)
    );
    await this.loadExecutionMethod(this.runningProcess._id, this.runningMethod.executionId);
  }

  async executeMethodStep() {
    await this.runningProcessService.executeMethodStep(this.runningProcess, this.runningMethod.executionId);
    await this.loadExecutionMethod(this.runningProcess._id, this.runningMethod.executionId);
  }

  async selectOutputArtifacts(outputArtifactsMapping: FormArray) {
    let runningProcess = this.runningProcess;
    const executionId = this.runningMethod.executionId;
    const mapping = this.outputArtifactMappingFormService.get(outputArtifactsMapping.value);
    await this.runningProcessService.addOutputArtifacts(runningProcess, executionId, mapping);
    runningProcess = await this.runningProcessService.getRunningProcess(runningProcess._id);
    await this.runningProcessService.stopMethodExecution(runningProcess, executionId);
    runningProcess = await this.runningProcessService.getRunningProcess(runningProcess._id);
    await this.runningProcessService.jumpSteps(runningProcess);
    this.router.navigate(['runningprocess', 'runningprocessview', runningProcess._id]).then();
  }

  async abortMethodExecution() {
    await this.runningProcessService.abortMethodExecution(this.runningProcess, this.runningMethod.executionId);
    this.router.navigate(['runningprocess', 'runningprocessview', this.runningProcess._id]).then();
  }

  async addComment(comment: Comment) {
    await this.runningProcessService.addComment(this.runningProcess._id, this.runningMethod.executionId, comment);
    await this.loadExecutionMethod(this.runningProcess._id, this.runningMethod.executionId);
  }

  async updateComment(comment: Comment) {
    await this.runningProcessService.updateComment(this.runningProcess._id, this.runningMethod.executionId, comment);
    await this.loadExecutionMethod(this.runningProcess._id, this.runningMethod.executionId);
  }

  async removeComment(commentId: string) {
    await this.runningProcessService.removeComment(this.runningProcess._id, this.runningMethod.executionId, commentId);
    await this.loadExecutionMethod(this.runningProcess._id, this.runningMethod.executionId);
  }

  viewArtifactReference(reference: ArtifactDataReference, api: MetaModelApi) {
    api.view(reference, this.router, this.runningProcess._id, this.runningMethod.executionId);
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

  getStateInputSelection() {
    return State.INPUT_SELECTION;
  }

  getStateExecution() {
    return State.EXECUTION;
  }

  getStateOutputSelection() {
    return State.OUTPUT_SELECTION;
  }

  private async loadExecutionMethod(processId: string, executionId: string) {
    this.runningProcess = await this.runningProcessService.getRunningProcess(processId);
    this.runningMethod = this.runningProcess.getRunningMethod(executionId);
  }

}
