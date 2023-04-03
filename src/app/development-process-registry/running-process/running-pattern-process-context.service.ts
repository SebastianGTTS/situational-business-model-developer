import { Injectable } from '@angular/core';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import {
  ContextChangeErrors,
  RunningProcessContextServiceBase,
} from './running-process-context.service';
import {
  isRunningPatternProcessEntry,
  RunningPatternProcess,
  RunningPatternProcessInit,
} from './running-pattern-process';
import { DbId } from '../../database/database-entry';
import { BmProcessDiagram } from '../bm-process/bm-pattern-process';
import { MethodDecision } from '../bm-process/method-decision';
import { ArtifactDataService } from './artifact-data.service';
import { ArtifactService } from '../method-elements/artifact/artifact.service';
import { DevelopmentMethodService } from '../development-method/development-method.service';
import { MethodExecutionService } from './method-execution.service';
import { PouchdbService } from '../../database/pouchdb.service';
import { Router } from '@angular/router';
import { ProcessPatternService } from '../process-pattern/process-pattern.service';
import { BmPatternProcessDiagramService } from '../bm-process/bm-pattern-process-diagram.service';
import { ProcessExecutionService } from './process-execution.service';
import {
  BmProcessDiagramArtifacts,
  MissingArtifactsNodesList,
} from '../bm-process/bm-process-diagram-artifacts';
import { isCallActivity, isEndEvent, isTask } from '../bpmn/bpmn-utils';
import { BmPatternProcessDiagramModelerService } from '../bm-process/bm-pattern-process-diagram-modeler.service';
import { BmPatternProcessService } from '../bm-process/bm-pattern-process.service';
import { ContextChangeRunningProcess } from './running-full-process';
import { EntryType } from '../../database/database-model-part';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class RunningPatternProcessContextService extends RunningProcessContextServiceBase<
  RunningPatternProcess,
  RunningPatternProcessInit
