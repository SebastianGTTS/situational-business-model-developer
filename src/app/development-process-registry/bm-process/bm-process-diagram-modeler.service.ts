import { Injectable } from '@angular/core';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import bmdl from '../../../assets/bpmn_bmdl.json';
import { BmProcess, BmProcessDiagram } from './bm-process';
import { DevelopmentProcessRegistryModule } from '../development-process-registry.module';
import { ModelerService } from '../bpmn/modeler.service';
import {
  BoxSizedElement,
  BpmnElement,
  BpmnFlowNode,
  BpmnSequenceFlow,
  BpmnSubProcess,
  Point,
  Size,
} from 'bpmn-js';
import { center } from 'diagram-js/lib/util/PositionUtil';
import { DbId } from '../../database/database-entry';
import * as BpmnUtils from '../bpmn/bpmn-utils';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { selfAndChildren } from 'diagram-js/lib/util/Elements';
import { pointInRect } from 'diagram-js/lib/util/Geometry';
import { Type } from '../method-elements/type/type';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule,
})
export class BmProcessDiagramModelerService extends ModelerService {
  /**
   * Get a BpmnModeler with customizations to support the development of business model development processes
   *
   * @returns the bpmnModeler loaded with the BmProcess
   */
  async initModeling(bmProcess?: BmProcess): Promise<BpmnModeler> {
    const processModeler = BmProcessDiagramModelerService.getBmProcessModeler();
    if (bmProcess != null) {
      await processModeler.importXML(bmProcess.processDiagram);
    } else {
      await processModeler.createDiagram();
    }
    return processModeler;
  }

  /**
   * Get the diagram of the BmProcess
   *
   * @param modeler
   */
  async getBmProcessDiagram(modeler: BpmnModeler): Promise<BmProcessDiagram> {
    const result = await modeler.saveXML();
    return result.xml;
  }

  /**
   * End the modeling and update the diagram of the BmProcess
   *
   * @param bmProcess
   * @param modeler
   */
  async endModeling(bmProcess: BmProcess, modeler: BpmnModeler): Promise<void> {
    const result = await modeler.saveXML();
    bmProcess.processDiagram = result.xml;
    modeler.destroy();
  }

  /**
   * Get a BpmnModeler with customizations to support the development of business model development processes
   *
   * @returns a bpmnModeler
   */
  private static getBmProcessModeler(): BpmnModeler {
    return new BpmnModeler({
      additionalModules: [],
      moddleExtensions: {
        bmdl,
      },
    });
  }

  /**
   * Get the task name of a task node
   *
   * @param node
   */
  getTaskName(node: BpmnFlowNode): string {
    return node.businessObject.name;
  }

  /**
   * Get types of an activity that specify which methods can be used. Also queries parents if types are inherited.
   *
   * @param node
   */
  getTypesOfActivity(node: BpmnFlowNode): {
    neededType: { list: string; element?: { _id: string; name: string } }[];
    forbiddenType: { list: string; element?: { _id: string; name: string } }[];
  } {
    let businessObject = node.businessObject;
    while (
      businessObject != null &&
      (businessObject.inherit || !businessObject.neededType)
    ) {
      businessObject = businessObject.$parent;
    }
    return {
      neededType: businessObject ? businessObject.get('neededType') : [],
      forbiddenType: businessObject ? businessObject.get('forbiddenType') : [],
    };
  }

  /**
   * Get all pattern elements
   *
   * @param modeler
   * @returns elements that are used as a pattern
   */
  getPatternProcesses(modeler: BpmnModeler): BpmnSubProcess[] {
    return modeler
      .get('elementRegistry')
      .filter((element) =>
        element.businessObject.get('processPatternId')
      ) as BpmnSubProcess[];
  }

  /**
   * Get the pattern id of a node
   *
   * @param node
   */
  getPatternId(node: BpmnSubProcess): string {
    return node.businessObject.get('processPatternId');
  }

  /**
   * Get the size of a subprocess based on the boundaries of a process pattern
   *
   * @param processPatternBoundaries
   */
  getProcessSize(processPatternBoundaries: BoxSizedElement): Size {
    return {
      height: processPatternBoundaries.height + 50,
      width: processPatternBoundaries.width + 40,
    };
  }

