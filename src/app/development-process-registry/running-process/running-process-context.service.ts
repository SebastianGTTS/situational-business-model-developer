import { Injectable } from '@angular/core';
import { RunningProcessService } from './running-process.service';
import { PouchdbService } from '../../database/pouchdb.service';
import { EntryType } from '../../database/database-model-part';
import {
  ContextChangeRunningProcess,
  FullRunningProcess,
  RunningProcess,
} from './running-process';
import { ArtifactDataService } from './artifact-data.service';
import { MethodExecutionService } from './method-execution.service';
import { ProcessExecutionService } from './process-execution.service';
import { DbId } from '../../database/database-entry';
import { Domain } from '../knowledge/domain';
import { Selection, SelectionInit } from '../development-method/selection';
import {
  SituationalFactor,
  SituationalFactorInit,
} from '../method-elements/situational-factor/situational-factor';
import { MethodDecision } from '../bm-process/method-decision';
import { BmProcessDiagram } from '../bm-process/bm-process';
import {
  BmProcessDiagramArtifacts,
  MissingArtifactsNodesList,
} from '../bm-process/bm-process-diagram-artifacts';
import { Router } from '@angular/router';
import { ArtifactService } from '../method-elements/artifact/artifact.service';
import { BmProcessDiagramModelerService } from '../bm-process/bm-process-diagram-modeler.service';
import { BmProcessDiagramService } from '../bm-process/bm-process-diagram.service';
import { DevelopmentMethodService } from '../development-method/development-method.service';
import { ProcessPatternService } from '../process-pattern/process-pattern.service';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { BmProcessService } from '../bm-process/bm-process.service';
import { RemovedMethod } from './removed-method';
import { v4 as uuidv4 } from 'uuid';
import { isCallActivity, isEndEvent, isTask } from '../bpmn/bpmn-utils';

