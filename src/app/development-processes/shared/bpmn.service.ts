import { Injectable } from '@angular/core';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import bmProcess from '../bpmn-extensions/bm-process';
import bmProcessPatterns from '../bpmn-extensions/bm-process-patterns';
import bmdl from '../../../assets/bpmn_bmdl.json';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { center } from 'diagram-js/lib/util/PositionUtil';
import { getBBox, selfAndChildren } from 'diagram-js/lib/util/Elements';
import { pointInRect } from 'diagram-js/lib/util/Geometry';
import { DevelopmentMethod } from '../../development-process-registry/development-method/development-method';
import { ProcessPattern } from '../../development-process-registry/process-pattern/process-pattern';
import { Type } from '../../development-process-registry/method-elements/type/type';
import { Artifact } from '../../development-process-registry/method-elements/artifact/artifact';
import { Decision } from '../../development-process-registry/bm-process/decision';
import { BpmnViewerService } from '../../development-process-view/shared/bpmn-viewer.service';

@Injectable({
  providedIn: 'root'
})
export class BpmnService extends BpmnViewerService {

  /**
   * Get a BpmnModeler with customizations to support the creation of process patterns
   *
   * @returns the bpmnModeler
   */
  getBpmnProcessPatternModeler(): BpmnModeler {
    return new BpmnModeler({
      additionalModules: [
        bmProcessPatterns,
      ],
      moddleExtensions: {
        bmdl,
      }
    });
  }

  /**
   * Get a BpmnModeler with customizations to support the development of business model development processes
   *
   * @returns a bpmnModeler
   */
  getBmProcessModeler(): BpmnModeler {
    return new BpmnModeler({
      additionalModules: [
        bmProcess,
      ],
      moddleExtensions: {
        bmdl,
      },
    });
  }

  appendBpmn(modeler: BpmnModeler, processPattern: ProcessPattern, lastElement): Promise<void> {
    const processPatternModeler = this.getBmProcessModeler();
    return processPatternModeler.importXML(processPattern.pattern).then(() => {
      const operation = new BpmnAttachOperation(modeler, processPatternModeler, lastElement);
      operation.init();
      operation.attach(processPattern.name, processPattern._id);
    }).finally(() => processPatternModeler.destroy());
  }

  /**
   * Removes a process pattern from the modeler
   *
   * @param modeler the modeler
   * @param subProcessElement the sub process representing the process pattern
   */
  removeProcessPattern(modeler: BpmnModeler, subProcessElement) {
    const modeling = modeler.get('modeling');
    if (is(subProcessElement.parent, 'bpmn:SubProcess')) {
      const operation = new BpmnRemoveOperation(modeler, subProcessElement);
      operation.init();
      operation.remove();
    } else {
      modeling.removeElements([subProcessElement]);
    }
  }

  /**
   * Set types of an activity to specify which methods can be used
   *
   * @param modeler the modeler
   * @param activityId the id of the activity
   * @param inherit whether the types should be inherited
   * @param neededTypes the needed types of the method
   * @param forbiddenTypes the forbidden types of the method
   */
  setTypesOfActivity(
    modeler: BpmnModeler, activityId: string, inherit: boolean,
    neededTypes: { list: string, element: Type }[], forbiddenTypes: { list: string, element: Type }[],
  ) {
    const moddle = modeler.get('moddle');
    const modeling = modeler.get('modeling');
    const elementRegistry = modeler.get('elementRegistry');
    modeling.updateProperties(elementRegistry.get(activityId), {
      inherit,
      neededType: neededTypes.map((element) => mapTypes(moddle, element)),
      forbiddenType: forbiddenTypes.map((element) => mapTypes(moddle, element)),
    });
  }

