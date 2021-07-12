import BmProcessPatternsContextPad from './BmProcessPatternsContextPad';
import BmProcessPatternsOverrideContextPadProvider from './BmProcessPatternsOverrideContextPadProvider';
import BmProcessPatternsPaletteProvider from './BmProcessPatternsPaletteProvider';
import BmProcessPatternsReplaceMenuProvider from './BmProcessPatternsReplaceMenuProvider';
import ContextPadModule from 'diagram-js/lib/features/context-pad';
import CoreModule from 'bpmn-js/lib/core';
import ModelingModule from 'bpmn-js/lib/features/modeling';
import PaletteModule from 'bpmn-js/lib/features/palette';

export default {
  __depends__: [ContextPadModule, CoreModule, ModelingModule, PaletteModule],
  __init__: ['bmProcessPatternsContextPad', 'paletteProvider', 'replaceMenuProvider'],
  bmProcessPatternsContextPad: ['type', BmProcessPatternsContextPad],
  contextPadProvider: ['type', BmProcessPatternsOverrideContextPadProvider],
  paletteProvider: ['type', BmProcessPatternsPaletteProvider],
  replaceMenuProvider: ['type', BmProcessPatternsReplaceMenuProvider],
};
