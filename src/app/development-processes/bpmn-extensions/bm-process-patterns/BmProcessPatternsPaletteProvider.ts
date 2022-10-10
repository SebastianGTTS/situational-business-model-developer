import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
import { BpmnElement } from 'bpmn-js';

export default class BmProcessPatternsPaletteProvider extends PaletteProvider {
  getPaletteEntries(element: BpmnElement): { [id: string]: unknown } {
    const actionNames = [
      'hand-tool',
      'lasso-tool',
      'space-tool',
      'global-connect-tool',
      'create.start-event',
      'create.end-event',
      'create.exclusive-gateway',
      'create.task',
      'tool-separator',
    ];
    const actions = super.getPaletteEntries(element);
    const newActions: { [id: string]: unknown } = {};
    for (const name of actionNames) {
      newActions[name] = actions[name];
    }
    return newActions;
  }
}