  /**
   * Get types of an activity that specify which methods can be used. Also queries parents if types are inherited.
   *
   * @param modeler the modeler
   * @param activityId the id of the activity
   */
  getTypesOfActivity(modeler: BpmnModeler, activityId: string): {
    neededType: { list: string, element: { _id: string, name: string } }[],
    forbiddenType: { list: string, element: { _id: string, name: string } }[],
  } {
    const elementRegistry = modeler.get('elementRegistry');
    const activity = elementRegistry.get(activityId);
    let businessObject = activity.businessObject;
    while (businessObject && (businessObject.inherit || !businessObject.neededType)) {
      businessObject = businessObject.$parent;
    }
    return {
      neededType: businessObject ? businessObject.get('neededType') : [],
      forbiddenType: businessObject ? businessObject.get('forbiddenType') : [],
    };
  }

  /**
   * Selects a development method for a process pattern task and adds the development method to the task
   *
   * @param modeler the modeler
   * @param taskElement the task element
   * @param developmentMethod the development method
   */
  selectDevelopmentMethodForProcessTask(modeler: BpmnModeler, taskElement, developmentMethod: DevelopmentMethod) {
    const moddle = modeler.get('moddle');
    const modeling = modeler.get('modeling');
    modeling.updateProperties(taskElement, {
      method: moddle.create('bmdl:Method', {
        name: developmentMethod.name,
        id: developmentMethod._id,
      })
    });
  }

  /**
   * Removes a development method from a task in the process
   *
   * @param modeler the modeler that currently displays the process
   * @param taskElement the task element from which the method should be removed
   */
  removeDevelopmentMethodFromProcessTask(modeler: BpmnModeler, taskElement) {
    const modeling = modeler.get('modeling');
    modeling.updateProperties(taskElement, {method: null});
  }

  insertProcessPatternIntoCallActivity(modeler: BpmnModeler, callActivityElement, processPattern: ProcessPattern) {
    const processPatternModeler = this.getBmProcessModeler();
    return processPatternModeler.importXML(processPattern.pattern).then(() => {
      const operation = new BpmnInsertOperation(modeler, processPatternModeler, callActivityElement);
      operation.init();
      operation.insert(processPattern.name, processPattern._id);
    }).finally(() => processPatternModeler.destroy());
  }

  /**
   * Get all activities that have a method defined
   *
   * @param modeler the modeler of the current model
   * @returns elements that have a method defined
   */
  getActivitiesWithMethod(modeler: BpmnModeler): any[] {
    return modeler.get('elementRegistry')
      .filter((element) => element.businessObject.get('method'));
  }

  /**
   * Get all method ids used in the model
   *
   * @param modeler the modeler of the current model
   * @returns used method ids
   */
  getUsedMethodIds(modeler: BpmnModeler): string[] {
    return this.getActivitiesWithMethod(modeler)
      .map((element) => element.businessObject.get('method').get('id'));
  }

  /**
   * Get all pattern elements of the current model
   *
   * @param modeler the modeler of the current model
   * @returns elements that are used as a pattern
   */
  getPatterns(modeler: BpmnModeler) {
    return modeler.get('elementRegistry')
      .filter((element) => element.businessObject.get('processPatternId'));
  }

  /**
   * Get all pattern ids used in the model
   *
   * @param modeler the modeler of the current model
   * @returns used method ids
   */
  getUsedPatternIds(modeler: BpmnModeler): string[] {
    return this.getPatterns(modeler)
      .map((element) => element.businessObject.get('processPatternId'));
  }

  /**
   * Check whether there are artifacts that are not created earlier
   *
   * @param modeler the modeler of the current model
   * @param decisions the decisions of the bm process
   */
  checkArtifacts(modeler: BpmnModeler, decisions: { [elementId: string]: Decision }): { [elementId: string]: Artifact[] } {
    const operation = new BpmnCheckArtifacts(modeler, decisions);
    return operation.checkArtifacts();
  }

}

class BpmnOperation {

  readonly currentElementRegistry;
  readonly currentElementFactory;
  readonly currentBpmnFactory;
  readonly currentModdle;
  readonly currentModeling;

