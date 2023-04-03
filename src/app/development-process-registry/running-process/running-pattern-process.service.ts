import { Injectable } from '@angular/core';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import {
  RunningPatternProcess,
  RunningPatternProcessInit,
} from './running-pattern-process';
import { RunningFullProcessServiceBase } from './running-full-process.service';
import { DbId } from '../../database/database-entry';
import { ArtifactDataService } from './artifact-data.service';
import { ArtifactService } from '../method-elements/artifact/artifact.service';
import { MethodExecutionService } from './method-execution.service';
import { PouchdbService } from '../../database/pouchdb.service';
import { ProcessExecutionService } from './process-execution.service';
import { Router } from '@angular/router';
import { BpmnFlowNode } from 'bpmn-js';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class RunningPatternProcessService extends RunningFullProcessServiceBase<
  RunningPatternProcess,
  RunningPatternProcessInit
> {
  protected readonly elementConstructor = RunningPatternProcess;

  constructor(
    artifactDataService: ArtifactDataService,
    artifactService: ArtifactService,
    methodExecutionService: MethodExecutionService,
    pouchdbService: PouchdbService,
    protected processExecutionService: ProcessExecutionService,
    router: Router
  ) {
    super(
      artifactDataService,
      artifactService,
      methodExecutionService,
      pouchdbService,
      router
    );
  }

  /**
   * Add new running process from a process.
   *
   * @param element the running process
   */
  async add(
    element: RunningPatternProcessInit
  ): Promise<RunningPatternProcess> {
    const runningProcess = new RunningPatternProcess(undefined, element);
    await this.processExecutionService.initRunningProcess(runningProcess);
    await this.processExecutionService.jumpToNextMethod(runningProcess);
    await this.save(runningProcess);
    return runningProcess;
  }

  /**
   * Execute a single common node
   *
   * @param id the id of the running process
   * @param nodeId the id of the node to execute
   * @param flowId the flow id to take after the execution if it is an exclusive gateway
   */
  async executeStep(id: DbId, nodeId: string, flowId?: string): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      await this.processExecutionService.moveToNextStep(
        runningProcess,
        nodeId,
        flowId
      );
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Execute a single common node and jump to next methods or decisions
   *
   * @param id the id of the running process
   * @param nodeId the id of the node to execute
   * @param flowId the flow id to take after the execution if it is an exclusive gateway
   * @return whether there are executable methods left
   */
  async executeStepAndJump(
    id: DbId,
    nodeId: string,
    flowId?: string
  ): Promise<boolean> {
    try {
      const runningProcess = await this.getWrite(id);
      await this.processExecutionService.moveToNextStep(
        runningProcess,
        nodeId,
        flowId
      );
      await this.processExecutionService.jumpToNextMethod(runningProcess);
      await this.save(runningProcess);
      return await this.hasExecutableMethodsLeft(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Jump to next methods or decisions
   *
   * @param id the id of the running process
   */
  async jumpSteps(id: DbId): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      await this.processExecutionService.jumpToNextMethod(runningProcess);
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  /**
   * Start the execution of a method
   *
   * @param id the id of the running process
   * @param nodeId the id of the node to execute
   */
  async startMethodExecution(id: string, nodeId: string): Promise<void> {
    try {
      const runningProcess = await this.getWrite(id);
      if (
        !(await this.processExecutionService.canExecuteNode(
          runningProcess,
          nodeId
        ))
      ) {
        throw new Error('Can not execute node');
      }
      this.methodExecutionService.startMethodExecution(runningProcess, nodeId);
      await this.save(runningProcess);
    } finally {
      this.freeWrite(id);
    }
  }

  protected async moveToNextMethod(
    runningProcess: RunningPatternProcess,
    nodeId: string
  ): Promise<void> {
    await this.processExecutionService.moveToNextMethod(runningProcess, nodeId);
  }

  protected async hasExecutableMethodsLeft(
    runningProcess: RunningPatternProcess
  ): Promise<boolean> {
    if (await super.hasExecutableMethodsLeft(runningProcess)) {
      return true;
    }
    return (await this.getExecutableElements(runningProcess)).length > 0;
  }

  async getExecutableElements(
    runningProcess: RunningPatternProcess
  ): Promise<BpmnFlowNode[]> {
    return this.processExecutionService.getExecutableNodes(runningProcess);
  }

  /**
   * Get all decision nodes that are executable and need a decision
   *
   * @param runningProcess the running process
   * @return the decision nodes
   */
  async getExecutableDecisionNodes(
    runningProcess: RunningPatternProcess
  ): Promise<BpmnFlowNode[]> {
    return this.processExecutionService.getExecutableDecisionNodes(
      runningProcess
    );
  }

  /**
   * Get all executable method elements that are not already executed
   *
   * @param runningProcess the running process
   * @return a list of nodes which have methods that can be executed
   */
  async getExecutableMethods(
    runningProcess: RunningPatternProcess
  ): Promise<BpmnFlowNode[]> {
    const executableNodes =
      await this.processExecutionService.getExecutableNodes(runningProcess);
    const methods = executableNodes.filter((node) =>
      runningProcess.isExecutable(node.id)
    );
    return methods.filter(
      (node) => runningProcess.getRunningMethodByNode(node.id) == null
    );
  }
}
