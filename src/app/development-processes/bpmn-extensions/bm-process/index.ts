import BmProcessContextPadProvider from './BmProcessContextPadProvider';
import BmProcessLabelEditing from './BmProcessLabelEditing';
import BmProcessPaletteProvider from './BmProcessPaletteProvider';
import BmProcessRuleProvider from './BmProcessRuleProvider';
import BmProcessTaskRenderer from './BmProcessTaskRenderer';
import ContextPadModule from 'diagram-js/lib/features/context-pad';
import CoreModule from 'bpmn-js/lib/core';
import ModelingModule from 'bpmn-js/lib/features/modeling';
import PaletteModule from 'bpmn-js/lib/features/palette';

export default {
  __depends__: [ContextPadModule, CoreModule, ModelingModule, PaletteModule],
  __init__: [
    'bmProcessLabelEditing',
    'bmProcessRuleProvider',
    'contextPadProvider',
    'dropOnFlowBehavior',
    'paletteProvider',
    'taskRenderer',
  ],
  bmProcessLabelEditing: ['type', BmProcessLabelEditing],
  bmProcessRuleProvider: ['type', BmProcessRuleProvider],
  contextPadProvider: ['type', BmProcessContextPadProvider],
  dropOnFlowBehavior: ['value', null],
  paletteProvider: ['type', BmProcessPaletteProvider],
  taskRenderer: ['type', BmProcessTaskRenderer],
};