  constructor(current: BpmnModeler) {
    this.currentElementRegistry = current.get('elementRegistry');
    this.currentElementFactory = current.get('elementFactory');
    this.currentBpmnFactory = current.get('bpmnFactory');
    this.currentModdle = current.get('moddle');
    this.currentModeling = current.get('modeling');
  }

  init() {
  }

  /**
   * Reconnect an already existing connection
   *
   * @param source the new source
   * @param target the new target
   * @param oldConnection the old connection
   */
  reconnect(source, target, oldConnection) {
    const flowBusinessObject = this.currentBpmnFactory.create(oldConnection.businessObject.$type, {
      name: oldConnection.businessObject.name,
    });
    let waypoints: any[] = oldConnection.waypoints.slice();
    if (oldConnection.source !== source) {
      // Find index of last point that is in the new source
      let index: number = null;
      for (let i = waypoints.length - 1; i >= 0; --i) {
        if (pointInRect(waypoints[i], source, 20)) {
          index = i;
          break;
        }
      }
      if (index !== null) {
        waypoints = waypoints.slice(index);
      } else if (waypoints.length > 0) {
        waypoints.unshift({x: source.x + source.width / 2, y: source.y + source.height / 2});
      }
    }
    if (oldConnection.target !== target) {
      // Find index of first point that is in the new target
      let index: number = null;
      for (let i = 0; i < waypoints.length; ++i) {
        if (pointInRect(waypoints[i], target, 20)) {
          index = i;
          break;
        }
      }
      if (index !== null) {
        waypoints = waypoints.slice(0, index + 1);
      } else if (waypoints.length > 0) {
        waypoints.push({x: target.x + source.width / 2, y: target.y + target.height / 2});
      }
    }
    const flowElement = this.currentElementFactory.createConnection({
      type: oldConnection.type,
      businessObject: flowBusinessObject,
      waypoints: waypoints.length > 1 ? waypoints : undefined,
    });
    this.currentModeling.createConnection(source, target, flowElement, oldConnection.parent);
    if (flowElement.label) {
      this.currentModeling.updateLabel(flowElement, oldConnection.businessObject.name, {
        x: oldConnection.label.x,
        y: oldConnection.label.y,
        height: oldConnection.label.height,
        width: oldConnection.label.width,
      });
    }
  }

  /**
   * Copy BPMN relevant data, like types
   *
   * @param oldElement the old element
   * @param newElement the new element
   */
  copyBpmnData(oldElement, newElement) {
    this.currentModeling.updateProperties(newElement, {
      inherit: oldElement.businessObject.get('inherit'),
      neededType: oldElement.businessObject.get('neededType').map((element) => mapTypes(this.currentModdle, element)),
      forbiddenType: oldElement.businessObject.get('forbiddenType').map((element) => mapTypes(this.currentModdle, element)),
    });
  }

}

class BpmnAppendOperation extends BpmnOperation {

  readonly appendElementRegistry;

  readonly suffix = '_' + String(Date.now());

  oldBoundaries: { x: number, y: number, width: number, height: number } = null;
  processPoint: { x: number, y: number } = null;
  processSize: { width: number, height: number };

  constructor(current: BpmnModeler, append: BpmnModeler) {
    super(current);
    this.appendElementRegistry = append.get('elementRegistry');
  }

  init() {
    super.init();
    this.calculateOldBoundaries();
    this.calculateProcessSize();
  }

  private calculateOldBoundaries() {
    const bbox = getBBox(this.appendElementRegistry.filter((element) => !is(element, 'bpmn:Process')));
    this.oldBoundaries = {
      x: bbox.x,
      y: bbox.y,
      width: bbox.width,
      height: bbox.height,
    };
  }

  private calculateProcessSize() {
    this.processSize = {
      height: this.oldBoundaries.height + 50,
      width: this.oldBoundaries.width + 40,
    };
  }

