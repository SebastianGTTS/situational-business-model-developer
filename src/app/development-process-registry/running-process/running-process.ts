import {
  BmProcess,
  BmProcessEntry,
  BmProcessInit,
} from '../bm-process/bm-process';
import { DatabaseModel } from '../../database/database-model';
import {
  RunningArtifact,
  RunningArtifactEntry,
  RunningArtifactInit,
} from './running-artifact';
import {
  RunningMethod,
  RunningMethodEntry,
  RunningMethodInit,
} from './running-method';
import { Step } from './step';
import {
  RunningMethodInfo,
  RunningMethodInfoEntry,
  RunningMethodInfoInit,
} from './running-method-info';
import { v4 as uuidv4 } from 'uuid';
import { Artifact } from '../method-elements/artifact/artifact';
import { ArtifactVersionInit } from './artifact-version';
import { OutputArtifactMapping } from './output-artifact-mapping';
import {
  DatabaseRootEntry,
  DatabaseRootInit,
} from '../../database/database-entry';
import { Comment } from './comment';

export interface RunningProcessInit extends DatabaseRootInit {
  name: string;
  process: BmProcessInit;

  todoMethods?: RunningMethodInit[];
  runningMethods?: RunningMethodInit[];
  executedMethods?: RunningMethodInfoInit[];

  artifacts?: RunningArtifactInit[];
}

export interface RunningProcessEntry extends DatabaseRootEntry {
  name: string;
  process: BmProcessEntry;

  todoMethods: RunningMethodEntry[];
  runningMethods: RunningMethodEntry[];
  executedMethods: RunningMethodInfoEntry[];

  artifacts: RunningArtifactEntry[];
}

export class RunningProcess
  extends DatabaseModel
  implements RunningProcessInit
{
  static readonly typeName = 'RunningProcess';

  name: string;
  process: BmProcess;

  todoMethods: RunningMethod[] = [];
  runningMethods: RunningMethod[] = [];
  executedMethods: RunningMethodInfo[] = [];

  artifacts: RunningArtifact[] = [];

  constructor(entry: RunningProcessEntry, init: RunningProcessInit) {
    super(entry, init, RunningProcess.typeName);
    this.name = (entry ?? init).name;
    if (entry != null) {
      this.process = new BmProcess(entry.process, undefined);
      this.todoMethods =
        entry.todoMethods?.map(
          (method) => new RunningMethod(method, undefined)
        ) ?? this.todoMethods;
      this.runningMethods =
        entry.runningMethods?.map(
          (method) => new RunningMethod(method, undefined)
        ) ?? this.runningMethods;
      this.executedMethods =
        entry.executedMethods.map((info) => {
          return {
            nodeId: info.nodeId,
            executionId: info.executionId,
            methodName: info.methodName,
            comments:
              info.comments?.map(
                (comment) => new Comment(comment, undefined)
              ) ?? [],
          };
        }) ?? this.executedMethods;
      this.artifacts =
        entry.artifacts?.map(
          (element) => new RunningArtifact(element, undefined)
        ) ?? this.artifacts;
    } else {
      this.process = new BmProcess(undefined, init.process);
      this.todoMethods =
        init.todoMethods?.map(
          (method) => new RunningMethod(undefined, method)
        ) ?? this.todoMethods;
      this.runningMethods =
        init.runningMethods?.map(
          (method) => new RunningMethod(undefined, method)
        ) ?? this.runningMethods;
      this.executedMethods =
        init.executedMethods?.map((info) => {
          return {
            nodeId: info.nodeId,
            executionId: info.executionId,
            methodName: info.methodName,
            comments:
              info.comments?.map(
                (comment) => new Comment(undefined, comment)
              ) ?? [],
          };
        }) ?? this.executedMethods;
      this.artifacts =
        init.artifacts?.map(
          (element) => new RunningArtifact(undefined, element)
        ) ?? this.artifacts;
    }
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
  getTodoMethod(executionId: string): RunningMethod | undefined {
    return this.todoMethods.find(
      (method) => method.executionId === executionId
    );
  }

  /**
   * Remove a method from the list of manually added methods that can be executed later
   *
   * @param executionId the id of the method
   */
  removeTodoMethod(executionId: string): void {
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
    this.runningMethods.push(runningMethod);
  }

  /**
   * Add a running method of the bm process to the currently executed methods list
   *
   * @param nodeId the id of the node
   * @return the added running method
   */
  addRunningMethodOfProcess(nodeId: string): RunningMethod {
    const method = new RunningMethod(undefined, {
      nodeId,
      decision: this.process.decisions[nodeId],
      steps: this.process.decisions[nodeId].method.executionSteps.map(
        () => new Step(undefined, {})
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
  getRunningMethod(executionId: string): RunningMethod | undefined {
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
  getRunningMethodByNode(nodeId: string): RunningMethod | undefined {
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
  getExecutedMethod(executionId: string): RunningMethodInfo | undefined {
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
  getMethod(executionId: string): RunningMethodInfo | undefined {
    let result: RunningMethodInfo | undefined = this.todoMethods.find(
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
      const version: ArtifactVersionInit = {
        createdBy: method.nodeId ? method.nodeId : 'manual',
        executedBy: method.executionId,
        data: output.data,
      };
      if (output.isDefinition) {
        const artifact = new RunningArtifact(undefined, {
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

  toDb(): RunningProcessEntry {
    return {
      ...super.toDb(),
      name: this.name,
      process: this.process.toDb(),
      todoMethods: this.todoMethods.map((method) => method.toDb()),
      runningMethods: this.runningMethods.map((method) => method.toDb()),
      executedMethods: this.executedMethods.map((executedMethod) => {
        return {
          nodeId: executedMethod.nodeId,
          executionId: executedMethod.executionId,
          methodName: executedMethod.methodName,
          comments: executedMethod.comments.map((comment) => comment.toDb()),
        };
      }),
      artifacts: this.artifacts.map((element) => element.toDb()),
    };
  }
}
