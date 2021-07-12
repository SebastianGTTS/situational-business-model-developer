import { Step } from './step';
import { StepArtifact } from './step-artifact';
import { RunningMethodInfo } from './running-method-info';
import { Decision } from '../bm-process/decision';
import { ExecutionStep } from '../development-method/execution-step';
import { ArtifactMapping } from '../development-method/artifact-mapping';
import { Artifact } from '../method-elements/artifact/artifact';
import { StepInputArtifact } from './step-input-artifact';
import { Comment } from './comment';

export class RunningMethod implements RunningMethodInfo {

  nodeId?: string = null;
  executionId: string;
  comments: Comment[] = [];
  decision: Decision;

  currentStepNumber = 0;
  steps: Step[] = [];

  inputArtifacts: StepInputArtifact[] = null;

  constructor(runningMethod: Partial<RunningMethod>) {
    Object.assign(this, runningMethod);

    this.comments = this.comments.map((comment) => new Comment(comment));
    this.decision = new Decision(this.decision);
    this.inputArtifacts = this.inputArtifacts ? this.inputArtifacts.map((artifact) => new StepInputArtifact(artifact)) : null;
    this.steps = this.steps.map((step) => new Step(step));
  }

  /**
   * Finish the step execution by setting the setp artifacts as output
   *
   * @param output the output of the module method
   */
  finishStepExecution(output: StepArtifact[]): void {
    this.steps[this.currentStepNumber].finish(output);
    this.currentStepNumber += 1;
  }

  /**
   * Checks whether there are steps left to be executed
   *
   * @return true if the method has steps to execute left, false otherwise
   */
  hasStepsLeft(): boolean {
    return this.currentStepNumber < this.steps.length;
  }

  /**
   * Checks whether this method has steps that can be executed
   *
   * @return true if the method has steps, false otherwise
   */
  hasSteps(): boolean {
    return this.steps.length > 0;
  }

  /**
   * Checks whether the next execution step is prepared
   *
   * @return true if the next execution step is prepared
   */
  isPrepared(): boolean {
    return this.steps[this.currentStepNumber].inputArtifacts != null;
  }

  /**
   * Set the internal step artifacts for the next execution step and prepare the next step by doing this
   *
   * @param stepArtifacts the step artifacts
   */
  setInternalStepArtifacts(stepArtifacts: StepArtifact[]): void {
    this.steps[this.currentStepNumber].inputArtifacts = stepArtifacts;
  }

  /**
   * Get the internal step artifacts for the next execution step
   *
   * @return the step artifacts
   */
  getInternalStepArtifacts(): StepArtifact[] {
    return this.steps[this.currentStepNumber].inputArtifacts;
  }

  /**
   * Get the output artifacts of the process definition
   *
   * @return the output artifacts of the process
   */
  getProcessOutputArtifacts(): Artifact[] {
    const currentDecision = this.decision;
    const artifacts: Artifact[] = [];
    currentDecision.outputArtifacts.getList(currentDecision.method.outputArtifacts).elements.forEach(
      (element) => artifacts.push(...element.elements)
    );
    return artifacts;
  }

  /**
   * Get all input artifacts of all steps
   *
   * @return a list of all step artifacts
   */
  getAllStepArtifacts(): StepArtifact[] {
    const artifacts: StepArtifact[] = [];
    this.steps.forEach((step) => {
      if (step.inputArtifacts != null) {
        artifacts.push(...step.inputArtifacts);
      }
      if (step.outputArtifacts != null) {
        artifacts.push(...step.outputArtifacts);
      }
    });
    return artifacts;
  }

  /**
   * Get all input artifacts for a specific step by iterating over all artifacts and selecting them based on their mapping
   *
   * @param step the step for which to get the artifacts
   * @param size the number of artifacts for that step
   * @return the list of artifacts
   */
  getStepArtifacts(step: number, size: number): StepArtifact[] {
    return this.iterateMappings(size, (mapping => mapping.output === false && mapping.step === step));
  }