  /**
   * Translate a point into the new process
   *
   * @param point the point
   * @returns the translated point
   */
  translatePoint(point: { x: number, y: number }): { x: number, y: number } {
    return {x: point.x - this.oldBoundaries.x + this.processPoint.x + 20, y: point.y - this.oldBoundaries.y + this.processPoint.y + 30};
  }

  /**
   * Create a subprocess
   *
   * @param name the name of the subprocess
   * @param processPatternId the id of the process pattern
   * @param parent the parent of the subprocess
   * @returns the created subprocess
   */
  createSubProcess(name: string, processPatternId: string, parent): any {
    const bmBusinessObject = this.currentBpmnFactory.create('bpmn:SubProcess', {name});
    const bmElement = this.currentElementFactory.createShape({type: 'bpmn:SubProcess', isExpanded: true, businessObject: bmBusinessObject});
    const subprocess = this.currentModeling.createShape(bmElement, {...this.processPoint, ...this.processSize}, parent);
    this.currentModeling.updateProperties(subprocess, {
      processPatternId,
    });
    return subprocess;
  }

  /**
   * Append all FlowNodes and TextAnnotations to the subprocess
   *
   * @param subProcess the subprocess
   */
  appendNodes(subProcess) {
    this.appendElementRegistry.filter(
      (element) => (
        is(element, 'bpmn:FlowNode') || is(element, 'bpmn:TextAnnotation')
      ) && is(element, element.type)
    ).forEach((element) => {
      const bmBusinessObject = this.currentBpmnFactory.create(element.businessObject.$type, {
        ...element.businessObject,
        id: element.businessObject.id + this.suffix,
        attachedToRef: element.businessObject.attachedToRef
          ? this.currentElementRegistry.get(element.businessObject.attachedToRef.id + this.suffix)
          : undefined,
      });
      const bmElement = this.currentElementFactory.createShape({type: element.type, businessObject: bmBusinessObject});
      this.currentModeling.createShape(bmElement, {
        ...this.translatePoint(element),
        height: element.height,
        width: element.width,
      }, subProcess);
      if (bmElement.label) {
        this.currentModeling.updateLabel(bmElement, bmBusinessObject.name, {
          ...this.translatePoint(element.label),
          height: element.label.height,
          width: element.label.width,
        });
      }
    });
  }

  /**
   * Create all connections
   *
   * @param subProcess the subprocess in which the connections should be created
   */
  connectNodes(subProcess) {
    this.appendElementRegistry.filter(
      (element) => (is(element, 'bpmn:SequenceFlow') || is(element, 'bpmn:Association')) && is(element, element.type)
    ).forEach((element) => {
      const connection = element.businessObject;
      const source = this.currentElementRegistry.get(connection.sourceRef.id + this.suffix);
      const target = this.currentElementRegistry.get(connection.targetRef.id + this.suffix);
      const waypoints = element.waypoints.map((waypoint) => this.translatePoint(waypoint));
      const flowBusinessObject = this.currentBpmnFactory.create(connection.$type, {
        id: connection.id + this.suffix,
        name: connection.name,
      });
      const flowElement = this.currentElementFactory.createConnection({type: element.type, businessObject: flowBusinessObject, waypoints});
      this.currentModeling.createConnection(source, target, flowElement, subProcess);
      if (flowElement.label) {
        this.currentModeling.updateLabel(flowElement, connection.name, {
          ...this.translatePoint(element.label),
          height: element.label.height,
          width: element.label.width,
        });
      }
    });
  }

}

class BpmnInsertOperation extends BpmnAppendOperation {

  private readonly insertElement;

  constructor(current: BpmnModeler, append: BpmnModeler, insertElement) {
    super(current, append);
    this.insertElement = insertElement;
  }

  init() {
    super.init();
    this.calculateProcessPoint();
  }

  private calculateProcessPoint() {
    const mid = center(this.insertElement);
    this.processPoint = {
      x: mid.x - this.processSize.width / 2,
      y: mid.y - this.processSize.height / 2,
    };
  }

