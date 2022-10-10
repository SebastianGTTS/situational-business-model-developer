import { EventBus } from 'bpmn-js';

export default class BmProcessLabelEditing {
  private static readonly PRIORITY = 1500;

  static $inject = ['eventBus'];

  constructor(private eventBus: EventBus) {
    this.init();
  }

  init(): void {
    this.eventBus.on(
      'element.dblclick',
      BmProcessLabelEditing.PRIORITY,
      () => false
    );
  }
}
