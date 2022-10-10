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
import {
  Selection,
  SelectionEntry,
  SelectionInit,
} from '../development-method/selection';
import {
  SituationalFactor,
  SituationalFactorEntry,
  SituationalFactorInit,
} from '../method-elements/situational-factor/situational-factor';
import { Domain, DomainEntry, DomainInit } from '../knowledge/domain';
import {
  ContextChangeInfo,
  ContextChangeInfoEntry,
  ContextChangeInfoInit,
} from './context-change-info';

export type FullRunningProcess = RunningProcess & { process: BmProcess };
export type ContextChangeRunningProcess = RunningProcess & {
  process: BmProcess;
  contextChange: true;
  contextChangeInfo: ContextChangeInfo;
};

export interface RunningProcessInit extends DatabaseRootInit {
  name: string;
  process?: BmProcessInit;

  readonly domains?: DomainInit[];
  readonly situationalFactors?: SelectionInit<SituationalFactorInit>[];

  contextChange?: boolean;
  contextChangeInfo?: ContextChangeInfoInit;
  previousContextChanges?: ContextChangeInfoInit[];

  todoMethods?: RunningMethodInit[];
  runningMethods?: RunningMethodInit[];
  executedMethods?: RunningMethodInfoInit[];

  artifacts?: RunningArtifactInit[];
}

export interface RunningProcessEntry extends DatabaseRootEntry {
  name: string;
  process?: BmProcessEntry;

  domains: DomainEntry[];
  situationalFactors: SelectionEntry<SituationalFactorEntry>[];

  contextChange: boolean;
  contextChangeInfo?: ContextChangeInfoEntry;
  previousContextChanges: ContextChangeInfoEntry[];

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
  process?: BmProcess;

  /**
   * For full process: empty
   * For light process: real domains
   */
  _domains: Domain[] = [];
  /**
   * For full process: empty
   * For light process: real situational factors
   */
  _situationalFactors: Selection<SituationalFactor>[] = [];

  /**
   * True if the context should be changed or currently ongoing
   */
  contextChange = false;
  /**
   * Info about the currently ongoing context change
   */
  contextChangeInfo?: ContextChangeInfo;
  /**
   * Info about previous context changes.
   * For light process: empty.
   */
  previousContextChanges: ContextChangeInfo[] = [];

  todoMethods: RunningMethod[] = [];
  runningMethods: RunningMethod[] = [];
  executedMethods: RunningMethodInfo[] = [];

  artifacts: RunningArtifact[] = [];