  /**
   * Get the upper left point of a process which should be added after the attachment point.
   *
   * @param attachmentPoint
   * @param processSize
   */
  getProcessPointAttachment(
    attachmentPoint: BpmnFlowNode,
    processSize: Size
  ): Point {
    const attachmentCenterPoint = center(attachmentPoint);
    return {
      x: attachmentPoint.x + attachmentPoint.width + 50,
      y: attachmentCenterPoint.y - processSize.height / 2,
    };
  }

  /**
   * Get the upper left point of a process which should be inserted.
   *
   * @param insertPoint
   * @param processSize
   */
  getProcessPointInsertion(
    insertPoint: BpmnFlowNode,
    processSize: Size
  ): Point {
    const mid = center(insertPoint);
    return {
      x: mid.x - processSize.width / 2,
      y: mid.y - processSize.height / 2,
    };
  }

  /**
   * Build a translation function to convert from a point in the process pattern
   * to a point in the new process
   *
   * @param processPatternPoint the upper left point of the process pattern
   * @param processPoint the upper left point of the new process
   */
  getTranslatePointFunction(
    processPatternPoint: Point,
    processPoint: Point
  ): (point: Point) => Point {
    return (point: Point): Point => {
      return {
        x: point.x - processPatternPoint.x + processPoint.x + 20,
        y: point.y - processPatternPoint.y + processPoint.y + 30,
      };
    };
  }

  /**
   * Create a subprocess
   *
   * @param modeler
   * @param name
   * @param processPatternId
   * @param parent
   * @param point
   * @param size
   * @param taskName only if inserting
   * @returns the created subprocess
   */
  createSubProcess(
    modeler: BpmnModeler,
    name: string,
    processPatternId: string,
    parent: BpmnElement,
    point: Point,
    size: Size,
    taskName?: string
  ): BpmnSubProcess {
    const bmBusinessObject = modeler
      .get('bpmnFactory')
      .create('bpmn:SubProcess', {
        name,
      });
    const bmElement = modeler.get('elementFactory').createShape({
      type: 'bpmn:SubProcess',
      isExpanded: true,
      businessObject: bmBusinessObject,
    });
    const modeling = modeler.get('modeling');
    const subprocess = modeling.createShape(
      bmElement,
      { ...point, ...size },
      parent
    ) as BpmnSubProcess;
    modeling.updateProperties(subprocess, {
      processPatternId,
      taskName,
    });
    return subprocess;
  }

  /**
   * Recreate an activity from a subprocess
   *
   * @param modeler
   * @param subprocess
   */
  createActivity(modeler: BpmnModeler, subprocess: BpmnFlowNode): BpmnFlowNode {
    const bpmnFactory = modeler.get('bpmnFactory');
    const elementFactory = modeler.get('elementFactory');
    const modeling = modeler.get('modeling');
    const bmBusinessObject = bpmnFactory.create('bpmn:CallActivity', {
      name: subprocess.businessObject.get('taskName'),
    });
    const bmElement = elementFactory.createShape({
      type: 'bpmn:CallActivity',
      businessObject: bmBusinessObject,
    });
    const activity = modeling.createShape(
      bmElement,
      center(subprocess),
      subprocess.parent
    );
    this.copyBpmnData(modeler, subprocess, activity);
    return activity;
  }

  /**
   * Copy BPMN relevant data, like types
   *
   * @param modeler
   * @param oldElement the old element
   * @param newElement the new element
   */
  copyBpmnData(
    modeler: BpmnModeler,
    oldElement: BpmnElement,
    newElement: BpmnElement
  ): void {
    modeler.get('modeling').updateProperties(newElement, {
      inherit: oldElement.businessObject.get('inherit'),
      neededType: oldElement.businessObject
        .get('neededType')
        .map((element: { list: string; element?: Type }) =>
          this.mapTypes(modeler, element)
        ),
      forbiddenType: oldElement.businessObject
        .get('forbiddenType')
        .map((element: { list: string; element?: Type }) =>
          this.mapTypes(modeler, element)
        ),
    });
  }