  insert(processName: string, processPatternId: string) {
    const subprocess = this.insertSubProcess(processName, processPatternId);
    this.appendNodes(subprocess);
    this.connectNodes(subprocess);
  }

  private insertSubProcess(processName: string, processPatternId: string) {
    this.createSpace();
    const subprocess = this.createSubProcess(processName, processPatternId, this.insertElement.parent);
    this.insertElement.incoming.forEach((flow) => this.reconnect(flow.source, subprocess, flow));
    this.insertElement.outgoing.forEach((flow) => this.reconnect(subprocess, flow.target, flow));
    this.currentModeling.removeElements([...this.insertElement.incoming, ...this.insertElement.outgoing, this.insertElement]);
    return subprocess;
  }

  createSubProcess(name: string, processPatternId: string, parent): any {
    const subprocess = super.createSubProcess(name, processPatternId, parent);
    this.copyBpmnData(this.insertElement, subprocess);
    this.currentModeling.updateProperties(subprocess, {
      taskName: this.insertElement.businessObject.name,
    });
    return subprocess;
  }

  private createSpace() {
    const delta = {
      x: (this.processSize.width - this.insertElement.width) / 2,
      y: (this.processSize.height - this.insertElement.height) / 2,
    };
    const innerSubProcesses = this.getParents();
    const leftRightCheck = this.checkLeftSpace(innerSubProcesses) || this.checkRightSpace(innerSubProcesses);
    const topBottomCheck = this.checkTopSpace(innerSubProcesses) || this.checkBottomSpace(innerSubProcesses);
    const completeSpaceCheck = this.checkCompleteSpace(innerSubProcesses);
    if (leftRightCheck || (completeSpaceCheck && !topBottomCheck)) {
      this.createLeftSpace(innerSubProcesses, delta.x);
      this.createRightSpace(innerSubProcesses, delta.x);
    }
    if (topBottomCheck) {
      this.createTopSpace(innerSubProcesses, delta.y);
      this.createBottomSpace(innerSubProcesses, delta.y);
    }
  }

  private checkLeftSpace(innerSubProcesses) {
    const condition = (element) => (
      element.x + element.width < this.processPoint.x ||
      element.x > this.insertElement.x ||
      element.y + element.height < this.insertElement.y ||
      element.y > this.insertElement.y + this.insertElement.height
    );
    return this.checkSpace(condition, innerSubProcesses) || this.insertElement.parent.x > this.processPoint.x;
  }

  private checkRightSpace(innerSubProcesses) {
    const condition = (element) => (
      element.x + element.width < this.insertElement.x + this.insertElement.width ||
      element.x > this.processPoint.x + this.processSize.width ||
      element.y + element.height < this.insertElement.y ||
      element.y > this.insertElement.y + this.insertElement.height
    );
    return this.checkSpace(condition, innerSubProcesses) || (
      this.insertElement.parent.x + this.insertElement.parent.width < this.processPoint.x + this.processSize.width
    );
  }

  private checkTopSpace(innerSubProcesses) {
    const condition = (element) => (
      element.x + element.width < this.insertElement.x ||
      element.x > this.insertElement.x + this.insertElement.width ||
      element.y + element.height < this.processPoint.y ||
      element.y > this.insertElement.y
    );
    return this.checkSpace(condition, innerSubProcesses) || this.insertElement.parent.y > this.processPoint.y;
  }

  private checkBottomSpace(innerSubProcesses) {
    const condition = (element) => (
      element.x + element.width < this.insertElement.x ||
      element.x > this.insertElement.x + this.insertElement.width ||
      element.y + element.height < this.insertElement.y + this.insertElement.height ||
      element.y > this.processPoint.y + this.processSize.height
    );
    return this.checkSpace(condition, innerSubProcesses) || (
      this.insertElement.parent.y + this.insertElement.parent.height < this.processPoint.y + this.processSize.height
    );
  }

