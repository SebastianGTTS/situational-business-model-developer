import {
  ContextChangeInfo,
  ContextChangeInfoEntry,
  ContextChangeInfoInit,
} from './context-change-info';
import {
  BmProcess,
  BmProcessEntry,
  BmProcessInit,
} from '../bm-process/bm-process';
import {
  RunningProcess,
  RunningProcessEntry,
  RunningProcessInit,
} from './running-process';
import { RunningMethod } from './running-method';
import { RunningMethodInfo } from './running-method-info';
import { RunningArtifact } from './running-artifact';
import { ArtifactVersion } from './artifact-version';
import { Domain } from '../knowledge/domain';
import { SituationalFactor } from '../method-elements/situational-factor/situational-factor';
import { Selection } from '../development-method/selection';
import { Icon } from '../../model/icon';

export type ContextChangeRunningProcess = RunningFullProcess & {
  process: BmProcess;
  contextChange: true;
  contextChangeInfo: ContextChangeInfo;
};

export interface RunningFullProcessInit extends RunningProcessInit {
  process: BmProcessInit;

  contextChange?: boolean;
  contextChangeInfo?: ContextChangeInfoInit;
  previousContextChanges?: ContextChangeInfoInit[];
}

export interface RunningFullProcessEntry extends RunningProcessEntry {
  process: BmProcessEntry;

  contextChange: boolean;
  contextChangeInfo?: ContextChangeInfoEntry;
  previousContextChanges: ContextChangeInfoEntry[];
}

export abstract class RunningFullProcess extends RunningProcess {
  abstract process: BmProcess;
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

  get domains(): Domain[] {
    return this.process.domains;
  }

  get situationalFactors(): Selection<SituationalFactor>[] {
    return this.process.situationalFactors;
  }

  protected constructor(
    entry: RunningFullProcessEntry | undefined,
    init: RunningFullProcessInit | undefined
  ) {
    super(entry, init);
    if (entry != null) {
      this.contextChange = entry.contextChange ?? this.contextChange;
      this.contextChangeInfo = entry.contextChangeInfo
        ? new ContextChangeInfo(entry.contextChangeInfo, undefined)
        : undefined;
      this.previousContextChanges =
        entry.previousContextChanges?.map(
          (contextChange) => new ContextChangeInfo(contextChange, undefined)
        ) ?? this.previousContextChanges;
    } else if (init != null) {
      if (init.icon == null) {
        this.icon = new Icon(undefined, init.process.icon ?? {});
      }
      this.contextChange = init.contextChange ?? this.contextChange;
      this.contextChangeInfo = init.contextChangeInfo
        ? new ContextChangeInfo(undefined, init.contextChangeInfo)
        : undefined;
      this.previousContextChanges =
        init.previousContextChanges?.map(
          (contextChange) => new ContextChangeInfo(undefined, contextChange)
        ) ?? this.previousContextChanges;
    } else {
      throw new Error('Either entry or init must be provided.');
    }
  }

  /**
   * Get a specific running method by the id of the corresponding node
   *
   * @param nodeId the id of the node
   * @return the running method
   */
  getRunningMethodByNode(
    nodeId: string | undefined
  ): RunningMethod | undefined {
    return this.runningMethods.find((method) => method.nodeId === nodeId);
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
   * Add a running method of the bm process to the currently executed methods list
   *
   * @param nodeId the id of the node or phase method decision
   * @return the added running method
   */
  abstract addRunningMethodOfProcess(nodeId: string): RunningMethod;

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
   * Whether this process is currently in a context change situation
   */
  isContextChange(): this is ContextChangeRunningProcess {
    return this.contextChange;
  }

  /**
   * Check whether a specific node in a process is executable or not
   *
   * @param nodeId
   */
  abstract isExecutable(nodeId: string): boolean;

  toDb(): RunningFullProcessEntry {
    return {
      ...super.toDb(),
      process: this.process.toDb(),
      contextChange: this.contextChange,
      contextChangeInfo: this.contextChangeInfo?.toDb(),
      previousContextChanges: this.previousContextChanges.map((contextChange) =>
        contextChange.toDb()
      ),
    };
  }
}

export function isRunningFullProcess(
  runningProcess: RunningProcess
): runningProcess is RunningFullProcess {
  return (runningProcess as RunningFullProcess).process != null;
}

export function isRunningFullProcessEntry(
  runningProcess: RunningProcessEntry
): runningProcess is RunningFullProcessEntry {
  return (runningProcess as RunningFullProcessEntry).process != null;
}

export function isRunningFullProcessInit(
  runningProcess: RunningProcessInit
): runningProcess is RunningFullProcessInit {
  return (runningProcess as RunningFullProcessInit).process != null;
}