  /**
   * Map the types from one element to another
   *
   * @param modeler
   * @param element
   */
  mapTypes(
    modeler: BpmnModeler,
    element: { list: string; element?: Type }
  ): unknown {
    const moddle = modeler.get('moddle');
    return moddle.create('bmdl:Type', {
      list: element.list,
      element: element.element
        ? moddle.create('bmdl:MethodElement', {
            _id: element.element._id,
            name: element.element.name,
          })
        : undefined,
    });
  }

  /**
   * Create a connection between two flow nodes
   *
   * @param modeler
   * @param from
   * @param to
   * @param parent
   */
  createConnection(
    modeler: BpmnModeler,
    from: BpmnFlowNode,
    to: BpmnFlowNode,
    parent: BpmnElement
  ): void {
    modeler
      .get('modeling')
      .createConnection(from, to, { type: 'bpmn:SequenceFlow' }, parent);
  }

  /**
   * Reconnect an already existing connection
   *
   * @param modeler
   * @param source the new source
   * @param target the new target
   * @param oldConnection the old connection
   */
  reconnect(
    modeler: BpmnModeler,
    source: BpmnFlowNode,
    target: BpmnFlowNode,
    oldConnection: BpmnSequenceFlow
  ): void {
    const bpmnFactory = modeler.get('bpmnFactory');
    const elementFactory = modeler.get('elementFactory');
    const modeling = modeler.get('modeling');
    const flowBusinessObject = bpmnFactory.create(
      oldConnection.businessObject.$type,
      {
        name: oldConnection.businessObject.name,
      }
    );
    let waypoints = oldConnection.waypoints.slice();
    if (oldConnection.source !== source) {
      // Find index of last point that is in the new source
      let index: number | undefined = undefined;
      for (let i = waypoints.length - 1; i >= 0; --i) {
        if (pointInRect(waypoints[i], source, 20)) {
          index = i;
          break;
        }
      }
      if (index != null) {
        waypoints = waypoints.slice(index);
      } else if (waypoints.length > 0) {
        waypoints.unshift({
          x: source.x + source.width / 2,
          y: source.y + source.height / 2,
        });
      }
    }
    if (oldConnection.target !== target) {
      // Find index of first point that is in the new target
      let index: number | undefined = undefined;
      for (let i = 0; i < waypoints.length; ++i) {
        if (pointInRect(waypoints[i], target, 20)) {
          index = i;
          break;
        }
      }
      if (index != null) {
        waypoints = waypoints.slice(0, index + 1);
      } else if (waypoints.length > 0) {
        waypoints.push({
          x: target.x + source.width / 2,
          y: target.y + target.height / 2,
        });
      }
    }
    const flowElement = elementFactory.createConnection({
      type: oldConnection.type,
      businessObject: flowBusinessObject,
      waypoints: waypoints.length > 1 ? waypoints : undefined,
    });
    modeling.createConnection(
      source,
      target,
      flowElement,
      oldConnection.parent
    );
    if (flowElement.label) {
      modeling.updateLabel(flowElement, oldConnection.businessObject.name, {
        x: oldConnection.label.x,
        y: oldConnection.label.y,
        height: oldConnection.label.height,
        width: oldConnection.label.width,
      });
    }
  }

  /**
   * Exchange an old node with a new node
   *
   * @param modeler
   * @param oldNode
   * @param newNode
   * @param onDelete the method to execute if an element is removed
   */
  exchange(
    modeler: BpmnModeler,
    oldNode: BpmnFlowNode,
    newNode: BpmnFlowNode,
    onDelete?: (event: unknown, element: { element: BpmnElement }) => void
  ): void {
    oldNode.incoming.forEach((flow) =>
      this.reconnect(modeler, flow.source, newNode, flow)
    );
    oldNode.outgoing.forEach((flow) =>
      this.reconnect(modeler, newNode, flow.target, flow)
    );
    this.removeNode(modeler, oldNode, onDelete);
  }