  private checkCompleteSpace(innerSubProcesses) {
    const condition = (element) => (
      element.x + element.width < this.processPoint.x ||
      element.x > this.processPoint.x + this.processSize.width ||
      element.y + element.height < this.processPoint.y ||
      element.y > this.processPoint.y + this.processSize.height
    );
    return this.checkSpace(condition, innerSubProcesses);
  }

  private checkSpace(condition: (element) => boolean, innerSubProcesses) {
    const elements = this.currentElementRegistry.filter((element) =>
      element.id !== this.insertElement.id &&
      !is(element, 'bpmn:Process') &&
      !innerSubProcesses.includes(element)
    );
    const waypointsToLines = (waypoints) => {
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
    return elements.some((element) => !element.waypoints && !condition(element)) ||
      elements.some((element) =>
        element.waypoints &&
        element.source !== this.insertElement &&
        element.target !== this.insertElement &&
        waypointsToLines(element.waypoints).some((line) => !condition(line))
      );
  }

  private createLeftSpace(innerSubProcesses, xDelta: number) {
    this.createSpaceDirection(innerSubProcesses, this.insertElement.x, 'e', xDelta);
    this.processPoint = {
      x: this.processPoint.x + xDelta,
      y: this.processPoint.y,
    };
  }

  private createRightSpace(innerSubProcesses, xDelta: number) {
    this.createSpaceDirection(innerSubProcesses, this.insertElement.x + this.insertElement.width, 'e', xDelta);
  }

  private createTopSpace(innerSubProcesses, yDelta: number) {
    this.createSpaceDirection(innerSubProcesses, this.insertElement.y, 's', yDelta);
    this.processPoint = {
      x: this.processPoint.x,
      y: this.processPoint.y + yDelta,
    };
  }

  private createBottomSpace(innerSubProcesses, yDelta: number) {
    this.createSpaceDirection(innerSubProcesses, this.insertElement.y + this.insertElement.height, 's', yDelta);
  }

  private createSpaceDirection(innerSubProcesses, from: number, direction: 'e' | 's', delta: number) {
    const elements = this.currentElementRegistry.filter((element) =>
      (direction === 'e' ? element.x : element.y) >= from &&
      (innerSubProcesses.includes(element.parent) || is(element.parent, 'bpmn:Process')) &&
      !innerSubProcesses.includes(element)
    );
    const toMove = selfAndChildren(elements, true, -1);
    this.currentModeling.createSpace(
      toMove,
      innerSubProcesses,
      {x: direction === 'e' ? delta : 0, y: direction === 's' ? delta : 0},
      direction,
      from,
    );
  }

  private getParents(): any[] {
    const parents = [];
    for (let parent = this.insertElement.parent; !is(parent, 'bpmn:Process'); parent = parent.parent) {
      parents.push(parent);
    }
    return parents;
  }

}

class BpmnRemoveOperation extends BpmnOperation {

  private readonly subprocess;

  constructor(current: BpmnModeler, subprocess) {
    super(current);
    this.subprocess = subprocess;
  }

  remove() {
    const activity = this.createActivity();
    this.reconnectActivity(activity);
    this.removeSubprocess();
  }

  private createActivity() {
    const bmBusinessObject = this.currentBpmnFactory.create('bpmn:CallActivity', {name: this.subprocess.businessObject.get('taskName')});
    const bmElement = this.currentElementFactory.createShape({type: 'bpmn:CallActivity', businessObject: bmBusinessObject});
    const activity = this.currentModeling.createShape(bmElement, center(this.subprocess), this.subprocess.parent);
    this.copyBpmnData(this.subprocess, activity);
    return activity;
  }

  private reconnectActivity(activity) {
    this.subprocess.incoming.forEach((flow) => this.reconnect(flow.source, activity, flow));
    this.subprocess.outgoing.forEach((flow) => this.reconnect(activity, flow.target, flow));
  }

  private removeSubprocess() {
    this.currentModeling.removeElements([
      ...this.subprocess.incoming,
      ...this.subprocess.outgoing,
      this.subprocess,
    ]);
  }

}

class BpmnAttachOperation extends BpmnAppendOperation {