  constructor(
    entry: RunningProcessEntry | undefined,
    init: RunningProcessInit | undefined
  ) {
    super(entry, init, RunningProcess.typeName);
    if (entry != null) {
      this.name = entry.name;
      this.process = entry.process
        ? new BmProcess(entry.process, undefined)
        : undefined;
      this._domains =
        entry.domains?.map((domain) => new Domain(domain, undefined)) ??
        this._domains;
      this._situationalFactors =
        entry.situationalFactors?.map(
          (factor) =>
            new Selection<SituationalFactor>(
              factor,
              undefined,
              SituationalFactor
            )
        ) ?? this._situationalFactors;
      this.contextChange = entry.contextChange ?? this.contextChange;
      this.contextChangeInfo = entry.contextChangeInfo
        ? new ContextChangeInfo(entry.contextChangeInfo, undefined)
        : undefined;
      this.previousContextChanges =
        entry.previousContextChanges?.map(
          (contextChange) => new ContextChangeInfo(contextChange, undefined)
        ) ?? this.previousContextChanges;
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
      this.process = init.process
        ? new BmProcess(undefined, init.process)
        : undefined;
      this._domains =
        init.domains?.map((domain) => new Domain(undefined, domain)) ??
        this._domains;
      this._situationalFactors =
        init.situationalFactors?.map(
          (factor) =>
            new Selection<SituationalFactor>(
              undefined,
              factor,
              SituationalFactor
            )
        ) ?? this._situationalFactors;
      this.contextChange = init.contextChange ?? this.contextChange;
      this.contextChangeInfo = init.contextChangeInfo
        ? new ContextChangeInfo(undefined, init.contextChangeInfo)
        : undefined;
      this.previousContextChanges =
        init.previousContextChanges?.map(
          (contextChange) => new ContextChangeInfo(undefined, contextChange)
        ) ?? this.previousContextChanges;
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
   * Add a running method of the bm process to the currently executed methods list
   *
   * @param nodeId the id of the node
   * @return the added running method
   */
  addRunningMethodOfProcess(nodeId: string): RunningMethod {
    if (this.process == null) {
      throw new Error('Can not add method of process to lightweight execution');
    }
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
  getRunningMethod(executionId: string | undefined): RunningMethod | undefined {
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
   * Remove an executed method. Also maps affected artifacts to added manually.
   *
   * @param executionId
   */
  removeExecutedMethod(executionId: string): void {
    if (!this.isContextChange()) {
      throw new Error('Running Process must be in context change mode.');
    }
    this.executedMethods = this.executedMethods.filter(
      (executedMethod) => executedMethod.executionId !== executionId
    );
    this.contextChangeInfo.removeExecutedMethod(executionId);
    this.getArtifactsOfExecutedMethod(executionId).forEach((artifact) =>
      artifact.versions.forEach((version) => {
        version.createdBy = 'added';
        version.executedBy = undefined;
      })
    );
  }

  /**
   * Get all executions by the node id
   *
   * @param nodeId
   */
  getExecutionsByNodeId(nodeId: string): RunningMethodInfo[] {
    return this.executedMethods.filter((info) => info.nodeId === nodeId);
  }

  /**
   * Checks whether a method to execute is defined for the node
   *
   * @param nodeId the id of the node
   * @return true if a method is defined
   */
  isExecutable(nodeId: string): boolean {
    if (this.process == null) {
      return false;
    }
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
   * Get all artifact versions created by a specific node
   *
   * @param nodeId
   */
  getArtifactsCreatedByNode(
    nodeId: string
  ): { artifact: RunningArtifact; versions: ArtifactVersion[] }[] {
    const artifactVersions: {
      artifact: RunningArtifact;
      versions: ArtifactVersion[];
    }[] = [];
    for (const artifact of this.artifacts) {
      const versions: ArtifactVersion[] = artifact.versions.filter(
        (version) => version.createdBy === nodeId
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
          identifier: output.artifactName ?? '',
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
        identifier: outputArtifactMapping.artifactName ?? '',
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
   * @param artifact the running artifact to change
   * @param identifier the new identifier
   */
  renameArtifact(artifact: RunningArtifact, identifier: string): void {
    if (this.artifacts.indexOf(artifact) === -1) {
      throw new Error('Artifact is not from this running process');
    }
    artifact.identifier = identifier;
  }

  /**
   * Remove a running artifact
   *
   * @param id artifact's id
   */
  removeArtifact(id: DbId): void {
    this.artifacts = this.artifacts.filter((artifact) => artifact._id !== id);
  }

  /**
   * Whether this process has a bm process defined or is a lightweight running process
   */
  hasProcess(): this is FullRunningProcess {
    return this.process != null;
  }

  /**
   * Whether this process is currently in a context change situation
   */
  isContextChange(): this is ContextChangeRunningProcess {
    return this.contextChange;
  }

  get situationalFactors(): Selection<SituationalFactor>[] {
    if (this.hasProcess()) {
      return this.process.situationalFactors;
    } else {
      return this._situationalFactors;
    }
  }

  get domains(): Domain[] {
    if (this.hasProcess()) {
      return this.process.domains;
    } else {
      return this._domains;
    }
  }

  toDb(): RunningProcessEntry {
    return {
      ...super.toDb(),
      name: this.name,
      process: this.process?.toDb(),
      domains: this._domains.map((domain) => domain.toDb()),
      situationalFactors: this._situationalFactors.map((factor) =>
        factor.toDb()
      ),
      contextChange: this.contextChange,
      contextChangeInfo: this.contextChangeInfo?.toDb(),
      previousContextChanges: this.previousContextChanges.map((contextChange) =>
        contextChange.toDb()
      ),
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
