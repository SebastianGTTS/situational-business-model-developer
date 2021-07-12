import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider';

export default class BmProcessPatternsOverrideContextPadProvider extends ContextPadProvider {


  getContextPadEntries(element) {
    const actions = super.getContextPadEntries(element);
    delete actions['append.intermediate-event'];
    return actions;
  }

}
