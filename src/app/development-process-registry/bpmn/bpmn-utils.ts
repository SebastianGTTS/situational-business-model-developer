import { is } from 'bpmn-js/lib/util/ModelUtil';
import { isLabel } from 'bpmn-js/lib/util/LabelUtil';
import BpmnElement = BpmnElements.BpmnElement;

/**
 * Checks whether the element is a flow element
 *
 * @param element
 */
export function isFlowNode(element: BpmnElement): boolean {
  return is(element, 'bpmn:FlowNode') && !isLabel(element);
}

/**
 * Checks whether the element is the main process
 *
 * @param element
 */
export function isProcess(element: BpmnElement): boolean {
  return is(element, 'bpmn:Process') && !isLabel(element);
}

/**
 * Checks whether the element is a sub process
 *
 * @param element
 * @return true if the element is a sub process
 */
export function isSubProcess(element: BpmnElement): boolean {
  return is(element, 'bpmn:SubProcess') && !isLabel(element);
}

/**
 * Checks whether the element is a start event
 *
 * @param element
 */
export function isStartEvent(element: BpmnElement): boolean {
  return is(element, 'bpmn:StartEvent') && !isLabel(element);
}

/**
 * Checks whether the element is an end event
 *
 * @param element
 */
export function isEndEvent(element: BpmnElement): boolean {
  return is(element, 'bpmn:EndEvent') && !isLabel(element);
}

/**
 * Checks whether the element is an exclusive gateway
 *
 * @param element
 * @return true if the element is an exclusive gateway
 */
export function isExclusiveGateway(element: BpmnElement): boolean {
  return is(element, 'bpmn:ExclusiveGateway') && !isLabel(element);
}

/**
 * Checks whether the element is a parallel gateway
 *
 * @param element
 * @return true if the element is a parallel gateway
 */
export function isParallelGateway(element: BpmnElement): boolean {
  return is(element, 'bpmn:ParallelGateway') && !isLabel(element);
}

/**
 * Checks whether the element is a flow element
 *
 * @param element
 * @return true if the element is a flow element
 */
export function isSequenceFlow(element: BpmnElement): boolean {
  return is(element, 'bpmn:SequenceFlow') && !isLabel(element);
}

/**
 * Checks whether the element is a task
 *
 * @param element
 * @return true if the element is a task
 */
export function isTask(element: BpmnElement): boolean {
  return is(element, 'bpmn:Task') && !isLabel(element);
}

/**
 * Checks whether the element is a call activity
 *
 * @param element
 * @return true if the element is a call activity
 */
export function isCallActivity(element: BpmnElement): boolean {
  return is(element, 'bpmn:CallActivity') && !isLabel(element);
}

/**
 * Checks whether the element is a text annotation
 *
 * @param element
 * @return true if the element is a text annotation
 */
export function isTextAnnotation(element: BpmnElement): boolean {
  return is(element, 'bpmn:TextAnnotation') && !isLabel(element);
}

/**
 * Checks whether the element is an association
 *
 * @param element
 * @return true if the element is an association
 */
export function isAssociation(element: BpmnElement): boolean {
  return is(element, 'bpmn:Association') && !isLabel(element);
}