  private readonly attachmentElement;

  constructor(current: BpmnModeler, append: BpmnModeler, attachmentElement) {
    super(current, append);
    this.attachmentElement = attachmentElement;
  }

  init() {
    super.init();
    this.calculateProcessPoint();
  }

  private calculateProcessPoint() {
    const point = center(this.attachmentElement);
    this.processPoint = {
      x: this.attachmentElement.x + this.attachmentElement.width + 50,
      y: point.y - (this.processSize.height / 2),
    };
  }

  attach(processName: string, processPatternId: string) {
    const subprocess = this.appendSubProcess(processName, processPatternId);
    this.appendNodes(subprocess);
    this.connectNodes(subprocess);
  }

  private appendSubProcess(processName: string, processPatternId: string) {
    const subprocess = this.createSubProcess(processName, processPatternId, this.attachmentElement.parent);
    this.currentModeling.createConnection(this.attachmentElement, subprocess, {type: 'bpmn:SequenceFlow'}, this.attachmentElement.parent);
    return subprocess;
  }

}

class BpmnCheckArtifacts {

  private readonly elementRegistry;
  private readonly decisions: { [elementId: string]: Decision };

  private visitedNodes = new Set();
  private artifacts: { [elementId: string]: Artifact[] } = {};
  private currentNodes = [];

  constructor(modeler: BpmnModeler, decisions: { [elementId: string]: Decision }) {
    this.elementRegistry = modeler.get('elementRegistry');
    this.decisions = decisions;
  }

  checkArtifacts(): { [elementId: string]: Artifact[] | null } {
    const missingMap = {};
    const startingElement = this.elementRegistry.find((element) => is(element, 'bpmn:StartEvent') && is(element.parent, 'bpmn:Process'));
    this.currentNodes.push(startingElement);
    while (this.currentNodes.length > 0) {
      const currentNode = this.currentNodes[0];
      this.currentNodes.splice(0, 1);
      let incomingArtifacts;
      if (is(currentNode, 'bpmn:ParallelGateway')) {
        incomingArtifacts = this.getIncomingArtifactsUnion(currentNode);
        if (incomingArtifacts === null) {
          continue;
        }
      } else if (is(currentNode, 'bpmn:ExclusiveGateway')) {
        incomingArtifacts = this.getIncomingArtifactsIntersect(currentNode);
      } else {
        incomingArtifacts = this.getIncomingArtifacts(currentNode);
      }
      this.visitedNodes.add(currentNode);
      const incomingArtifactIds = incomingArtifacts.map((artifact) => artifact._id);
      const neededArtifacts = this.getNeededArtifacts(currentNode);
      const missing = neededArtifacts.filter((artifact) => !incomingArtifactIds.includes(artifact._id));
      if (missing.length > 0 || currentNode.id in missingMap) {
        missingMap[currentNode.id] = missing;
      }
      const previousArtifactIds = currentNode.id in this.artifacts ? this.artifacts[currentNode.id].map((artifact) => artifact._id) : null;
      this.artifacts[currentNode.id] = [
        ...incomingArtifacts,
        ...this.getCreatedArtifacts(currentNode),
      ];
      const currentArtifactIds = this.artifacts[currentNode.id].map((artifact) => artifact._id);
      if (previousArtifactIds) {
        const unchanged = currentArtifactIds.every((id) => previousArtifactIds.includes(id)) &&
          previousArtifactIds.every((id) => currentArtifactIds.includes(id));
        if (unchanged) {
          continue;
        }
      }
      this.currentNodes.push(...this.getTargets(currentNode));
    }
    this.elementRegistry.getAll()
      .filter((element) => is(element, 'bpmn:FlowNode') && !this.visitedNodes.has(element) && !is(element, 'bpmn:SubProcess'))
      .forEach((element) => missingMap[element.id] = null);
    return missingMap;
  }

