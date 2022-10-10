import ReplaceMenuProvider from 'bpmn-js/lib/features/popup-menu/ReplaceMenuProvider';
import { BpmnElement } from 'bpmn-js';

export default class BmProcessPatternsReplaceMenuProvider extends ReplaceMenuProvider {
  _createEntries(element: BpmnElement, replaceOptions: unknown[]): unknown {
    const allowedTargetTypes = new Set<string>([
      'bpmn:StartEvent',
      'bpmn:EndEvent',
      'bpmn:ExclusiveGateway',
      'bpmn:ParallelGateway',
      'bpmn:Task',
      'bpmn:CallActivity',
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    replaceOptions = replaceOptions.filter((option: any): boolean => {
      if (option.target.eventDefinitionType) {
        return allowedTargetTypes.has(option.target.eventDefinitionType);
      }
      return allowedTargetTypes.has(option.target.type);
    });
    return super._createEntries(element, replaceOptions);
  }

  _createSequenceFlowEntries(): unknown[] {
    return [];
  }

  _getLoopEntries(): unknown[] {
    return [];
  }
}