  /**
   * Remove a node
   *
   * @param modeler
   * @param node
   * @param onDelete the method to execute if an element is removed
   */
  removeNode(
    modeler: BpmnModeler,
    node: BpmnFlowNode,
    onDelete?: (event: unknown, element: { element: BpmnElement }) => void
  ): void {
    if (onDelete != null) {
      modeler.get('eventBus').on('shape.remove', onDelete);
    }
    modeler
      .get('modeling')
      .removeElements([...node.incoming, ...node.outgoing, node]);
    if (onDelete != null) {
      modeler.get('eventBus').off('shape.remove', onDelete);
    }
  }

  /**
   * Checks whether the node has any outgoing flow.
   *
   * @param node
   */
  hasOutgoingFlows(node: BpmnFlowNode): boolean {
    return node.businessObject.get('outgoing').length > 0;
  }

  /**
   * Copy a node and add it to a process
   *
   * @param modeler
   * @param subProcess
   * @param element
   * @param suffix
   * @param translatePoint a translation from the current coordinates to the new coordinates
   */
  copyNode(
    modeler: BpmnModeler,
    subProcess: BpmnSubProcess,
    element: BpmnFlowNode,
    suffix: string,
    translatePoint: (point: Point) => Point
  ): void {
    const bpmnFactory = modeler.get('bpmnFactory');
    const elementFactory = modeler.get('elementFactory');
    const elementRegistry = modeler.get('elementRegistry');
    const modeling = modeler.get('modeling');
    const bmBusinessObject = bpmnFactory.create(element.businessObject.$type, {
      ...element.businessObject,
      id: element.businessObject.id + suffix,
      attachedToRef: element.businessObject.attachedToRef
        ? elementRegistry.get(element.businessObject.attachedToRef.id + suffix)
        : undefined,
    });
    const bmElement = elementFactory.createShape({
      type: element.type,
      businessObject: bmBusinessObject,
    });
    modeling.createShape(
      bmElement,
      {
        ...translatePoint(element),
        height: element.height,
        width: element.width,
      },
      subProcess
    );
    if (bmElement.label) {
      modeling.updateLabel(bmElement, bmBusinessObject.name, {
        ...translatePoint(element.label),
        height: element.label.height,
        width: element.label.width,
      });
    }
  }

  /**
   * Copy a connection and add it to a process
   *
   * @param modeler
   * @param subProcess
   * @param element
   * @param suffix
   * @param translatePoint
   */
  copyConnection(
    modeler: BpmnModeler,
    subProcess: BpmnSubProcess,
    element: BpmnSequenceFlow,
    suffix: string,
    translatePoint: (point: Point) => Point
  ): void {
    const bpmnFactory = modeler.get('bpmnFactory');
    const elementFactory = modeler.get('elementFactory');
    const elementRegistry = modeler.get('elementRegistry');
    const modeling = modeler.get('modeling');
    const connection = element.businessObject;
    const source = elementRegistry.get(
      connection.sourceRef.id + suffix
    ) as BpmnFlowNode;
    const target = elementRegistry.get(
      connection.targetRef.id + suffix
    ) as BpmnFlowNode;
    const waypoints = element.waypoints.map((waypoint) =>
      translatePoint(waypoint)
    );
    const flowBusinessObject = bpmnFactory.create(connection.$type, {
      id: connection.id + suffix,
      name: connection.name,
    });
    const flowElement = elementFactory.createConnection({
      type: element.type,
      businessObject: flowBusinessObject,
      waypoints,
    });
    modeling.createConnection(source, target, flowElement, subProcess);
    if (flowElement.label) {
      modeling.updateLabel(flowElement, connection.name, {
        ...translatePoint(element.label),
        height: element.label.height,
        width: element.label.width,
      });
    }
  }

  /**
   * Set the development method of a specific task element of the BmProcess
   *
   * @param modeler
   * @param taskElement
   * @param name the name of the development method
   * @param id the database id of the development method
   */
  setDevelopmentMethod(
    modeler: BpmnModeler,
    taskElement: BpmnFlowNode,
    name: string,
    id: DbId
  ): void {
    const moddle = modeler.get('moddle');
    const modeling = modeler.get('modeling');
    modeling.updateProperties(taskElement, {
      method: moddle.create('bmdl:Method', {
        name: name,
        id: id,
      }),
    });
  }