  getNeededArtifacts(element): Artifact[] {
    return this.getDecisionArtifacts(element, true);
  }

  getCreatedArtifacts(element): Artifact[] {
    return this.getDecisionArtifacts(element, false);
  }

  getDecisionArtifacts(element, input = false): Artifact[] {
    if (element.id in this.decisions) {
      const artifacts: Artifact[] = [];
      const decision = this.decisions[element.id];
      const decisionArtifacts = input ? decision.inputArtifacts : decision.outputArtifacts;
      if (decisionArtifacts.selectedGroup === null || decisionArtifacts.selectedGroup === undefined) {
        return [];
      }
      const method = decision.method;
      const group = input
        ? method.inputArtifacts[decisionArtifacts.selectedGroup]
        : method.outputArtifacts[decisionArtifacts.selectedGroup];
      group.forEach((selection, index) => {
        if (selection.element) {
          artifacts.push(selection.element);
        } else {
          artifacts.push(...decisionArtifacts.elements[index].filter((e) => e));
        }
      });
      return artifacts;
    }
    return [];
  }

  getIncomingArtifactsUnion(element): Artifact[] {
    const artifacts: Artifact[] = [];
    const sources = this.getSources(element);
    if (sources.some((source) => !(source.id in this.artifacts))) {
      return null;
    }
    sources.forEach((source) => artifacts.push(...this.getArtifacts(source)));
    return artifacts;
  }

  getIncomingArtifactsIntersect(element): Artifact[] {
    const artifacts: Artifact[][] = [];
    const sources = this.getSources(element);
    if (sources.length === 0) {
      return [];
    }
    sources.filter((source) => source.id in this.artifacts).forEach((source) => artifacts.push(this.getArtifacts(source)));
    const others: string[][] = artifacts.map((group) => group.map((artifact) => artifact._id));
    others.slice(0, 1);
    let resultingArtifacts: Artifact[] = artifacts[0];
    others.forEach((group) => resultingArtifacts = resultingArtifacts.filter((artifact) => group.includes(artifact._id)));
    return resultingArtifacts;
  }

  getIncomingArtifacts(element): Artifact[] {
    const artifacts: Artifact[] = [];
    const sources = this.getSources(element);
    sources.forEach((source) => artifacts.push(...this.getArtifacts(source)));
    return artifacts;
  }

  getArtifacts(element): Artifact[] {
    if (element.id in this.artifacts) {
      return this.artifacts[element.id];
    }
    return [];
  }

  getSources(element): any[] {
    let node;
    let incomingFlows;
    for (
      node = element, incomingFlows = node.incoming;
      incomingFlows.length === 0;
      node = node.parent, incomingFlows = node.incoming
    ) {
      if (is(node.parent, 'bpmn:Process')) {
        return [];
      }
    }
    return incomingFlows.map((flow) => flow.source).map((source) => {
      if (is(source, 'bpmn:SubProcess')) {
        return source.children.find((e) => is(e, 'bpmn:EndEvent'));
      } else {
        return source;
      }
    });
  }

  getTargets(element): any[] {
    let node;
    let outgoingFlows;
    for (
      node = element, outgoingFlows = node.outgoing;
      outgoingFlows.length === 0;
      node = node.parent, outgoingFlows = node.outgoing
    ) {
      if (is(node.parent, 'bpmn:Process')) {
        return [];
      }
    }
    return outgoingFlows.map((flow) => flow.target).map((target) => {
      if (is(target, 'bpmn:SubProcess')) {
        return target.children.find((e) => is(e, 'bpmn:StartEvent'));
      } else {
        return target;
      }
    });
  }

}

function mapTypes(moddle, element: { list: string, element: Type }) {
  return moddle.create('bmdl:Type', {
    list: element.list,
    element: element.element
      ? moddle.create('bmdl:MethodElement', {
        _id: element.element._id,
        name: element.element.name,
      })
      : null,
  });
}
