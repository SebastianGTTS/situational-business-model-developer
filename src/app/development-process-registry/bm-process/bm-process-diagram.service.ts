import { Injectable } from '@angular/core';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { BmProcess, BmProcessDiagram } from './bm-process';
import { BmProcessDiagramModelerService } from './bm-process-diagram-modeler.service';
import { ProcessPattern } from '../process-pattern/process-pattern';
import { ProcessPatternDiagramModelerService } from '../process-pattern/process-pattern-diagram-modeler.service';
import {
  BpmnElement,
  BpmnFlowNode,
  BpmnSequenceFlow,
  BpmnSubProcess,
  Point,
} from 'bpmn-js';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { DevelopmentMethod } from '../development-method/development-method';
import {
  BmProcessDiagramArtifacts,
  MissingArtifactsNodesList,
} from './bm-process-diagram-artifacts';
import { MethodDecision } from './method-decision';
import * as BpmnUtils from '../bpmn/bpmn-utils';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class BmProcessDiagramService {
  constructor(
    private bmProcessDiagramModelerService: BmProcessDiagramModelerService,
    private processPatternDiagramModelerService: ProcessPatternDiagramModelerService
  ) {}

  /**
   * Get an empty bm process diagram to initialize a bm process
   */
  async getEmptyBmProcessDiagram(): Promise<BmProcessDiagram> {
    const modeler = await this.bmProcessDiagramModelerService.initModeling();
    const result =
      await this.bmProcessDiagramModelerService.getBmProcessDiagram(modeler);
    this.bmProcessDiagramModelerService.abortModeling(modeler);
    return result;
  }

  /**
   * Get all node ids with their corresponding process pattern id
   *
   * @param bmProcess
   */
  async getPatternProcesses(
    bmProcess: BmProcess
  ): Promise<{ nodeId: string; processPatternId: string }[]> {
    const modeler = await this.bmProcessDiagramModelerService.initModeling(
      bmProcess
    );
    const patternNodes =
      this.bmProcessDiagramModelerService.getPatternProcesses(modeler);
    this.bmProcessDiagramModelerService.abortModeling(modeler);
    return patternNodes.map((patternNode) => {
      return {
        nodeId: patternNode.id,
        processPatternId:
          this.bmProcessDiagramModelerService.getPatternId(patternNode),
      };
    });
  }

  async checkArtifacts(
    bmProcess: BmProcess
  ): Promise<MissingArtifactsNodesList> {
    const modeler = await this.bmProcessDiagramModelerService.initModeling(
      bmProcess
    );
    const bmProcessDiagramArtifacts = new BmProcessDiagramArtifacts(
      modeler,
      bmProcess.decisions
    );
    const missingMap = bmProcessDiagramArtifacts.checkArtifacts();
    this.bmProcessDiagramModelerService.abortModeling(modeler);
    return missingMap;
  }

  /**
   * Append a process pattern to a BmProcess
   *
   * @param bmProcess
   * @param processPattern
   * @param attachmentPointId the last pattern of the BmProcess to
   * which a new flow will be attached that will lead to the new pattern
   */
  async appendProcessPattern(
    bmProcess: BmProcess,
    processPattern: ProcessPattern,
    attachmentPointId: string
  ): Promise<void> {
    const modeler = await this.bmProcessDiagramModelerService.initModeling(
      bmProcess
    );
    const processPatternModeler =
      await this.processPatternDiagramModelerService.initModeling(
        processPattern
      );
    const attachmentPoint = this.bmProcessDiagramModelerService.getNode(
      modeler,
      attachmentPointId
    ) as BpmnFlowNode;
    if (this.bmProcessDiagramModelerService.hasOutgoingFlows(attachmentPoint)) {
      await this.processPatternDiagramModelerService.abortModeling(
        processPatternModeler
      );
      await this.bmProcessDiagramModelerService.abortModeling(modeler);
      throw new Error('This attachment point can not be used');
    }
    const processPatternBoundaries =
      this.processPatternDiagramModelerService.getBoundaries(
        processPatternModeler
      );
    const processSize = this.bmProcessDiagramModelerService.getProcessSize(
      processPatternBoundaries
    );
    const processPoint =
      this.bmProcessDiagramModelerService.getProcessPointAttachment(
        attachmentPoint,
        processSize
      );
    const process = this.bmProcessDiagramModelerService.createSubProcess(
      modeler,
      processPattern.name,
      processPattern._id,
      attachmentPoint.parent,
      processPoint,
      processSize
    );
    this.bmProcessDiagramModelerService.createConnection(
      modeler,
      attachmentPoint,
      process,
      attachmentPoint.parent
    );
    const translatePoint =
      this.bmProcessDiagramModelerService.getTranslatePointFunction(
        processPatternBoundaries,
        processPoint
      );
    const suffix = '_' + String(Date.now());
    this.appendNodes(
      modeler,
      processPatternModeler,
      process,
      suffix,
      translatePoint
    );
    this.connectNodes(
      modeler,
      processPatternModeler,
      process,
      suffix,
      translatePoint
    );
    await this.processPatternDiagramModelerService.abortModeling(
      processPatternModeler
    );
    await this.bmProcessDiagramModelerService.endModeling(bmProcess, modeler);
  }

  /**
   * Insert a process pattern into a call activity
   *
   * @param bmProcess
   * @param processPattern
   * @param insertPointId the id of the element where to insert the process pattern
   */
  async insertProcessPattern(
    bmProcess: BmProcess,
    processPattern: ProcessPattern,
    insertPointId: string
  ): Promise<void> {
    const modeler = await this.bmProcessDiagramModelerService.initModeling(
      bmProcess
    );
    const processPatternModeler =
      await this.processPatternDiagramModelerService.initModeling(
        processPattern
      );
    const insertPoint = this.bmProcessDiagramModelerService.getNode(
      modeler,
      insertPointId
    ) as BpmnFlowNode;
    const processPatternBoundaries =
      this.processPatternDiagramModelerService.getBoundaries(
        processPatternModeler
      );
    const processSize = this.bmProcessDiagramModelerService.getProcessSize(
      processPatternBoundaries
    );
    let processPoint =
      this.bmProcessDiagramModelerService.getProcessPointInsertion(
        insertPoint,
        processSize
      );
    processPoint = this.bmProcessDiagramModelerService.createSpace(
      modeler,
      processPoint,
      processSize,
      insertPoint
    );
    const process = this.bmProcessDiagramModelerService.createSubProcess(
      modeler,
      processPattern.name,
      processPattern._id,
      insertPoint.parent,
      processPoint,
      processSize,
      this.bmProcessDiagramModelerService.getTaskName(insertPoint)
    );
    this.bmProcessDiagramModelerService.copyBpmnData(
      modeler,
      insertPoint,
      process
    );
    this.bmProcessDiagramModelerService.exchange(modeler, insertPoint, process);
    const translatePoint =
      this.bmProcessDiagramModelerService.getTranslatePointFunction(
        processPatternBoundaries,
        processPoint
      );
    const suffix = '_' + String(Date.now());
    this.appendNodes(
      modeler,
      processPatternModeler,
      process,
      suffix,
      translatePoint
    );
    this.connectNodes(
      modeler,
      processPatternModeler,
      process,
      suffix,
      translatePoint
    );
    await this.processPatternDiagramModelerService.abortModeling(
      processPatternModeler
    );
    await this.bmProcessDiagramModelerService.endModeling(bmProcess, modeler);
  }

  /**
   * Removes a process pattern from the BmProcess
   *
   * @param bmProcess
   * @param subProcessElementId the sub process representing the process pattern
   */
  async removeProcessPattern(
    bmProcess: BmProcess,
    subProcessElementId: string
  ): Promise<{ nodeId: string; decision: MethodDecision }[]> {
    const modeler = await this.bmProcessDiagramModelerService.initModeling(
      bmProcess
    );
    const process = this.bmProcessDiagramModelerService.getNode(
      modeler,
      subProcessElementId
    ) as BpmnFlowNode;
    const removedDecisions: { nodeId: string; decision: MethodDecision }[] = [];
    const removeDecision = (
      event: unknown,
      element: { element: BpmnElement }
    ): void => {
      if (
        element.element.businessObject != null &&
        element.element.businessObject.method != null
      ) {
        removedDecisions.push({
          nodeId: element.element.id,
          decision: bmProcess.decisions[element.element.id],
        });
        bmProcess.removeDecision(element.element.id);
      }
    };
    if (BpmnUtils.isSubProcess(process.parent)) {
      const activity = this.bmProcessDiagramModelerService.createActivity(
        modeler,
        process
      );
      this.bmProcessDiagramModelerService.exchange(
        modeler,
        process,
        activity,
        removeDecision
      );
    } else {
      this.bmProcessDiagramModelerService.removeNode(
        modeler,
        process,
        removeDecision
      );
    }
    await this.bmProcessDiagramModelerService.endModeling(bmProcess, modeler);
    return removedDecisions;
  }

  /**
   * Selects a development method for a process pattern task and adds the development method to the task
   *
   * @param bmProcess
   * @param taskElementId
   * @param developmentMethod
   */
  async insertDevelopmentMethod(
    bmProcess: BmProcess,
    taskElementId: string,
    developmentMethod: DevelopmentMethod
  ): Promise<void> {
    const modeler = await this.bmProcessDiagramModelerService.initModeling(
      bmProcess
    );
    const taskElement = this.bmProcessDiagramModelerService.getNode(
      modeler,
      taskElementId
    ) as BpmnFlowNode;
    this.bmProcessDiagramModelerService.setDevelopmentMethod(
      modeler,
      taskElement,
      developmentMethod.name,
      developmentMethod._id
    );
    await this.bmProcessDiagramModelerService.endModeling(bmProcess, modeler);
  }

  /**
   * Removes a development method from a task in the process
   *
   * @param bmProcess
   * @param taskElementId
   */
  async removeDevelopmentMethod(
    bmProcess: BmProcess,
    taskElementId: string
  ): Promise<void> {
    const modeler = await this.bmProcessDiagramModelerService.initModeling(
      bmProcess
    );
    const taskElement = this.bmProcessDiagramModelerService.getNode(
      modeler,
      taskElementId
    ) as BpmnFlowNode;
    this.bmProcessDiagramModelerService.removeDevelopmentMethod(
      modeler,
      taskElement
    );
    await this.bmProcessDiagramModelerService.endModeling(bmProcess, modeler);
  }

  /**
   * Append all FlowNodes and TextAnnotations to the subprocess
   *
   * @param modeler
   * @param processModeler
   * @param subProcess
   * @param suffix
   * @param translatePoint
   */
  private appendNodes(
    modeler: BpmnModeler,
    processModeler: BpmnModeler,
    subProcess: BpmnSubProcess,
    suffix: string,
    translatePoint: (point: Point) => Point
  ): void {
    this.processPatternDiagramModelerService
      .getNodes(processModeler)
      .forEach((element) =>
        this.bmProcessDiagramModelerService.copyNode(
          modeler,
          subProcess,
          element as BpmnFlowNode,
          suffix,
          translatePoint
        )
      );
  }

  /**
   * Create all connections in the subprocess
   *
   * @param modeler
   * @param processModeler
   * @param subProcess
   * @param suffix
   * @param translatePoint
   * @private
   */
  private connectNodes(
    modeler: BpmnModeler,
    processModeler: BpmnModeler,
    subProcess: BpmnSubProcess,
    suffix: string,
    translatePoint: (point: Point) => Point
  ): void {
    this.processPatternDiagramModelerService
      .getConnections(processModeler)
      .forEach((element) =>
        this.bmProcessDiagramModelerService.copyConnection(
          modeler,
          subProcess,
          element as BpmnSequenceFlow,
          suffix,
          translatePoint
        )
      );
  }
}