  /**
   * Get all output artifacts for this method by iterating over all artifacts and selecting them based on their mapping
   *
   * @return the list of artifacts
   */
  getOutputArtifacts(): StepArtifact[] {
    const group = this.decision.outputArtifacts.selectedGroup;
    if (group == null) {
      return [];
    }
    return this.iterateMappings(
      this.decision.method.outputArtifacts[group].length,
      (mapping) => mapping.output === true && mapping.group === group,
    );
  }

  /**
   * Iterate over all artifacts and select them based on their mapping
   *
   * @param artifactLength the length of the resulting artifacts list
   * @param filter the function to select the artifacts based on their mapping
   * @return the artifacts list
   */
  private iterateMappings(artifactLength: number, filter: (mapping: ArtifactMapping) => boolean): StepArtifact[] {
    const artifacts = [];
    artifacts.length = artifactLength;
    this.iterateInputMappings(artifacts, filter);
    this.iterateExecutionStepMappings(artifacts, filter);
    return artifacts;
  }

  /**
   * Iterate over the input artifacts and add them to the artifacts list
   *
   * @param artifacts the artifacts list, will be changed
   * @param filter the filter function to select input artifacts based on their mapping
   */
  private iterateInputMappings(artifacts: StepArtifact[], filter: (mapping: ArtifactMapping) => boolean): void {
    const method = this.decision.method;
    const inputGroup = this.decision.inputArtifacts.selectedGroup;
    if (inputGroup != null) {
      const artifactInputGroup = method.inputArtifacts[inputGroup];
      for (let i = 0; i < artifactInputGroup.length; i++) {
        const artifact = artifactInputGroup[i];
        for (const mapping of artifact.mapping) {
          if (filter(mapping)) {
            artifacts[mapping.artifact] = this.inputArtifacts[i];
          }
        }
      }
    }
  }

  /**
   * Iterate over the execution step artifacts and add them to the artifacts list
   *
   * @param artifacts the artifacts list, will be changed
   * @param filter the filter function to select step artifacts based on their mapping
   */
  private iterateExecutionStepMappings(artifacts: StepArtifact[], filter: (mapping: ArtifactMapping) => boolean): void {
    const method = this.decision.method;
    for (let i = 0; i < method.executionSteps.length; i++) {
      const executionStep = method.executionSteps[i];
      for (let j = 0; j < executionStep.outputMappings.length; j++) {
        const outputArtifact = executionStep.outputMappings[j];
        for (const mapping of outputArtifact) {
          if (filter(mapping)) {
            artifacts[mapping.artifact] = this.steps[i].outputArtifacts[j];
          }
        }
      }
    }
  }

  /**
   * Add a comment to this running method
   *
   * @param comment the comment to add
   */
  addComment(comment: Comment): void {
    this.comments.push(comment);
  }

  /**
   * Get a comment of this running method
   *
   * @param commentId the id of the comment
   */
  getComment(commentId: string) {
    return this.comments.find((comment) => comment.id === commentId);
  }

  /**
   * Remove a comment from this running method
   *
   * @param commentId the id of the comment to remove
   */
  removeComment(commentId: string): void {
    this.comments = this.comments.filter((comment) => comment.id !== commentId);
  }

  /**
   * Get the name of the method
   *
   * @return the name of the method
   */
  get methodName(): string {
    return this.decision.method.name;
  }

  /**
   * Get the current step of the method definition
   *
   * @return the execution step
   */
  get currentStep(): ExecutionStep {
    return this.decision.method.executionSteps[this.currentStepNumber];
  }

  toPouchDb(): any {
    return {
      nodeId: this.nodeId,
      executionId: this.executionId,
      comments: this.comments.map((comment) => comment.toPouchDb()),
      decision: this.decision.toPouchDb(),
      currentStepNumber: this.currentStepNumber,
      inputArtifacts: this.inputArtifacts ? this.inputArtifacts.map((artifact) => artifact.toPouchDb()) : null,
      steps: this.steps.map((step) => step.toPouchDb()),
    };
  }

}
