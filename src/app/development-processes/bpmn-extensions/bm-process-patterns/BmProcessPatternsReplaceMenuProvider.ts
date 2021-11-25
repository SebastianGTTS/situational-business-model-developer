import ReplaceMenuProvider from 'bpmn-js/lib/features/popup-menu/ReplaceMenuProvider';

export default class BmProcessPatternsReplaceMenuProvider extends ReplaceMenuProvider {
  _createEntries(element, replaceOptions) {
    const allowedTargetTypes = new Set<string>([
      'bpmn:StartEvent',
      'bpmn:EndEvent',
      'bpmn:ExclusiveGateway',
      'bpmn:ParallelGateway',
      'bpmn:Task',
      'bpmn:CallActivity',
    ]);
    replaceOptions = replaceOptions.filter((option) => {
      if (option.target.eventDefinitionType) {
        return allowedTargetTypes.has(option.target.eventDefinitionType);
      }
      return allowedTargetTypes.has(option.target.type);
    });
    return super._createEntries(element, replaceOptions);
  }

  _createSequenceFlowEntries() {
    return [];
  }

  _getLoopEntries() {
    return [];
  }
}