  /**
   * Remove the development method of a specific task element of the BmProcess
   *
   * @param modeler
   * @param taskElement
   */
  removeDevelopmentMethod(
    modeler: BpmnModeler,
    taskElement: BpmnFlowNode
  ): void {
    const modeling = modeler.get('modeling');
    modeling.updateProperties(taskElement, { method: null });
  }

  /**
   * Create space for a process
   *
   * @param modeler
   * @param processPoint
   * @param processSize
   * @param insertPoint
   * @return the new process point
   */
  createSpace(
    modeler: BpmnModeler,
    processPoint: Point,
    processSize: Size,
    insertPoint: BpmnFlowNode
  ): Point {
    let newProcessPoint = processPoint;
    const innerSubProcesses = this.getParents(insertPoint);
    const leftRightCheck =
      this.checkLeftSpace(
        modeler,
        processPoint,
        insertPoint,
        innerSubProcesses
      ) ||
      this.checkRightSpace(
        modeler,
        processPoint,
        processSize,
        insertPoint,
        innerSubProcesses
      );
    const topBottomCheck =
      this.checkTopSpace(
        modeler,
        processPoint,
        insertPoint,
        innerSubProcesses
      ) ||
      this.checkBottomSpace(
        modeler,
        processPoint,
        processSize,
        insertPoint,
        innerSubProcesses
      );
    const completeSpaceCheck = this.checkCompleteSpace(
      modeler,
      processPoint,
      processSize,
      insertPoint,
      innerSubProcesses
    );
    const delta = {
      x: (processSize.width - insertPoint.width) / 2,
      y: (processSize.height - insertPoint.height) / 2,
    };
    if (leftRightCheck || (completeSpaceCheck && !topBottomCheck)) {
      this.createLeftSpace(modeler, insertPoint, innerSubProcesses, delta.x);
      newProcessPoint = {
        x: newProcessPoint.x + delta.x,
        y: newProcessPoint.y,
      };
      this.createRightSpace(modeler, insertPoint, innerSubProcesses, delta.x);
    }
    if (topBottomCheck) {
      this.createTopSpace(modeler, insertPoint, innerSubProcesses, delta.y);
      newProcessPoint = {
        x: newProcessPoint.x,
        y: newProcessPoint.y + delta.y,
      };
      this.createBottomSpace(modeler, insertPoint, innerSubProcesses, delta.y);
    }
    return newProcessPoint;
  }

  /**
   * Check whether there is enough space on the left side
   *
   * @param modeler
   * @param processPoint
   * @param insertPoint
   * @param innerSubProcesses
   * @return true if there is not enough space
   */
  private checkLeftSpace(
    modeler: BpmnModeler,
    processPoint: Point,
    insertPoint: BpmnFlowNode,
    innerSubProcesses: BpmnSubProcess[]
  ): boolean {
    const condition = (element: BoxSizedElement): boolean =>
      element.x + element.width < processPoint.x ||
      element.x > insertPoint.x ||
      element.y + element.height < insertPoint.y ||
      element.y > insertPoint.y + insertPoint.height;
    return (
      this.checkSpace(modeler, insertPoint, condition, innerSubProcesses) ||
      insertPoint.parent.x > processPoint.x
    );
  }

  /**
   * Check whether there is enough space on the right side
   *
   * @param modeler
   * @param processPoint
   * @param processSize
   * @param insertPoint
   * @param innerSubProcesses
   * @return true if there is not enough space
   */
  private checkRightSpace(
    modeler: BpmnModeler,
    processPoint: Point,
    processSize: Size,
    insertPoint: BpmnFlowNode,
    innerSubProcesses: BpmnSubProcess[]
  ): boolean {
    const condition = (element: BoxSizedElement): boolean =>
      element.x + element.width < insertPoint.x + insertPoint.width ||
      element.x > processPoint.x + processSize.width ||
      element.y + element.height < insertPoint.y ||
      element.y > insertPoint.y + insertPoint.height;
    return (
      this.checkSpace(modeler, insertPoint, condition, innerSubProcesses) ||
      insertPoint.parent.x + insertPoint.parent.width <
        processPoint.x + processSize.width
    );
  }