export enum ContextChangeErrors {
  WRONG_TYPE = 'Process must be in context change mode',
  METHOD_ERROR = 'Method not correctly defined',
  PROCESS_INCOMPLETE = 'Process is incomplete',
  ARTIFACT_ALREADY_MAPPED = 'Artifact already has a mapping to an execution',
  NOT_EXECUTABLE = 'The selected node is not executable',
}

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class RunningProcessContextService extends RunningProcessService {
  constructor(
    artifactDataService: ArtifactDataService,
    artifactService: ArtifactService,
    private bmProcessDiagramModelerService: BmProcessDiagramModelerService,
    private bmProcessDiagramService: BmProcessDiagramService,
    private bmProcessService: BmProcessService,
    private developmentMethodService: DevelopmentMethodService,
    methodExecutionService: MethodExecutionService,
    pouchdbService: PouchdbService,
    processExecutionService: ProcessExecutionService,
    private processPatternService: ProcessPatternService,
    router: Router
  ) {
    super(
      artifactDataService,
      artifactService,
      methodExecutionService,
      pouchdbService,
      processExecutionService,
      router
    );
  }

  async getList(): Promise<EntryType<RunningProcess>[]> {
    return this.pouchdbService.find<EntryType<RunningProcess>>(this.typeName, {
      selector: {
        contextChange: true,
      },
    });
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
   * Update the domains of the running process.
   * Updates the internal bm process.
   *
   * @param id
   * @param domains
   */
  async updateDomains(id: DbId, domains: Domain[]): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      runningProcess.process.domains = domains;
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Update the situational factors of the running process.
   * Updates the internal bm process.
   *
   * @param id
   * @param situationalFactors
   */
  async updateSituationalFactors(
    id: DbId,
    situationalFactors: SelectionInit<SituationalFactorInit>[]
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      runningProcess.process.situationalFactors = situationalFactors.map(
        (selection) =>
          new Selection<SituationalFactor>(
            undefined,
            selection,
            SituationalFactor
          )
      );
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
      await this.bmProcessDiagramService.appendProcessPattern(
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
      await this.bmProcessDiagramService.insertProcessPattern(
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
        await this.bmProcessDiagramService.removeProcessPattern(
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
      await this.bmProcessDiagramService.insertDevelopmentMethod(
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
      await this.bmProcessDiagramService.insertDevelopmentMethod(
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
   * Remove a development method from a process task
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
      await this.bmProcessDiagramService.removeDevelopmentMethod(
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
   * Remove the mappings towards a node.
   * This aborts all executions of the node,
   * removes all mappings from executions to the node,
   * adds the decision to the removed methods, and
   * removes all mappings from artifacts to the node.
   *
   * @param runningProcess
   * @param nodeId
   * @param decision
   */
  private async removeDecision(
    runningProcess: ContextChangeRunningProcess,
    nodeId: string,
    decision: MethodDecision
  ): Promise<void> {
    /* there should be only one method with this nodeId currently running, but to be more
     robust we use a for loop */
    for (
      let runningMethod = runningProcess.getRunningMethodByNode(nodeId);
      runningMethod != null;
      runningMethod = runningProcess.getRunningMethodByNode(nodeId)
    ) {
      await this.methodExecutionService.abortMethodExecution(
        runningProcess,
        runningMethod.executionId
      );
    }
    const executions = runningProcess.getExecutionsByNodeId(nodeId);
    runningProcess.contextChangeInfo.addRemovedMethod(
      new RemovedMethod(undefined, {
        executions: executions.map((execution) => execution.executionId),
        decision: decision,
      })
    );
    executions.forEach((execution) => (execution.nodeId = undefined));
    const artifacts = runningProcess.getArtifactsCreatedByNode(nodeId);
    artifacts.forEach((artifact) =>
      artifact.versions.forEach((version) => (version.createdBy = 'manual'))
    );
  }

  /**
   * Remove an already removed method forever.
   *
   * @param id
   * @param removedMethodId
   */
  async removeRemovedMethod(id: DbId, removedMethodId: string): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      runningProcess.contextChangeInfo.removeRemovedMethod(removedMethodId);
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

  /**
   * Fake a method execution
   *
   * @param id
   * @param nodeId
   * @param outputMapping
   */
  async fakeMethodExecution(
    id: DbId,
    nodeId: string,
    outputMapping: { artifact: number; version: number }[]
  ): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      await this.processExecutionService.fakeExecuteMethod(
        runningProcess,
        nodeId
      );
      const executionId = uuidv4();
      runningProcess.addExecutedMethod({
        methodName: runningProcess.process.decisions[nodeId].method.name,
        executionId: executionId,
        nodeId: nodeId,
        comments: [],
      });
      outputMapping.forEach((mapping) => {
        const artifactVersion =
          runningProcess.artifacts[mapping.artifact].versions[mapping.version];
        if (artifactVersion.executedBy != null) {
          throw new Error(ContextChangeErrors.ARTIFACT_ALREADY_MAPPED);
        }
        artifactVersion.executedBy = executionId;
        artifactVersion.createdBy = nodeId;
      });
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
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
    const modeler = await this.bmProcessDiagramModelerService.initModeling(
      runningProcess.process
    );
    const bmProcessDiagramArtifacts = new BmProcessDiagramArtifacts(
      modeler,
      runningProcess.process.decisions
    );
    const missingMap = bmProcessDiagramArtifacts.checkArtifacts(
      new Set<string>(executableNodes.map((node) => node.id)),
      runningProcess.artifacts.map((artifact) => artifact.artifact)
    );
    this.bmProcessDiagramModelerService.abortModeling(modeler);
    return missingMap.filter(
      (node) =>
        isTask(node.node) || isCallActivity(node.node) || isEndEvent(node.node)
    );
  }

  async updateStep(runningProcessId: DbId, step: string): Promise<void> {
    try {
      const runningProcess = await this.getWrite(runningProcessId);
      if (!runningProcess.isContextChange()) {
        return; // ignore wrong type as called on destroy if context change already finished
      }
      runningProcess.contextChangeInfo.step = step;
      await this.save(runningProcess);
    } finally {
      this.freeWrite(runningProcessId);
    }
  }

  async finishContextChange(runningProcessId: DbId): Promise<void> {
    try {
      let runningProcess: RunningProcess = await this.getWrite(
        runningProcessId
      );
      if (!runningProcess.isContextChange()) {
        throw new Error(ContextChangeErrors.WRONG_TYPE);
      }
      if (!this.bmProcessService.isComplete(runningProcess.process)) {
        throw new Error(ContextChangeErrors.PROCESS_INCOMPLETE);
      }
      runningProcess.previousContextChanges.push(
        runningProcess.contextChangeInfo
      );
      runningProcess = runningProcess as FullRunningProcess;
      runningProcess.contextChange = false;
      runningProcess.contextChangeInfo = undefined;
      await this.save(runningProcess);
    } finally {
      this.freeWrite(runningProcessId);
    }
  }
}
