import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
import { BpmnElement } from 'bpmn-js';

export default class BmProcessPaletteProvider extends PaletteProvider {
  getPaletteEntries(element: BpmnElement): { [id: string]: unknown } {
    const actions = super.getPaletteEntries(element);
    return {
      'hand-tool': actions['hand-tool'],
      'space-tool': actions['space-tool'],
      'lasso-tool': actions['lasso-tool'],
    };
  }
}
