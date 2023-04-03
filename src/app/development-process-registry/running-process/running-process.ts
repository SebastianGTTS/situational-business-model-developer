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
import {
  RunningMethodInfo,
  RunningMethodInfoEntry,
  RunningMethodInfoInit,
} from './running-method-info';
import { v4 as uuidv4 } from 'uuid';
import { Artifact } from '../method-elements/artifact/artifact';
import {
  ArtifactVersion,
  ArtifactVersionId,
  ArtifactVersionInit,
} from './artifact-version';
import { OutputArtifactMapping } from './output-artifact-mapping';
import {
  DatabaseRootEntry,
  DatabaseRootInit,
  DbId,
} from '../../database/database-entry';
import { Comment } from './comment';
import { SituationalFactor } from '../method-elements/situational-factor/situational-factor';
import { Selection } from '../development-method/selection';
import { Domain } from '../knowledge/domain';
import { Icon, IconEntry, IconInit } from '../../model/icon';

export interface RunningProcessInit extends DatabaseRootInit {
  name: string;
  description?: string;
  icon?: IconInit;

  completed?: boolean;
  conclusion?: string;

  todoMethods?: RunningMethodInit[];
  runningMethods?: RunningMethodInit[];
  executedMethods?: RunningMethodInfoInit[];

  artifacts?: RunningArtifactInit[];
}

export interface RunningProcessEntry extends DatabaseRootEntry {
  name: string;
  description: string;
  icon: IconEntry;

  completed: boolean;
  conclusion?: string;

  todoMethods: RunningMethodEntry[];
  runningMethods: RunningMethodEntry[];
  executedMethods: RunningMethodInfoEntry[];

  artifacts: RunningArtifactEntry[];
}

export abstract class RunningProcess
  extends DatabaseModel
  implements RunningProcessInit
{
  static readonly typeName = 'RunningProcess';
  static readonly defaultIcon: IconInit = { icon: 'bi-building-gear' };

  name: string;
  description = '';
  icon: Icon;

  completed = false;
  conclusion?: string;

  todoMethods: RunningMethod[] = [];
  runningMethods: RunningMethod[] = [];
  executedMethods: RunningMethodInfo[] = [];

  artifacts: RunningArtifact[] = [];

  abstract get domains(): Domain[];

  abstract get situationalFactors(): Selection<SituationalFactor>[];

  protected constructor(
    entry: RunningProcessEntry | undefined,
    init: RunningProcessInit | undefined
  ) {
    super(entry, init, RunningProcess.typeName);
    if (entry != null) {
      this.name = entry.name;
      this.description = entry.description ?? this.description;
      this.icon = new Icon(entry.icon ?? {}, undefined);
      this.completed = entry.completed ?? this.completed;
      this.conclusion = entry.conclusion;
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
    } else if (init != null) {
      this.name = init.name;
      this.description = init.description ?? this.description;
      this.icon = new Icon(undefined, init.icon ?? RunningProcess.defaultIcon);
      this.completed = init.completed ?? this.completed;
      this.conclusion = init.conclusion;
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
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  /**
   * Update the name and description of this running process
   *
   * @param name
   * @param description
   */
  updateInfo(name: string, description: string): void {
    this.name = name;
    this.description = description;
  }

  /**
   * Update the icon of this running process
   *
   * @param icon
   */
  updateIcon(icon: IconInit): void {
    this.icon.update(icon);
  }

  /**
   * Complete this running process
   */
  finish(conclusion: string): void {
    if (this.completed) {
      throw new Error('Running Process is already completed');
    }
    this.completed = true;
    this.conclusion = conclusion;
  }

  /**
   * Add a method to the list of manually added methods that can be executed later
   *
   * @param runningMethod the running method
   *
   * @return the added running method
   */
  addTodoMethod(runningMethod: RunningMethod): RunningMethod {
    if (runningMethod.executionId == null) {
      runningMethod.executionId = uuidv4();
    }
    this.todoMethods.push(runningMethod);
    return runningMethod;
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
   * Get a specific running method by its id
   *
   * @param executionId the id of the running method
   * @return the running method
   */
  getRunningMethod(executionId: string | undefined): RunningMethod | undefined {
    return this.runningMethods.find(
      (method) => method.executionId === executionId
    );
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
   * Get all artifact versions created by a specific method
   *
   * @param executionId
   */
  getArtifactsOfExecutedMethod(
    executionId: string
  ): { artifact: RunningArtifact; versions: ArtifactVersion[] }[] {
    const artifactVersions: {
      artifact: RunningArtifact;
      versions: ArtifactVersion[];
    }[] = [];
    for (const artifact of this.artifacts) {
      const versions: ArtifactVersion[] = artifact.versions.filter(
        (version) =>
          version.executedBy != null && version.executedBy === executionId
      );
      if (versions.length > 0) {
        artifactVersions.push({
          artifact: artifact,
          versions: versions,
        });
      }
    }
    return artifactVersions;
  }

  getArtifactVersion(
    versionId: ArtifactVersionId
  ): ArtifactVersion | undefined {
    for (const artifact of this.artifacts) {
      const version = artifact.getVersion(versionId);
      if (version != null) {
        return version;
      }
    }
    return undefined;
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
    outputArtifactsMapping: (OutputArtifactMapping | undefined)[]
  ): void {
    const method = this.getRunningMethod(executionId);
    if (method == null) {
      throw new Error(
        'Running Method with executionId ' + executionId + ' does not exist'
      );
    }
    outputArtifactsMapping.forEach((output, index) => {
      if (output == null) {
        return;
      }
      const version: ArtifactVersionInit = {
        createdBy: method.nodeId ? method.nodeId : 'manual',
        executedBy: method.executionId,
        data: output.data,
      };
      if (output.isDefinition) {
        const artifact = new RunningArtifact(undefined, {
          name: output.artifactName ?? '',
          artifact: outputArtifacts[index],
        });
        artifact.addVersion(version);
        this.artifacts.push(artifact);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.artifacts[output.artifact!].addVersion(version);
      }
    });
  }

  /**
   * Add a manually created artifact to the running process
   *
   * @param artifact
   * @param outputArtifactMapping
   * @param editing
   */
  addOutputArtifact(
    artifact: Artifact,
    outputArtifactMapping: OutputArtifactMapping,
    editing = false
  ): void {
    const version: ArtifactVersionInit = {
      createdBy: 'added',
      data: outputArtifactMapping.data,
      editing: editing,
    };
    if (outputArtifactMapping.isDefinition) {
      const runningArtifact = new RunningArtifact(undefined, {
        name: outputArtifactMapping.artifactName ?? '',
        artifact: artifact,
      });
      runningArtifact.addVersion(version);
      this.artifacts.push(runningArtifact);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.artifacts[outputArtifactMapping.artifact!].addVersion(version);
    }
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
   * @param id the id of the running artifact to change
   * @param identifier the new identifier
   */
  renameArtifact(id: DbId, identifier: string): void {
    const artifact = this.artifacts.find((a) => a._id === id);
    if (artifact == null) {
      throw new Error('Artifact does not exist');
    }
    artifact.name = identifier;
  }

  /**
   * Remove a running artifact
   *
   * @param id artifact's id
   */
  removeArtifact(id: DbId): void {
    this.artifacts = this.artifacts.filter((artifact) => artifact._id !== id);
  }

  toDb(): RunningProcessEntry {
    return {
      ...super.toDb(),
      name: this.name,
      description: this.description,
      icon: this.icon.toDb(),
      completed: this.completed,
      conclusion: this.conclusion,
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