> {
  protected readonly elementConstructor = RunningPatternProcess;

  constructor(
    artifactDataService: ArtifactDataService,
    artifactService: ArtifactService,
    private bmPatternProcessDiagramModelerService: BmPatternProcessDiagramModelerService,
    private bmPatternProcessDiagramService: BmPatternProcessDiagramService,
    private bmPatternProcessService: BmPatternProcessService,
    developmentMethodService: DevelopmentMethodService,
    methodExecutionService: MethodExecutionService,
    pouchdbService: PouchdbService,
    private processExecutionService: ProcessExecutionService,
    private processPatternService: ProcessPatternService,
    router: Router
  ) {
    super(
      artifactDataService,
      artifactService,
      developmentMethodService,
      methodExecutionService,
      pouchdbService,
      router
    );
  }

  async getList(): Promise<EntryType<RunningPatternProcess>[]> {
    return (await super.getList()).filter((entry) =>
      isRunningPatternProcessEntry(entry)
    );
  }

  /**
   * Save the process diagram of a running process, maybe together with new decisions.
   *
   * @param id
   * @param processDiagram
   * @param decisions
   */
  async saveBmProcessDiagram(
    id: DbId,
    processDiagram: BmProcessDiagram,
    decisions?: { [elementId: string]: MethodDecision }
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      runningProcess.process.processDiagram = processDiagram;
      if (decisions != null) {
        runningProcess.process.updateDecisions(decisions);
        runningProcess.runningMethods = runningProcess.runningMethods.filter(
          (runningMethod) =>
            runningMethod.nodeId == null || runningMethod.nodeId in decisions
        );
      }
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Append a process pattern to a bm process
   *
   * @param id id of the bm process
   * @param patternId id of the pattern to append to the bm process
   * @param nodeId id of the node in the bm process to append the process pattern to
   */
  async appendProcessPattern(
    id: DbId,
    patternId: DbId,
    nodeId: string
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      const pattern = await this.processPatternService.get(patternId);
      if (!(await this.processPatternService.isCorrectlyDefined(pattern))) {
        throw new Error('Process Pattern is not correctly defined');
      }
      await this.bmPatternProcessDiagramService.appendProcessPattern(
        runningProcess.process,
        pattern,
        nodeId
      );
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Insert a process pattern into a process task
   *
   * @param id
   * @param patternId
   * @param nodeId
   */
  async insertProcessPattern(
    id: DbId,
    patternId: DbId,
    nodeId: string
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      const pattern = await this.processPatternService.get(patternId);
      if (!(await this.processPatternService.isCorrectlyDefined(pattern))) {
        throw new Error('Process Pattern is not correctly defined');
      }
      runningProcess.process.removeDecision(nodeId);
      await this.bmPatternProcessDiagramService.insertProcessPattern(
        runningProcess.process,
        pattern,
        nodeId
      );
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Remove a process pattern from a bm process
   *
   * @param id
   * @param nodeId id of the node in the bm process to remove
   */
  async removeProcessPattern(id: DbId, nodeId: string): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      const removedDecisions =
        await this.bmPatternProcessDiagramService.removeProcessPattern(
          runningProcess.process,
          nodeId
        );
      for (const item of removedDecisions) {
        await this.removeDecision(runningProcess, item.nodeId, item.decision);
      }
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Insert a development method into a process task
   *
   * @param id
   * @param nodeId
   * @param developmentMethodId
   */
  async insertDevelopmentMethod(
    id: DbId,
    nodeId: string,
    developmentMethodId: DbId
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      const method = await this.developmentMethodService.get(
        developmentMethodId
      );
      if (!this.developmentMethodService.isCorrectlyDefined(method)) {
        throw new Error('Method not correctly defined');
      }
      runningProcess.process.addDecision(nodeId, method);
      await this.bmPatternProcessDiagramService.insertDevelopmentMethod(
        runningProcess.process,
        nodeId,
        method
      );
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Insert a removed method into a process task
   *
   * @param id
   * @param nodeId
   * @param removedMethodId
   */
  async insertDecision(
    id: DbId,
    nodeId: string,
    removedMethodId: string
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      const removedMethod =
        runningProcess.contextChangeInfo.getRemovedMethod(removedMethodId);
      runningProcess.process.decisions[nodeId] = removedMethod.decision;
      await this.bmPatternProcessDiagramService.insertDevelopmentMethod(
        runningProcess.process,
        nodeId,
        removedMethod.decision.method
      );
      removedMethod.executions.forEach((executionId) => {
        const execution = runningProcess.getExecutedMethod(executionId);
        if (execution != null) {
          execution.nodeId = nodeId;
          runningProcess
            .getArtifactsOfExecutedMethod(executionId)
            .forEach((artifact) =>
              artifact.versions.forEach(
                (version) => (version.createdBy = nodeId)
              )
            );
        }
      });
      if (removedMethod.executions.length > 0) {
        await this.processExecutionService.fakeExecuteMethod(
          runningProcess,
          nodeId
        );
      }
      runningProcess.contextChangeInfo.removeRemovedMethod(removedMethodId);
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Remove a development method from a process task or phase
   *
   * @param id
   * @param nodeId
   */
  async removeDevelopmentMethod(id: DbId, nodeId: string): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      const decision = runningProcess.process.decisions[nodeId];
      runningProcess.process.removeDecision(nodeId);
      await this.bmPatternProcessDiagramService.removeDevelopmentMethod(
        runningProcess.process,
        nodeId
      );
      await this.removeDecision(runningProcess, nodeId, decision);
      await this.processExecutionService.removeExecutedMethod(
        runningProcess,
        nodeId
      );
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Remove an execution from a running process.
   *
   * @param id
   * @param executionId
   */
  async removeExecutedMethod(id: DbId, executionId: string): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      const nodeId = runningProcess.getExecutedMethod(executionId)?.nodeId;
      runningProcess.removeExecutedMethod(executionId);
      if (nodeId != null) {
        const executions = runningProcess.getExecutionsByNodeId(nodeId);
        if (executions.length === 0) {
          await this.processExecutionService.removeExecutedMethod(
            runningProcess,
            nodeId
          );
        }
      }
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  protected async fakeExecuteMethod(
    runningProcess: RunningPatternProcess & ContextChangeRunningProcess,
    nodeId: string
  ): Promise<MethodDecision> {
    await this.processExecutionService.fakeExecuteMethod(
      runningProcess,
      nodeId
    );
    return runningProcess.process.decisions[nodeId];
  }

  /**
   * Reset the execution to a specific position.
   *
   * @param id
   * @param positionNodeId
   */
  async resetExecutionToPosition(
    id: DbId,
    positionNodeId: string
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      await this.processExecutionService.setExecution(
        runningProcess,
        positionNodeId
      );
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Skip the execution of a specific node.
   *
   * @param id
   * @param nodeId
   */
  async skipExecution(id: DbId, nodeId: string): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      if (
        !(await this.processExecutionService.canExecuteNode(
          runningProcess,
          nodeId
        ))
      ) {
        throw new Error(ContextChangeErrors.NOT_EXECUTABLE);
      }
      await this.processExecutionService.moveToNextMethod(
        runningProcess,
        nodeId
      );
      await this.processExecutionService.jumpToNextMethod(runningProcess);
      if (runningProcess.getExecutionsByNodeId(nodeId).length === 0) {
        await this.processExecutionService.removeExecutedMethod(
          runningProcess,
          nodeId
        );
      }
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  async checkExecution(id: DbId): Promise<MissingArtifactsNodesList> {
    const runningProcess = await this.get(id);
    if (!runningProcess.isContextChange()) {
      throw new Error(ContextChangeErrors.WRONG_TYPE);
    }
    const executableNodes =
      await this.processExecutionService.getExecutableNodes(runningProcess);
    const tokenNodes = await this.processExecutionService.getTokenNodes(
      runningProcess
    );
    const modeler =
      await this.bmPatternProcessDiagramModelerService.initModeling(
        runningProcess.process
      );
    const bmProcessDiagramArtifacts = new BmProcessDiagramArtifacts(
      modeler,
      runningProcess.process.decisions
    );
    const missingMap = bmProcessDiagramArtifacts.checkArtifacts(
      new Set<string>(executableNodes.map((node) => node.id)),
      tokenNodes,
      runningProcess.artifacts.map((artifact) => artifact.artifact)
    );
    this.bmPatternProcessDiagramModelerService.abortModeling(modeler);
    return missingMap.filter(
      (node) =>
        isTask(node.node) || isCallActivity(node.node) || isEndEvent(node.node)
    );
  }

  protected async isComplete(
    runningProcess: RunningPatternProcess
  ): Promise<boolean> {
    return this.bmPatternProcessService.isComplete(runningProcess.process);
  }
}