  /**
   * Check whether there is enough space on the top side
   *
   * @param modeler
   * @param processPoint
   * @param insertPoint
   * @param innerSubProcesses
   * @return true if there is not enough space
   */
  private checkTopSpace(
    modeler: BpmnModeler,
    processPoint: Point,
    insertPoint: BpmnFlowNode,
    innerSubProcesses: BpmnSubProcess[]
  ): boolean {
    const condition = (element: BoxSizedElement): boolean =>
      element.x + element.width < insertPoint.x ||
      element.x > insertPoint.x + insertPoint.width ||
      element.y + element.height < processPoint.y ||
      element.y > insertPoint.y;
    return (
      this.checkSpace(modeler, insertPoint, condition, innerSubProcesses) ||
      insertPoint.parent.y > processPoint.y
    );
  }

  /**
   * Check whether there is enough space on the bottom side
   *
   * @param modeler
   * @param processPoint
   * @param processSize
   * @param insertPoint
   * @param innerSubProcesses
   * @return true if there is not enough space
   */
  private checkBottomSpace(
    modeler: BpmnModeler,
    processPoint: Point,
    processSize: Size,
    insertPoint: BpmnFlowNode,
    innerSubProcesses: BpmnSubProcess[]
  ): boolean {
    const condition = (element: BoxSizedElement): boolean =>
      element.x + element.width < insertPoint.x ||
      element.x > insertPoint.x + insertPoint.width ||
      element.y + element.height < insertPoint.y + insertPoint.height ||
      element.y > processPoint.y + processSize.height;
    return (
      this.checkSpace(modeler, insertPoint, condition, innerSubProcesses) ||
      insertPoint.parent.y + insertPoint.parent.height <
        processPoint.y + processSize.height
    );
  }

  /**
   * Check whether there is overall enough space
   *
   * @param modeler
   * @param processPoint
   * @param processSize
   * @param insertPoint
   * @param innerSubProcesses
   * @return true if there is not enough space
   */
  private checkCompleteSpace(
    modeler: BpmnModeler,
    processPoint: Point,
    processSize: Size,
    insertPoint: BpmnFlowNode,
    innerSubProcesses: BpmnSubProcess[]
  ): boolean {
    const condition = (element: BoxSizedElement): boolean =>
      element.x + element.width < processPoint.x ||
      element.x > processPoint.x + processSize.width ||
      element.y + element.height < processPoint.y ||
      element.y > processPoint.y + processSize.height;
    return this.checkSpace(modeler, insertPoint, condition, innerSubProcesses);
  }

  /**
   * Check whether there is space based on the condition
   *
   * @param modeler
   * @param insertPoint
   * @param condition whether an element is considered as outside the new process
   * @param innerSubProcesses
   * @return true if there is not enough space
   */
  private checkSpace(
    modeler: BpmnModeler,
    insertPoint: BpmnFlowNode,
    condition: (element: BoxSizedElement) => boolean,
    innerSubProcesses: BpmnSubProcess[]
  ): boolean {
    const elements = modeler
      .get('elementRegistry')
      .filter(
        (element) =>
          element.id !== insertPoint.id &&
          !BpmnUtils.isProcess(element) &&
          !innerSubProcesses.includes(element as BpmnSubProcess)
      );
    const waypointsToLines = (waypoints: Point[]): BoxSizedElement[] => {
      const lines = [];
      for (let i = 0; i < waypoints.length - 1; ++i) {
        lines.push({
          x: Math.min(waypoints[i].x, waypoints[i + 1].x),
          y: Math.min(waypoints[i].y, waypoints[i + 1].y),
          width: Math.abs(waypoints[i + 1].x - waypoints[i].x),
          height: Math.abs(waypoints[i + 1].y - waypoints[i].y),
        });
      }
      return lines;
    };
    return (
      elements.some(
        (element) =>
          (element as BpmnSequenceFlow).waypoints === undefined &&
          !condition(element as BpmnFlowNode)
      ) ||
      elements.some(
        (element) =>
          (element as BpmnSequenceFlow).waypoints !== undefined &&
          (element as BpmnSequenceFlow).source !== insertPoint &&
          (element as BpmnSequenceFlow).target !== insertPoint &&
          waypointsToLines((element as BpmnSequenceFlow).waypoints).some(
            (line) => !condition(line)
          )
      )
    );
  }

