import { Step, StepEntry, StepInit } from './step';
import { StepArtifact } from './step-artifact';
import { RunningMethodInfo } from './running-method-info';
import { Decision, DecisionEntry, DecisionInit } from '../bm-process/decision';
import { ExecutionStep } from '../development-method/execution-step';
import { ArtifactMapping } from '../development-method/artifact-mapping';
import { Artifact } from '../method-elements/artifact/artifact';
import {
  StepInputArtifact,
  StepInputArtifactEntry,
  StepInputArtifactInit,
} from './step-input-artifact';
import { Comment, CommentEntry, CommentInit } from './comment';
import { DatabaseModelPart } from '../../database/database-model-part';
import {
  OutputArtifactMapping,
  OutputArtifactMappingEntry,
  OutputArtifactMappingInit,
} from './output-artifact-mapping';
import { DatabaseEntry, DatabaseInit } from '../../database/database-entry';
import { v4 as uuidv4 } from 'uuid';

export interface RunningMethodInit extends DatabaseInit {
  nodeId?: string;
  executionId?: string;
  comments?: CommentInit[];
  decision: DecisionInit;

  currentStepNumber?: number;
  steps?: StepInit[];
  inputArtifacts?: StepInputArtifactInit[];
  outputArtifacts?: OutputArtifactMappingInit[];
}

export interface RunningMethodEntry extends DatabaseEntry {
  nodeId?: string;
  executionId: string;
  comments: CommentEntry[];
  decision: DecisionEntry;

  currentStepNumber: number;
  steps: StepEntry[];
  inputArtifacts: StepInputArtifactEntry[];
  outputArtifacts?: OutputArtifactMappingEntry[];
}

export class RunningMethod
  implements RunningMethodInit, RunningMethodInfo, DatabaseModelPart
{
  nodeId?: string = null;
  executionId: string;
  comments: Comment[] = [];
  decision: Decision;

  currentStepNumber = 0;
  steps: Step[] = [];

  inputArtifacts: StepInputArtifact[] = null;
  outputArtifacts?: OutputArtifactMapping[];

  constructor(
    entry: RunningMethodEntry | undefined,
    init: RunningMethodInit | undefined
  ) {
    const element = entry ?? init;
    this.nodeId = element.nodeId;
    this.executionId = element.executionId ?? uuidv4();
    this.currentStepNumber =
      element.currentStepNumber ?? this.currentStepNumber;
    if (entry != null) {
      this.comments =
        entry.comments?.map((comment) => new Comment(comment, undefined)) ??
        this.comments;
      this.decision = new Decision(entry.decision, undefined);
      this.steps =
        entry.steps?.map((step) => new Step(step, undefined)) ?? this.steps;
      this.inputArtifacts =
        entry.inputArtifacts?.map(
          (artifact) => new StepInputArtifact(artifact, undefined)
        ) ?? this.inputArtifacts;
      this.outputArtifacts =
        entry.outputArtifacts?.map(
          (artifact) => new OutputArtifactMapping(artifact, undefined)
        ) ?? this.outputArtifacts;
    } else if (init != null) {
      this.comments =
        init.comments?.map((comment) => new Comment(undefined, comment)) ??
        this.comments;
      this.decision = new Decision(undefined, init.decision);
      this.steps =
        init.steps?.map((step) => new Step(undefined, step)) ?? this.steps;
      this.inputArtifacts =
        init.inputArtifacts?.map(
          (artifact) => new StepInputArtifact(undefined, artifact)
        ) ?? this.inputArtifacts;
      this.outputArtifacts =
        init.outputArtifacts?.map(
          (artifact) => new OutputArtifactMapping(undefined, artifact)
        ) ?? this.outputArtifacts;
    } else {
      throw new Error('Either entry or init must be provided.');
    }
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
    currentDecision.outputArtifacts
      .getList(currentDecision.method.outputArtifacts)
      .elements.forEach((element) => artifacts.push(...element.elements));
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
    return this.iterateMappings(
      size,
      (mapping) => mapping.output === false && mapping.step === step
    );
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
      (mapping) => mapping.output === true && mapping.group === group
    );
  }

  /**
   * Iterate over all artifacts and select them based on their mapping
   *
   * @param artifactLength the length of the resulting artifacts list
   * @param filter the function to select the artifacts based on their mapping
   * @return the artifacts list
   */
  private iterateMappings(
    artifactLength: number,
    filter: (mapping: ArtifactMapping) => boolean
  ): StepArtifact[] {
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
  private iterateInputMappings(
    artifacts: StepArtifact[],
    filter: (mapping: ArtifactMapping) => boolean
  ): void {
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
  private iterateExecutionStepMappings(
    artifacts: StepArtifact[],
    filter: (mapping: ArtifactMapping) => boolean
  ): void {
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
   * Update the output artifacts together with their data and mapping.
   */
  updateOutputArtifacts(outputArtifacts: OutputArtifactMapping[]): void {
    this.outputArtifacts = outputArtifacts;
  }

  /**
   * Checks whether the output artifacts are defined or whether there are no output artifacts.
   *
   * @return true if the output artifacts are defined or if there are no output artifacts
   */
  hasOutputArtifactsCorrectlyDefined(): boolean {
    const outputArtifacts = this.decision.outputArtifacts.getList(
      this.decision.method.outputArtifacts
    ).elements;
    if (outputArtifacts.length === 0) {
      return true;
    }
    if (this.outputArtifacts != null) {
      return (
        this.outputArtifacts.length ===
        outputArtifacts.reduce((acc, summay) => acc + summay.elements.length, 0)
      );
    }
    return false;
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
  getComment(commentId: string): Comment {
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

  toDb(): RunningMethodEntry {
    return {
      nodeId: this.nodeId,
      executionId: this.executionId,
      comments: this.comments.map((comment) => comment.toDb()),
      decision: this.decision.toDb(),
      currentStepNumber: this.currentStepNumber,
      inputArtifacts: this.inputArtifacts
        ? this.inputArtifacts.map((artifact) => artifact.toDb())
        : null,
      outputArtifacts: this.outputArtifacts
        ? this.outputArtifacts.map((outputArtifact) => outputArtifact.toDb())
        : undefined,
      steps: this.steps.map((step) => step.toDb()),
    };
  }
}
