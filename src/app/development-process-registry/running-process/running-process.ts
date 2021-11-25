import { BmProcess } from '../bm-process/bm-process';
import { DatabaseModel } from '../../database/database-model';
import { RunningArtifact } from './running-artifact';
import { RunningMethod } from './running-method';
import { Step } from './step';
import { RunningMethodInfo } from './running-method-info';
import { v4 as uuidv4 } from 'uuid';
import { Artifact } from '../method-elements/artifact/artifact';
import { ArtifactVersion } from './artifact-version';
import { OutputArtifactMapping } from './output-artifact-mapping';

export class RunningProcess extends DatabaseModel {
  static readonly typeName = 'RunningProcess';

  name: string;
  process: BmProcess;

  todoMethods: RunningMethod[] = [];
  runningMethods: RunningMethod[] = [];
  executedMethods: RunningMethodInfo[] = [];

  artifacts: RunningArtifact[] = [];

  constructor(runningProcess: Partial<RunningProcess>) {
    super(RunningProcess.typeName);
    Object.assign(this, runningProcess);
    this.process = new BmProcess(this.process);
    this.todoMethods = this.todoMethods.map(
      (method) => new RunningMethod(method)
    );
    this.runningMethods = this.runningMethods.map(
      (method) => new RunningMethod(method)
    );
    this.artifacts = this.artifacts.map(
      (element) => new RunningArtifact(element)
    );
  }

  /**
   * Add a method to the list of manually added methods that can be executed later
   *
   * @param runningMethod the running method
   */
  addTodoMethod(runningMethod: RunningMethod): void {
    if (runningMethod.executionId == null) {
      runningMethod.executionId = uuidv4();
    }
    this.todoMethods.push(runningMethod);
  }

  /**
   * Get a specific todomethod by its id
   *
   * @param executionId the id of the todomethod
   * @return the todomethod
   */
  getTodoMethod(executionId: string): RunningMethod {
    return this.todoMethods.find(
      (method) => method.executionId === executionId
    );
  }

  /**
   * Remove a method from the list of manually added methods that can be executed later
   *
   * @param executionId the id of the method
   */
  removeTodoMethod(executionId: string) {
    this.todoMethods = this.todoMethods.filter(
      (method) => method.executionId !== executionId
    );
  }

  /**
   * Add a running method to the currently executed methods list
   *
   * @param runningMethod the running method
   */
  addRunningMethod(runningMethod: RunningMethod): void {
    if (runningMethod.executionId == null) {
      runningMethod.executionId = uuidv4();
    }
    this.runningMethods.push(runningMethod);
  }

  /**
   * Add a running method of the bm process to the currently executed methods list
   *
   * @param nodeId the id of the node
   * @return the added running method
   */
  addRunningMethodOfProcess(nodeId: string): RunningMethod {
    const method = new RunningMethod({
      nodeId,
      decision: this.process.decisions[nodeId],
      steps: this.process.decisions[nodeId].method.executionSteps.map(
        () => new Step({})
      ),
    });
    this.addRunningMethod(method);
    return method;
  }

  /**
   * Get a specific running method by its id
   *
   * @param executionId the id of the running method
   * @return the running method
   */
  getRunningMethod(executionId: string): RunningMethod {
    return this.runningMethods.find(
      (method) => method.executionId === executionId
    );
  }

  /**
   * Get a specific running method by the id of the corresponding node
   *
   * @param nodeId the id of the node
   * @return the running method
   */
  getRunningMethodByNode(nodeId: string): RunningMethod {
    return this.runningMethods.find((method) => method.nodeId === nodeId);
  }

  /**
   * Remove a method from the currently executed methods list
   *
   * @param executionId the id of the method
   */
  removeRunningMethod(executionId: string): void {
    this.runningMethods = this.runningMethods.filter(
      (method) => method.executionId !== executionId
    );
  }

  /**
   * Add a method to the executed methods list
   *
   * @param runningMethodInfo the info of the executed method
   */
  addExecutedMethod(runningMethodInfo: RunningMethodInfo): void {
    this.executedMethods.push(runningMethodInfo);
  }

  /**
   * Get an executed method
   *
   * @param executionId the id of the executed method
   * @return the executed method
   */
  getExecutedMethod(executionId: string): RunningMethodInfo {
    return this.executedMethods.find(
      (method) => method.executionId === executionId
    );
  }

  /**
   * Checks whether a method to execute is defined for the node
   *
   * @param nodeId the id of the node
   * @return true if a method is defined
   */
  isExecutable(nodeId: string): boolean {
    return nodeId in this.process.decisions;
  }

  /**
   * Get a method by its execution id
   *
   * @param executionId the id of the method
   * @return the method
   */
  getMethod(executionId: string): RunningMethodInfo {
    let result: RunningMethodInfo = this.todoMethods.find(
      (method) => method.executionId === executionId
    );
    if (result == null) {
      result = this.runningMethods.find(
        (method) => method.executionId === executionId
      );
      if (result == null) {
        result = this.executedMethods.find(
          (method) => method.executionId === executionId
        );
      }
    }
    return result;
  }

  /**
   * Add the output artifacts of a method to the artifacts list of this process
   *
   * @param executionId the id of the executed method
   * @param outputArtifacts the output artifacts
   * @param outputArtifactsMapping the mapping of the output artifacts, whether to create a new artifact or merge with a current
   */
  addOutputArtifacts(
    executionId: string,
    outputArtifacts: Artifact[],
    outputArtifactsMapping: OutputArtifactMapping[]
  ): void {
    const method = this.getRunningMethod(executionId);
    outputArtifactsMapping.forEach((output, index) => {
      const version: Partial<ArtifactVersion> = {
        createdBy: method.nodeId ? method.nodeId : 'manual',
        executedBy: method.executionId,
        data: output.data,
      };
      if (output.isDefinition) {
        const artifact = new RunningArtifact({
          identifier: output.artifactName,
          artifact: outputArtifacts[index],
        });
        artifact.addVersion(version);
        this.artifacts.push(artifact);
      } else {
        this.artifacts[output.artifact].addVersion(version);
      }
    });
  }

  /**
   * Import an artifact into this process
   *
   * @param artifact the artifact to import
   */
  importArtifact(artifact: RunningArtifact): void {
    this.artifacts.push(artifact);
  }

  /**
   * Change a running artifact's identifier
   *
   * @param artifact the running artifact to change
   * @param identifier the new identifier
   */
  renameArtifact(artifact: RunningArtifact, identifier: string): void {
    if (this.artifacts.indexOf(artifact) === -1) {
      throw new Error('Artifact is not from this running process');
    }
    artifact.identifier = identifier;
  }

  toDb(): any {
    return {
      ...super.toDb(),
      name: this.name,
      process: this.process.toDb(),
      todoMethods: this.todoMethods.map((method) => method.toDb()),
      runningMethods: this.runningMethods.map((method) => method.toDb()),
      executedMethods: this.executedMethods,
      artifacts: this.artifacts.map((element) => element.toDb()),
    };
  }
}