  /**
   * Create space on the left side of the insert point
   *
   * @param modeler
   * @param insertPoint
   * @param innerSubProcesses
   * @param xDelta
   */
  private createLeftSpace(
    modeler: BpmnModeler,
    insertPoint: BpmnFlowNode,
    innerSubProcesses: BpmnSubProcess[],
    xDelta: number
  ): void {
    this.createSpaceDirection(
      modeler,
      innerSubProcesses,
      insertPoint.x,
      'e',
      xDelta
    );
  }

  /**
   * Create space on the right side of the insert point
   *
   * @param modeler
   * @param insertPoint
   * @param innerSubProcesses
   * @param xDelta
   */
  private createRightSpace(
    modeler: BpmnModeler,
    insertPoint: BpmnFlowNode,
    innerSubProcesses: BpmnSubProcess[],
    xDelta: number
  ): void {
    this.createSpaceDirection(
      modeler,
      innerSubProcesses,
      insertPoint.x + insertPoint.width,
      'e',
      xDelta
    );
  }

  /**
   * Create space above the insert point
   *
   * @param modeler
   * @param insertPoint
   * @param innerSubProcesses
   * @param yDelta
   */
  private createTopSpace(
    modeler: BpmnModeler,
    insertPoint: BpmnFlowNode,
    innerSubProcesses: BpmnSubProcess[],
    yDelta: number
  ): void {
    this.createSpaceDirection(
      modeler,
      innerSubProcesses,
      insertPoint.y,
      's',
      yDelta
    );
  }

  /**
   * Create space below the insert point
   *
   * @param modeler
   * @param insertPoint
   * @param innerSubProcesses
   * @param yDelta
   */
  private createBottomSpace(
    modeler: BpmnModeler,
    insertPoint: BpmnFlowNode,
    innerSubProcesses: BpmnSubProcess[],
    yDelta: number
  ): void {
    this.createSpaceDirection(
      modeler,
      innerSubProcesses,
      insertPoint.y + insertPoint.height,
      's',
      yDelta
    );
  }

  /**
   * Create space in a specific direction by moving all objects into that direction
   *
   * @param modeler
   * @param innerSubProcesses
   * @param from the coordinate that determines whether objects belong to the moved objects or not
   * @param direction the direction of the movement
   * @param delta the delta that determines how much to move
   */
  private createSpaceDirection(
    modeler: BpmnModeler,
    innerSubProcesses: BpmnSubProcess[],
    from: number,
    direction: 'e' | 's',
    delta: number
  ): void {
    const elements = modeler
      .get('elementRegistry')
      .filter(
        (element) =>
          (direction === 'e'
            ? (element as BpmnFlowNode).x
            : (element as BpmnFlowNode).y) >= from &&
          (innerSubProcesses.includes(
            (element as BpmnFlowNode).parent as BpmnSubProcess
          ) ||
            is((element as BpmnFlowNode).parent, 'bpmn:Process')) &&
          !innerSubProcesses.includes(element as BpmnSubProcess)
      );
    const toMove = selfAndChildren(elements, true, -1);
    modeler
      .get('modeling')
      .createSpace(
        toMove,
        innerSubProcesses,
        { x: direction === 'e' ? delta : 0, y: direction === 's' ? delta : 0 },
        direction,
        from
      );
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Get all parent processes of a specific node
   *
   * @param node
   */
  private getParents(node: BpmnFlowNode): BpmnSubProcess[] {
    const parents = [];
    for (
      let parent = node.parent;
      !BpmnUtils.isProcess(parent);
      parent = parent.parent
    ) {
      parents.push(parent);
    }
    return parents as BpmnSubProcess[];
  }
}
